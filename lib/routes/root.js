export default async function rootRoute(fastify) {
  fastify.get('/', async () => ({
    root: true
  }))
}
