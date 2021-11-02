import dbQueries from '../../db/queries'

export default {
  Query: {
    /*getMessagesByApplicationAndUser(parent, args, context) {
      return new dbQueries('Message').getAplMessages()
    },*/
  },
  Mutation: {
    createMessage(parent, args, context) {
      return dbQueries.message.createMessage({
        message: args.message,
        aplId: args.aplId,
      })
    },
  },
}
