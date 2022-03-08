import dbQueries from '../../db/queries'

export default {
  Query: {
    /*getMessagesByApplicationAndUser(parent, args, context) {
      return new dbQueries('Message').getAplMessages()
    },*/

    getNumberOfUnreadMessages(parent, args, context) {
      return dbQueries.message.getNumberOfUnread(context.user)
    },
  },
  Mutation: {
    createMessage(parent, args, context) {
      return dbQueries.message.create(args.message, context.user)
    },
  },
}
