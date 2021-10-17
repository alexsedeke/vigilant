import fp from 'fastify-plugin'
import { ApolloServer } from 'apollo-server-fastify'
import { ApolloServerPluginDrainHttpServer,
         ApolloServerPluginLandingPageGraphQLPlayground,
         ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'

import typeDefs from '../apollo/typeDefs/test.js'
import resolvers from '../apollo/resolvers/test.js'

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
    typeDefs,
    resolvers,
    plugins: [
      // show graphql playground not on production
      process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
      fastifyAppClosePlugin(fastify),
      ApolloServerPluginDrainHttpServer({ httpServer: fastify.server }),
    ],
  })
  // Start Apollo Server
  await server.start()

  fastify.register(server.createHandler())
})
