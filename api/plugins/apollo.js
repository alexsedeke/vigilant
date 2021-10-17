import process from 'node:process'
import fp from 'fastify-plugin'
import {ApolloServer} from 'apollo-server-fastify'
import {ApolloServerPluginDrainHttpServer as apolloDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground as apolloLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled as apolloLandingPageDisabled} from 'apollo-server-core'
import {Neo4jGraphQL} from '@neo4j/graphql'
import neo4j from 'neo4j-driver'

import typeDefs from '../apollo/typeDefs/test.js'
// Import resolvers from '../apollo/resolvers/test.js'

const driver = neo4j.driver(
  process.env.VL_NEO4J_DB || 'bolt://localhost:7687',
  neo4j.auth.basic(process.env.VL_NEO4J_AUTH_USER || 'neo4j', process.env.VL_NEO4J_AUTH_PASSWORD || 's3cr3t'))
const neoSchema = new Neo4jGraphQL({typeDefs, driver})

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
