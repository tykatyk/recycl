import dbQueries from '../../db/queries'

export default {
  Mutation: {
    createRole(parent, args, context) {
      return dbQueries.userRole.createRole(args.roleName)
    },
  },
  Query: {
    getRoleId(parent, args, context) {
      console.log('enter getRoleId grahQl resolver')
      return dbQueries.userRole.getByName(args.roleName)
    },
  },
}
