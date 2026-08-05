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
    deleteAd(parent, args, context) {
      return dbQueries.ad.delete(args.id)
    },
    deleteAds(parent, args, context) {
      return dbQueries.ad.deleteMany(args.ids)
    },
  },
}
export default adResolvers
