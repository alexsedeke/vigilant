import process from 'node:process'
import fp from 'fastify-plugin'
import {ApolloServer} from 'apollo-server-fastify'
import {ApolloServerPluginDrainHttpServer as apolloDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground as apolloLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled as apolloLandingPageDisabled} from 'apollo-server-core'
import {Neo4jGraphQL} from '@neo4j/graphql'
import neo4j from 'neo4j-driver'
import {loadTypeDefinitions} from '../apollo/load-files.js'

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
  /**
   * Connect to Neo4J and create Neo GraphQL Schema
   */
  const driver = neo4j.driver(
    process.env.VL_NEO4J_DB,
    neo4j.auth.basic(process.env.VL_NEO4J_AUTH_USER, process.env.VL_NEO4J_AUTH_PASSWORD))

  const neoSchema = new Neo4jGraphQL({
    typeDefs: await loadTypeDefinitions(),
    driver,
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
