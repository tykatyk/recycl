import dbQueries from '../../db/queries'

export default {
  Query: {
    getUnreadDialogsIDs(parent, args, context) {
      return dbQueries.message.getUnreadDialogsIDs(context.user)
    },

    getDialogs(parent, args, context) {
      return dbQueries.message.getDialogs(args.offset, args.limit, context.user)
    },

    getDialog(parent, args, context) {
      return dbQueries.message.getDialog(
        args.id,
        args.offset,
        args.limit,
        context.user
      )
    },
  },
  Mutation: {
    createMessage(parent, args, context) {
      return dbQueries.message.create(args.message, context.user)
    },
    updateMessage(parent, args, context) {
      return dbQueries.message.update(args.id, args.payload, context.user)
    },
    deleteDialogs(parent, args, context) {
      return dbQueries.message.deleteDialogs(args.ids, context.user)
    },
    deleteStaleDialogs(parent, args, context) {
      return dbQueries.message.deleteStaleDialogs(context.user)
    },
  },
}
