import {test} from 'tap'
import {hashPassword, comparePassword} from '../auth.js'

const plainPassword = 'mySuperSecretPassword'

test('crypted password and compare with plain', async t => {
  const hashedPassword = await hashPassword(plainPassword)
  const isEqual = await comparePassword(hashedPassword, plainPassword)

  t.not(hashedPassword, plainPassword, 'The hashed and plain password string should not be same.')
  t.ok(isEqual, 'The hashed and plain password should be equal when using compare method.')
  t.end()
})
