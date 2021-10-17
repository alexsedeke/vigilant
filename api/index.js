import path from 'node:path'
import {fileURLToPath} from 'node:url'
import dotenv from 'dotenv'
import AutoLoad from 'fastify-autoload'
import { ApolloServer } from 'apollo-server-fastify'
import { ApolloServerPluginDrainHttpServer,
         ApolloServerPluginLandingPageGraphQLPlayground,
         ApolloServerPluginLandingPageDisabled } from 'apollo-server-core'

import typeDefs from './apollo/typeDefs/test.js'
import resolvers from './apollo/resolvers/test.js'
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

const app = async function (fastify, appOptions) {
  // Place here your custom code!
  console.log(process.env.NODE_ENV)
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, appOptions)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /.*(test|spec|helper).js/,
    options: Object.assign({}, appOptions)
  })

  // Start Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      // show graphql playground not on production
      process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: fastify.server }),
    ],
  })
  await server.start()
  fastify.register(server.createHandler())
}

export default app
