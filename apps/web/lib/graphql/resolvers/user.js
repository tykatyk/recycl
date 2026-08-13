import dbQueries from '../../helpers/queries'

const userResolvers = {
  Mutation: {
    deleteUser(parent, args, context) {
      return dbQueries.user.delete(context.user)
    },
    deleteNotConfirmedUser(parent, args, context) {
      return dbQueries.user.deleteNotConfirmedUser(args.id)
    },
    updateUserContacts(parent, args, context) {
      return dbQueries.user.updateContacts(args.contacts, context.user)
    },
  },
  Query: {
    getByToken(parent, args, context) {
      return dbQueries.user.getByToken(args.token)
    },
    getUserContacts(parent, args, context) {
      return dbQueries.user.getById(args.id, context.user)
    },
  },
}

export default userResolvers
