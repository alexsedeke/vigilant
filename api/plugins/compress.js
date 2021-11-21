import fp from 'fastify-plugin'
import compress from 'fastify-compress'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-compress
 */
export default fp(async fastify => {
  fastify.register(compress, {
    global: false
  })
})
