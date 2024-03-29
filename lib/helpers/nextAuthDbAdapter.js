import dbConnect from '../db/connection'
import { User, Account } from '../db/models'

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
      console.log('in getting by id, id is')
      console.log(id)
      return await User.findById(id)
    },
    async getUserByEmail(email) {
      console.log('in getting by email, email is')
      console.log(email)
      const user = await User.findOne({ email })
      return user
    },
    async getUserByAccount({ provider, providerAccountId }) {
      console.log('in getting by account, account is')
      console.log(providerAccountId)
      let user = await Account.findOne({
        $and: [{ provider }, { providerAccountId }],
      })
        .populate('userId')
        .select('userId')
      return user.userId //ToDo rename userId field to user
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
      return
    },
    async getSessionAndUser(sessionToken) {
      return
    },
    async updateSession({ sessionToken }) {
      return
    },
    async deleteSession(sessionToken) {
      return
    },
    async createVerificationToken({ identifier, expires, token }) {
      return
    },
    async useVerificationToken({ identifier, token }) {
      return
    },
  }
}
