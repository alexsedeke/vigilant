import bcrypt from 'bcrypt'

/**
 * Hash a plain password to be stores in a save way.
 * The bcrypt library is used here to get best ans secure result.
 * For more details on the library please go to https://github.com/kelektiv/node.bcrypt.js#readme
 * @param {string} password Plain password to be hashed
 * @param {*} minLength Minimum length of plain password
 * @param {*} saltRounds Salt rounds to perform to crypt the password
 * @returns {string} The hashed password
 */
export async function hashPassword(password, minLength = 3, saltRounds = 10) {
  if (typeof password !== 'string' && password.length < minLength ) {
    throw new Error(`hashPassword require password parameter of type string with a minimum length of ${minLength}`)
  }

  return await bcrypt.hash(password, saltRounds)
}

/**
 * Compare the hashed and plain password if they match.
 * The bcrypt library is used here to get best ans secure result.
 * For more details on the library please go to https://github.com/kelektiv/node.bcrypt.js#readme
 * @param {string} hashedPassword The hashed password which is normaly stored in the database.
 * @param {string} comparePassword The plain password the user entered.
 * @returns {boolean} True when the plain password to compare is the same as the hashed password.
 */
export async function comparePassword(originPassword, comparePassword) {
  return bcrypt.compare(comparePassword, originPassword)
}

export function createJWT(jwtObject) {
  return 'jwttoken'
}
