import bcrypt from 'bcrypt'
import {SignJWT, jwtVerify, importPKCS8, importSPKI} from 'jose'
import {config} from '../../config.js'

const ecPrivateKey = await importPKCS8(config.VL_JWT_KEY_PRIVATE, 'ES256')
const ecPublicKey = await importSPKI(config.VL_JWT_KEY_PUBLIC, 'ES256')

/**
 * Hash a plain password to be stores in a save way.
 * The bcrypt library is used here to get best ans secure result.
 * For more details on the library please go to https://github.com/kelektiv/node.bcrypt.js#readme
 * @param {string} password Plain password to be hashed
 * @param {*} minLength Minimum length of plain password
 * @param {*} saltRounds Salt rounds to perform to crypt the password
 * @returns {Promise<string>} The hashed password
 */
export async function hashPassword(password, minLength = 3, saltRounds = 10) {
  if (typeof password !== 'string' && password.length < minLength) {
    throw new Error(`hashPassword require password parameter of type string with a minimum length of ${minLength}`)
  }

  return bcrypt.hash(password, saltRounds)
}

/**
 * Compare the hashed and plain password if they match.
 * The bcrypt library is used here to get best ans secure result.
 * For more details on the library please go to https://github.com/kelektiv/node.bcrypt.js#readme
 * @param {string} comparePassword The hashed password which is normaly stored in the database.
 * @param {string} comparePassword The plain password the user entered.
 * @returns {Promise<boolean>} True when the plain password to compare is the same as the hashed password.
 */
export async function comparePassword(originPassword, comparePassword) {
  return bcrypt.compare(comparePassword, originPassword)
}

/**
 *
 * @param {object} payload
 * @returns {Promise<string>} Return JWT token
 */
export async function createJWT(payload) {
  if (typeof payload !== 'object') {
    throw new TypeError('CreateJWT method expect the payload parameter should be an object.')
  }

  return new SignJWT(payload)
    .setProtectedHeader({alg: config.VL_JWT_ALG})
    .setIssuedAt()
    .setIssuer(config.VL_JWT_ISSUER)
    .setAudience(config.VL_JWT_AUDIENCE)
    .setExpirationTime(config.VL_JWT_EXPIRATIONTIME)
    .sign(ecPrivateKey)
}

/**
 * Decode the JWT Token
 * @param {string} token The JWT Token
 * @returns {Promise<object>} Contain the payload and the protectedHeader.
 */
export async function decodeJWT(token) {
  return jwtVerify(token, ecPublicKey, {
    issuer: config.VL_JWT_ISSUER,
    audience: config.VL_JWT_AUDIENCE
  })
}

/**
 *
 * @param {object} request Fastify request object
 * @returns {Promise<object} JWT Payload
 */
export async function verifyAuthorisation(request) {
  const authorization = request?.headers?.authorization
  let payload = null

  if (typeof authorization !== 'undefined' && !/^bearer$/i.test(authorization)) {
    const parts = authorization.split(' ')
    if (parts.length === 2) {
      payload = await decodeJWT(parts[1])
    }
  }

  return payload
}
