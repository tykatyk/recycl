import dbQueries from '../../db/queries'

const removalApplicationResolvers = {
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
        args.wasteTypes
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
      return dbQueries.removalApplication.updateOne(args.id, args.newValues)
    },
    deleteRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.delete(args.id)
    },
    deleteRemovalApplications(parent, args, context) {
      return dbQueries.removalApplication.deleteMany(args.ids)
    },
  },
}
export default removalApplicationResolvers
