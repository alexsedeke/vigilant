import fp from 'fastify-plugin'
import fastifyEnv from 'fastify-env'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp(async fastify => {
  const schema = {
    type: 'object',
    required: ['PORT'],
    properties: {
      PORT: {
        type: 'string',
        default: 3000
      }
    }
  }

  const options = {
    confKey: 'config', // Optional, default: 'config'
    schema
    // Data: data // optional, default: process.env
  }

  fastify.register(fastifyEnv, options)
})
