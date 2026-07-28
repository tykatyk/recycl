import dbQueries from '../../helpers/queries'

const wasteTypeResolvers = {
  Query: {
    getWasteTypes(parent, args, context) {
      return dbQueries.wasteType.getAll()
    },
  },
}
export default wasteTypeResolvers
