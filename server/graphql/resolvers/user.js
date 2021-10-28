import dbQueries from '../../db/queries'

export default {
  Query: {
    createUser(parent, args, context) {
      return dbQueries.user.create(args.user)
    },
  },
}
