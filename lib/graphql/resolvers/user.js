import dbQueries from '../../db/queries'

export default {
  Mutation: {
    createUser(parent, args, context) {
      return dbQueries.user.create(args.user)
    },
  },
  Query: {
    userExists(parent, args, context) {
      return dbQueries.user.exists(args.email)
    },
    getUser(parent, args, context) {
      return dbQueries.user.getByEmail(args.email)
    },
  },
}
