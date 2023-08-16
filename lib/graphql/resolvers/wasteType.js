import dbQueries from '../../db/queries'

const wasteTypeResolvers = {
  Query: {
    getWasteTypes(parent, args, context) {
      return dbQueries.wasteType.getAll()
    },
  },
}
export default wasteTypeResolvers
