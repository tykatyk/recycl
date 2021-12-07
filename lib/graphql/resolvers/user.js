import dbQueries from '../../db/queries'

export default {
  Mutation: {
    createUser(parent, args, context) {
      return dbQueries.user.create(args.user)
    },
  },
  Query: {
    getUserByEmail(parent, args, context) {
      return dbQueries.user.getByEmail(args.email)
    },
    getByToken(parent, args, context) {
      return dbQueries.user.getByToken(args.token)
    },
  },
}
