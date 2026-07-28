import dbQueries from '../../helpers/queries'

const userRoleResolvers = {
  Mutation: {
    createRole(parent, args, context) {
      return dbQueries.userRole.createRole(args.roleName)
    },
  },
  Query: {
    getRoleId(parent, args, context) {
      return dbQueries.userRole.getByName(args.roleName)
    },
  },
}
export default userRoleResolvers
