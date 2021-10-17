import process from 'node:process'
import fp from 'fastify-plugin'
import helmet from 'fastify-helmet'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-helmet
 */
export default fp(async fastify => {
  const helmetOptions = {}

  // Set options for development, to enable access
  // to swagger and other development support tools.
  if (process.env.NODE_ENV !== 'production') {
    helmetOptions.contentSecurityPolicy = {
      directives: {
        'default-src': ['\'self\''],
        'base-uri': ['\'self\''],
        'block-all-mixed-content': [],
        'font-src': ['\'self\'', 'https:', 'data:'],
        'frame-ancestors': ['\'self\''],
        'img-src': ['\'self\'', 'data:', 'http://cdn.jsdelivr.net/npm/@apollographql/'],
        'object-src': ['\'self\''],
        'script-src': ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\'', 'https://cdn.jsdelivr.net/npm/@apollographql/'],
        'script-src-attr': ['\'none\''],
        'style-src': ['\'self\'', 'https:', '\'unsafe-inline\''],
        'upgrade-insecure-requests': []
      }
    }
  }

  fastify.register(helmet, helmetOptions)
})
