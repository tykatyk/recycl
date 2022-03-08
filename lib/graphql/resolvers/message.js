import dbQueries from '../../db/queries'

export default {
  Query: {
    getNumberOfUnreadMessages(parent, args, context) {
      return dbQueries.message.getNumberOfUnread(context.user)
    },

    getMessages(parent, args, context) {
      return dbQueries.message.getAll(context.user)
    },
  },
  Mutation: {
    createMessage(parent, args, context) {
      return dbQueries.message.create(args.message, context.user)
    },
  },
}
