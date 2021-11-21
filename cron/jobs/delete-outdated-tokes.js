import {driver} from '../neo4j.js'
import {config} from '../../config.js'
import {logger} from '../logger.js'

const session = driver.session()

try {
  const affected_tokens = await session.writeTransaction(async tx => {
    const result = await tx.run(
      'MATCH (t:Singtoken) WHERE t.created < DateTime() - duration({hours: $token_expire}) DETACH DELETE t RETURN COUNT(t) AS affected',
      { token_expire: config.VL_NEO4J_TOKEN_HOURS_EXPIRE }
    )
    return result.records.map(record => record.get('affected').toNumber())
  })
  logger.info({message: 'Delete outdated tokens', count:  affected_tokens[0]})
} catch (executionError) {
  logger.error(executionError)
} finally {
  await session.close()
  await driver.close()
}
