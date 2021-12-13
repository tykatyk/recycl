import dbQueries from '../../db/queries'

export default {
  Mutation: {
    createUser(parent, args, context) {
      return dbQueries.user.create(args.user)
    },
    updateUserContacts(parent, args, context) {
      return dbQueries.user.updateContacts(args.contacts, context.user)
    },
    updatePhone(parent, args, context) {
      return dbQueries.user.updatePhone(args.phone, context.user)
    },
    updatePassword(parent, args, context) {
      return dbQueries.user.updatePassword(
        args.oldPassword,
        args.newPassword,
        context.user
      )
    },
  },
  Query: {
    getUserByEmail(parent, args, context) {
      return dbQueries.user.getByEmail(args.email)
    },
    getByToken(parent, args, context) {
      return dbQueries.user.getByToken(args.token)
    },
    getUserContacts(parent, args, context) {
      return dbQueries.user.getById(args.id, context.user)
    },
    getPhone(parent, args, context) {
      return dbQueries.user.getById(args.id, context.user)
    },
  },
}
