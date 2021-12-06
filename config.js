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
  VL_NEO4J_AUTH_USER: '',
  VL_NEO4J_AUTH_PASSWORD: '',
  VL_NEO4J_TOKEN_HOURS_EXPIRE: '3',
  VL_CRON: true,
  VL_JWT_ISSUER: 'https://vigilent.app',
  VL_JWT_AUDIENCE: 'http://localhost:3000/',
  VL_JWT_EXPIRATIONTIME: '2h',
  VL_JWT_ALG: 'ES256',
  VL_JWT_KEY_PUBLIC: '',
  VL_JWT_KEY_PRIVATE: '',
  VL_MAIL_SMTP: '',
  VL_MAIL_AUTH_USER: '',
  VL_MAIL_AUTH_PASSWORD: '',
  VL_MAIL_PORT: 587,
  VL_MAIL_FROM: '',
  VL_MAIL_LINK_CONFIRM: 'http://localhost:3000/#/confirm/',
  VL_MAIL_LINK_LOGIN: 'http://localhost:3000/#/login'
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
}

/**
 * Add config options, identfied by prefix (VL_) to the config.
 */
for (const key of Object.keys(process.env)) {
  if (key.slice(0, 3) === 'VL_' && typeof config[key] === 'undefined') {
    config[key] = process.env[key]
  }
}

/**
 * Load file configuration depend on postfix (LOADFILE)
 */
for (const key of Object.keys(config)) {
  if (key.slice(-8) === 'LOADFILE') {
    config[key.slice(0, -9)] = loadFile(config[key])
  }
}

export {config}
