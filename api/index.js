import path from 'node:path'
import {fileURLToPath} from 'node:url'
import dotenv from 'dotenv'
import AutoLoad from 'fastify-autoload'
dotenv.config()

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
    options: Object.assign({}, appOptions)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /.*(test|spec|helper).js/,
    options: Object.assign({}, appOptions)
  })
}

export default app