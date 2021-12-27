import dbConnect from './db/connection'
// import { User, Account } from './db/models'
import User from './db/models/user'
import Account from './db/models/account'

export default function nextAuthDbAdapter(client, options = {}) {
  ;(async () => {
    await dbConnect()
  })()

  return {
    async createUser(user) {
      console.log('createUser')
      console.log('user is')
      console.log(user)
      let userInstance = await new User(user)
      userInstance.emailConfirmed = true
      userInstance.withPassword = false
      return await userInstance.save()
    },
    async getUser(id) {
      console.log('getUser')
      return await User.findById(id)
    },
    async getUserByEmail(email) {
      console.log('getUserByEmail')

      const user = await User.findOne({ email })
      console.log('user is')
      console.log(user)
      return user
    },
    async getUserByAccount({ provider, providerAccountId }) {
      console.log('getUserByAccount')

      return await Account.findOne({
        $and: [{ provider }, { providerAccountId }],
      })
        .populate('User')
        .select('userId')
    },
    async updateUser(user) {
      console.log('updateUser')
      return await User.findOneAndUpdate({ id: user.id }, user)
    },
    async deleteUser(userId) {
      console.log('deleteUser')
      return
    },
    async linkAccount(account) {
      console.log('linkAccount')
      const accountInstance = new Account(account)
      return await accountInstance.save()
    },
    async unlinkAccount({ provider, id }) {
      console.log('unlinkAccount')
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log('createSession')
      const session = new Session({ sessionToken, userId, expires })
      return await session.save()
    },
    async getSessionAndUser(sessionToken) {
      console.log('getSessionAndUser')
      return
    },
    async updateSession({ sessionToken }) {
      console.log('updateSession')
      let result = new Date()
      result.setDate(result.getDate() + 30)

      return await Session.findOneAndUpdate(
        { sessionToken },
        { expires: result }
      )
    },
    async deleteSession(sessionToken) {
      console.log('deleteSession')
      return await Session.findOneAndDelete({ sessionToken })
    },
    async createVerificationToken({ identifier, expires, token }) {
      console.log('createVerificationToken')
      return
    },
    async useVerificationToken({ identifier, token }) {
      console.log('useVerificationToken')
      return
    },
  }
}
