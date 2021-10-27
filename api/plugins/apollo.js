import process from 'node:process'
import fp from 'fastify-plugin'
import {ApolloServer} from 'apollo-server-fastify'
import {ApolloServerPluginDrainHttpServer as apolloDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground as apolloLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled as apolloLandingPageDisabled} from 'apollo-server-core'
import neo4j from 'neo4j-driver'
import {Neo4jGraphQL} from '@neo4j/graphql'
import {OGM} from '@neo4j/graphql-ogm'
import {loadTypeDefinitions, loadResolvers} from '../apollo/load-files.js'

/**
 *
 * @param {FastifyInstance} app
 * @returns {ApolloServerPlugin}
 */
function fastifyAppClosePlugin(app) {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close()
        }
      }
    }
  }
}

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async fastify => {
  // Init driver
  const driver = neo4j.driver(
    process.env.VL_NEO4J_DB,
    neo4j.auth.basic(process.env.VL_NEO4J_AUTH_USER, process.env.VL_NEO4J_AUTH_PASSWORD))
  // Load TypeDefs
  const typeDefs = await loadTypeDefinitions()
  // Init OGM
  const ogm = new OGM({typeDefs, driver})
  // Load Custom Resolvers
  const resolvers = await loadResolvers(ogm)
  // Init / create Neo4J GraphQL Schema
  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers,
    config: {
      jwt: {
        secret: process.env.VL_NEO4J_JWT_SECRET
      }
    }
  })

  const server = new ApolloServer({
    schema: neoSchema.schema,
    context: ({req}) => ({req}),
    plugins: [
      // Show graphql playground not on production
      process.env.NODE_ENV === 'production'
        ? apolloLandingPageDisabled()
        : apolloLandingPageGraphQLPlayground(),
      fastifyAppClosePlugin(fastify),
      apolloDrainHttpServer({httpServer: fastify.server})
    ]
  })
  // Start Apollo Server
  await server.start()

  fastify.register(server.createHandler())
})
