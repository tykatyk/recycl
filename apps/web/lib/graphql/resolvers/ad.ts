import dbQueries from '../../helpers/queries'

const adResolvers = {
  Query: {
    getAds(parent, args, context) {
      return dbQueries.ad.getAll(args.queryParams, context.user)
    },
    getAdsWithMessageCount(parent, args, context) {
      return dbQueries.ad.getWithMessageCount(context.user)
    },
  },
  Mutation: {
    createAd(parent, args, context) {
      return dbQueries.ad.create(args.application, context.user)
    },
    updateAd(parent, args, context) {
      return dbQueries.ad.update(args.id, args.newValues)
    },
    deleteAd(parent, args, context) {
      return dbQueries.ad.delete(args.id)
    },
    deleteAds(parent, args, context) {
      return dbQueries.ad.deleteMany(args.ids)
    },
  },
}
export default adResolvers
