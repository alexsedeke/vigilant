import './config.js'
import process from 'node:process'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import AutoLoad from 'fastify-autoload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = async function (fastify, appOptions) {
  // Place here your custom code!
  if (process.env.NODE_ENV === 'development') {
    fastify.log.info('You are in development mode')
    fastify.log.info(`GraphQL Playground is availabe at http://127.0.0.1:${process.env.PORT}/graphql/`)
  }
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: {...appOptions}
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /.*(test|spec|helper).js/,
    options: {...appOptions}
  })
}

export default app
