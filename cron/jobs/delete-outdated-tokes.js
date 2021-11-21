import neo4j from 'neo4j-driver'
import {config} from '../../config.js'
import {logger} from '../logger.js'

try {
  const driver = neo4j.driver(
    config.VL_NEO4J_DB,
    neo4j.auth.basic(config.VL_NEO4J_AUTH_USER, config.VL_NEO4J_AUTH_PASSWORD))

  const session = driver.session({defaultAccessMode: neo4j.session.WRITE})

  await session
    .run(`MATCH (t:Singtoken) WHERE t.created < DateTime() - duration({hours: ${config.VL_NEO4J_TOKEN_HOURS_EXPIRE}}) DETACH DELETE t RETURN COUNT(t) AS affected`)
    .then(result => {
      for (const record of result.records) {
        logger.info({deleted: record.get('affected').toNumber()})
      }
    })
    .catch(error => logger.error(error))
    .then(() => session.close())
  await driver.close()
} catch (error) {
  logger.error(error)
}
