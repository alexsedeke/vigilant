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
import {config} from '../../config.js'
import {verifyAuthorisation} from '../features/auth.js'

/**
 * Stop Apollo Server when application close.
 * @param {object} app Fastify instance
 * @returns {object} Apollo Server Plugin
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
 * Create context object for Apollo Server.
 * @param {object} request The request object from fastify.
 * @returns {Promise<object>} The context object.
 */
const context = async ({request}) => {
  const context = {}

  // Decode JWT Token from Authorisation Header when exists
  const jwtResult = await verifyAuthorisation(request)
  if (typeof jwtResult?.payload !== 'undefined') {
    context.jwt = jwtResult.payload
  }

  return context
}

/**
 * This plugin adds Apollo Server connected to Neo4J
 * and Neo4J GraphQL.
 */
export default fp(async fastify => {
  // Init driver
  const driver = neo4j.driver(
    config.VL_NEO4J_DB,
    neo4j.auth.basic(config.VL_NEO4J_AUTH_USER, config.VL_NEO4J_AUTH_PASSWORD))
  // Load TypeDefs
  const typeDefs = await loadTypeDefinitions()
  // Init OGM
  const ogm = new OGM({typeDefs, driver})
  // Load Custom Resolvers
  const resolvers = await loadResolvers(ogm)
  // Init Neo4J GraphQL Schema
  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    resolvers,
    config: {
      jwt: {
        noVerify: true
      }
    }
  })
  // Init Apollo Server
  const server = new ApolloServer({
    schema: neoSchema.schema,
    context,
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
  // Register Apollo Server
  fastify.register(server.createHandler())
})
