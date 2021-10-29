import fp from 'fastify-plugin'
import multipart from 'fastify-multipart'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-compress
 */
export default fp(async fastify => {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 1_000_000, // For multipart forms, the max file size in bytes
      files: 1, // Max number of file fields
      headerPairs: 2000 // Max number of header key=>value pairs
    },
    attachFieldsToBody: true
  })
})
