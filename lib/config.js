/**
 * Config define all configurable options.
 * - It reset the option default value when environment variable with the same name was found.
 * - Autoload file content as string when option name end with "LOADFILE".
 * Options should be written in uppercase.
 */
import process from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config()

const config = {
  VL_NEO4J_DB: 'bolt://localhost:7687',
  VL_NEO4J_AUTH_USER: 'neo4j',
  VL_NEO4J_AUTH_PASSWORD: 's3cr3t',
  VL_JWT_KEY_PUBLIC_LOADFILE: './public-key.pem',
  VL_JWT_KEY_PRIVATE_LOADFILE: './private-pkcs8.pem',
  VL_JWT_ISSUER: 'https://vigalent.app',
  VL_JWT_AUDIENCE: 'http://localhost:3000/',
  VL_JWT_EXPIRATIONTIME: '2h',
  VL_JWT_ALG: 'ES256'
}

/**
 * Load synchronous file content.
 * @param {string} file Filename
 * @returns {string} File content as string.
 */
function loadFile(file) {
  const filepath = path.join(process.cwd(), file)
  try {
    return fs.readFileSync(filepath).toString()
  } catch {
    throw new Error(`Could not load file "${filepath}"`)
  }
}

/**
 * Iterate over all config keys and verify to override the default value
 * from process environment variable.
 * If config key ends with LOADFILE, try to load the file content as string,
 * and set the result as same key without the LOADFILE ending.
 */
for (const key of Object.keys(config)) {
  if (typeof process.env[key] !== 'undefined') {
    config[key] = process.env[key]
  }

  if (key.slice(-8) === 'LOADFILE') {
    config[key.slice(0, -9)] = loadFile(config[key])
  }
}

export default config
