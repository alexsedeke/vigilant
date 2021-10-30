import {createJWT, comparePassword, hashPassword} from '../../../features/auth.js'

export function ogmResolvers(ogm) {
  const User = ogm.model('Usering')

  const resolvers = {
    Mutation: {
      signUp: async (_source, {username, password}) => {
        const [existing] = await User.find({
          where: {
            username
          }
        })

        if (existing) {
          throw new Error(`User with username ${username} already exists!`)
        }

        const hashedPassword = await hashPassword(password)
        const usering = await User.create({
          input: [
            {
              username,
              password: hashedPassword
            }
          ]
        })
        const [user] = usering.userings

        return createJWT({sub: user.id, role: ['GUEST']})
      },
      signIn: async (_source, {username, password}) => {
        const [user] = await User.find({
          where: {
            username
          }
        })

        if (!user) {
          throw new Error(`User with username ${username} not found!`)
        }

        const correctPassword = await comparePassword(password, user.password)

        if (!correctPassword) {
          throw new Error(`Incorrect password for user with username ${username}!`)
        }

        return await createJWT({sub: user.id})
      }
    }
  }

  return resolvers
}
