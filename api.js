import path from 'node:path'
import {fileURLToPath} from 'node:url'
import process from 'node:process'
import AutoLoad from 'fastify-autoload'
import {config} from './config.js'
import {initCron} from './cronjobs.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function api(fastify, appOptions) {
  // Place here your custom code!
  if (process.env.NODE_ENV !== 'production') {
    fastify.log.info('You are in development mode')
    fastify.log.info(`Connecting to Neo4J DB: ${config.VL_NEO4J_DB}`)
    fastify.log.info(`GraphQL Playground is availabe at http://127.0.0.1:${process.env.PORT}/graphql/`)
  }

  // Do not touch the following lines
  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'api', 'plugins'),
    options: {...appOptions}
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'api', 'routes'),
    ignorePattern: /.*(test|spec|helper).js/,
    options: {...appOptions}
  })

  // Enable application CRON
  if (config.VL_CRON === true) {
    initCron(fastify.log)
  }
}

export default api
