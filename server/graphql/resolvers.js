import dbQueries from '../db/queries'

export default {
  Query: {
    getRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.get(args.id)
    },
    getRemovalApplications(parent, args, context) {
      return dbQueries.removalApplication.getAll()
    },
    getRemovalApplicationsWithMessageCount(parent, args, context) {
      return dbQueries.removalApplication.getWithMessageCount()
    },
    getWasteTypes(parent, args, context) {
      return dbQueries.wasteType.getAll()
    },
    /*getMessagesByApplicationAndUser(parent, args, context) {
      return new dbQueries('Message').getAplMessages()
    },*/
  },
  Mutation: {
    createRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.create(args.application)
    },
    updateRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.update(args.id, args.newValues)
    },
    deleteRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.delete(args.id)
    },
    deleteRemovalApplications(parent, args, context) {
      return dbQueries.removalApplication.deleteMany(args.ids)
    },
    createMessage(parent, args, context) {
      return dbQueries.message.createMessage({
        message: args.message,
        aplId: args.aplId,
      })
    },
  },
}
