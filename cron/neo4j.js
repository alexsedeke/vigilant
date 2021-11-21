import neo4j from 'neo4j-driver'
import {config} from '../config.js'

export const driver = neo4j.driver(
  config.VL_NEO4J_DB,
  neo4j.auth.basic(config.VL_NEO4J_AUTH_USER, config.VL_NEO4J_AUTH_PASSWORD))

// export const session = driver.session({defaultAccessMode: neo4j.session.WRITE})
