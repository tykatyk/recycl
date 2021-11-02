import dbQueries from '../../db/queries'

export default {
  Mutation: {
    createUser(parent, args, context) {
      return dbQueries.user.create(args.user)
    },
  },
}
