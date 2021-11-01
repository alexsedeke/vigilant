import { UserInputError } from 'apollo-server-errors'
import validator from 'validator'
import {createJWT, comparePassword, hashPassword} from '../../../features/auth.js'

export function ogmResolvers(ogm) {
  const Account = ogm.model('Account')

  const resolvers = {
    Mutation: {
      signUp: async (_source, {email, password}) => {
        const emailInput = email.toLowerCase()
        const hashedPassword = await hashPassword(password)
        // Validate email and password
        if (!validator.isEmail(email)) {
          throw new UserInputError('Email is not valid.')
        }
        if (!validator.isStrongPassword(password)) {
          throw new UserInputError('Password is not strong enough.')
        }

        // Verify account with this mail do not exists
        const [existing] = await Account.find({
          where: {
            email: emailInput
          }
        })

        if (existing) {
          throw new UserInputError(`Account with email ${emailInput} already exists!`)
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
          `
            {
              accounts {
                email
                user {
                  uid
                }
              }
            }
          `
        })

        const [createdAccount] = account.accounts
        if (createdAccount.email !== email) {
          throw new UserInputError(`Account with email ${email} could not be created!`)
        }

        return createJWT({sub: createdAccount.user.uid, role: ['GUEST']})
      },
      signIn: async (_source, {email, password}) => {
        const [account] = await Account.find({
          where: {
            email
          },
          selectionSet:
            `
              {
                email
                password
                user {
                  uid
                }
              }
            `
        })

        if (!account) {
          throw new Error(`Account with email ${email} not found!`)
        }

        const correctPassword = await comparePassword(account.password, password)

        if (!correctPassword) {
          throw new Error(`Incorrect password for account with email ${email}!`)
        }

        return await createJWT({sub: account.user.id, role: ['GUEST']})
      }
    }
  }

  return resolvers
}
