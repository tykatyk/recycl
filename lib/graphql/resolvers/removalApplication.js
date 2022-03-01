import dbQueries from '../../db/queries'

export default {
  Query: {
    getRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.get(args.id)
    },
    getRemovalApplications(parent, args, context) {
      return dbQueries.removalApplication.getAll(args.queryParams, context.user)
    },
    getRemovalApplicationsForMap(parent, args, context) {
      return dbQueries.removalApplication.getForMap(
        args.visibleRect,
        args.wasteTypes,
        context.user
      )
    },
    getRemovalApplicationsWithMessageCount(parent, args, context) {
      return dbQueries.removalApplication.getWithMessageCount(context.user)
    },
  },
  Mutation: {
    createRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.create(args.application, context.user)
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
  },
}
