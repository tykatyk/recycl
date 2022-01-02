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
      let userInstance = await new User(user)
      userInstance.emailConfirmed = true
      userInstance.withPassword = false
      return await userInstance.save()
    },
    async getUser(id) {
      return await User.findById(id)
    },
    async getUserByEmail(email) {
      const user = await User.findOne({ email })
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
      return await User.findOneAndUpdate({ id: user.id }, user)
    },
    async deleteUser(userId) {
      return
    },
    async linkAccount(account) {
      const accountInstance = new Account(account)
      return await accountInstance.save()
    },
    async unlinkAccount({ provider, id }) {
      return
    },
    async createSession({ sessionToken, userId, expires }) {
      console.log('createSession')
      const session = new Session({ sessionToken, userId, expires })
      return await session.save()
    },
    async getSessionAndUser(sessionToken) {
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
      return
    },
    async useVerificationToken({ identifier, token }) {
      return
    },
  }
}
