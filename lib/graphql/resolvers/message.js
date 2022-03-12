import dbQueries from '../../db/queries'

export default {
  Query: {
    getUnreadDialogsIDs(parent, args, context) {
      return dbQueries.message.getUnreadDialogsIDs(context.user)
    },

    getMessages(parent, args, context) {
      return dbQueries.message.getAll(context.user)
    },
  },
  Mutation: {
    createMessage(parent, args, context) {
      return dbQueries.message.create(args.message, context.user)
    },
    deleteDialogs(parent, args, context) {
      return dbQueries.message.deleteDialogs(args.ids, context.user)
    },
  },
}
