import validator from 'validator'
import cryptoRandomString from 'crypto-random-string'
import {createJWT, comparePassword, hashPassword} from '../../../features/auth.js'
import {sendMailToken} from '../../../features/mail.js'

export function ogmResolvers(ogm) {
  const Account = ogm.model('Account')
  const Token = ogm.model('Token')

  const resolvers = {
    Mutation: {
      /**
       * SIGN UP
       * What should it do:
       * This method expect to get 2 Parameters. Email and Password.
       * It validate that email is correct formated and change it to lowercase when necassary.
       * It also verify password match required strengh. If one fail, it return an error.
       * Than verify that an account with given email do not exists. Other wise return an error.
       * Now we can create the account and the correspondign user entity. Using the created entity
       * informations we can generate a JWT token and send it back.
       * @param {object} _source
       * @param {object} input Contains the input values
       * @returns {Promise<string|Error>} JWT token or Error
       */
      signUp: async (_source, {email, password}) => {
        const emailInput = email.toLowerCase()
        const hashedPassword = await hashPassword(password)
        // Validate email and password
        if (!validator.isEmail(email)) {
          throw new Error('Email is not valid.')
        }

        if (!validator.isStrongPassword(password)) {
          throw new Error('Password is not strong enough.')
        }

        // Verify account with this mail do not exists
        const [existing] = await Account.find({
          where: {
            email: emailInput
          }
        })

        if (existing) {
          throw new Error(`Account with email ${emailInput} already exists!`)
        }

        // Create account
        const account = await Account.create({
          input: [
            {
              email,
              password: hashedPassword,
              user: {
                create: {
                  node: {
                    lastname: email.split('@')[0]
                  }
                }
              }
            }
          ], selectionSet:
          `{
            accounts {
              email
              user {
                uid
              }
            }
          }`
        })

        const [createdAccount] = account.accounts
        if (createdAccount.email !== email) {
          throw new Error(`Account with email ${email} could not be created!`)
        }

        return createJWT({sub: createdAccount.user.uid, role: ['GUEST']})
      },
      /**
       * SIGN IN
       * What should it do:
       * Find account and user by account email and compare password. Convert email to lowercase before.
       * Return error if no account was found or password do not match.
       * Otherwise use account and user information to create JWT and send it back.
       * @param {*} _source
       * @param {*} input Contains the input values
       * @returns {Promise<string|Error>} JWT token or Error
       */
      signIn: async (_source, {email: inputemail, password}) => {
        const email = inputemail.toLowerCase()
        const [account] = await Account.find({
          where: {
            email
          },
          selectionSet:
            `{
              email
              password
              user {
                uid
              }
            }`
        })

        if (!account) {
          throw new Error(`Account with email ${email} not found!`)
        }

        const correctPassword = await comparePassword(account.password, password)

        if (!correctPassword) {
          throw new Error(`Incorrect password for account with email ${email}!`)
        }

        return createJWT({sub: account.user.uid, role: ['GUEST']})
      },
      /**
       * SENDMAILTOKEN
       * What should it do:
       * Find account and user by account email. Convert email to lowercase before.
       * If not found return an error.
       * When found create a login one time token and send the token to given email
       * and return true as mark that it was delivered to mail provider.
       * @param {*} _source
       * @param {*} input Contains the input values
       * @returns {Promise<boolean|Error>} True for email send or Error
       */
      sendToken: async (_source, {email: inputemail}) => {
        const tokenLength = 256
        const email = inputemail.toLowerCase()
        const [account] = await Account.find({
          where: {
            email
          },
          selectionSet:
            `{
              email
              user {
                uid
              }
            }`
        })

        if (!account) {
          throw new Error(`Account with email ${email} not found!`)
        }

        // Create account
        const createSignToken = await Token.create({
          input: [
            {
              token: cryptoRandomString({length: tokenLength, type: 'url-safe'}),
              user: {
                connect: {
                  where: {
                    node: {
                      uid: account.user.uid
                    }
                  }
                }
              }
            }
          ], selectionSet:
          `{
            singintokens {
              token
              limit
            }
          }`
        })

        const [createdToken] = createSignToken.singtokens
        if (createdToken?.token?.length !== tokenLength) {
          throw new Error('Token was not created as expected!')
        }

        sendMailToken(email, createdToken.token)
        return true
      },
      /**
       * SINGINTOKEN
       * What should it do:
       * Find User by SinginToken. When found create JWT, delete the SinginToken and return JWT.
       * @param {*} _source
       * @param {Object} Contains the input values
       * @returns {Promise<string|Error>} JWT token or Error
       */
      singInToken: async (_source, {token}) => {
        const findSigntoken = await Token.find({
          where: {
            token
          },
          selectionSet:
            `{
              user {
                uid
              }
            }`
        })
        const [foundToken] = findSigntoken
        if (!foundToken?.user?.uid) {
          throw new Error('Token not found or expired!')
        }

        // Delete used token
        await Token.delete({where: {token}})
        // Return JWT
        return createJWT({sub: foundToken.user.uid, role: ['GUEST']})
      }
    }
  }

  return resolvers
}
