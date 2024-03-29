import dbQueries from '../../db/queries'

const userResolvers = {
  Mutation: {
    createUser(parent, args, context) {
      return dbQueries.user.create(args.user)
    },
    deleteUser(parent, args, context) {
      return dbQueries.user.delete(context.user)
    },
    deleteNotConfirmedUser(parent, args, context) {
      return dbQueries.user.deleteNotConfirmedUser(args.id)
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

export default userResolvers
