import dbQueries from '../../db/queries'

export default {
  Query: {
    getWasteTypes(parent, args, context) {
      return dbQueries.wasteType.getAll()
    },
  },
}
