import dbQueries from '../db/queries'

import { GraphQLScalarType, Kind } from 'graphql'

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return value.getTime() // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value) // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)) // Convert hard-coded AST string to integer and then to Date
    }
    return null // Invalid hard-coded value (not an integer)
  },
})

export default {
  Query: {
    getRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.get(args.id)
    },
    getRemovalApplications(parent, args, context) {
      return dbQueries.removalApplication.getAll()
    },
    getRemovalApplicationsWithMessageCount(parent, args, context) {
      return dbQueries.removalApplication.getWithMessageCount()
    },
    getWasteTypes(parent, args, context) {
      return dbQueries.wasteType.getAll()
    },
    /*getMessagesByApplicationAndUser(parent, args, context) {
      return new dbQueries('Message').getAplMessages()
    },*/
  },
  Mutation: {
    createRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.create(args.application)
    },
    updateRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.update(args.id, args.newValues)
    },
    deleteRemovalApplication(parent, args, context) {
      return dbQueries.removalApplication.delete(args.id)
    },
    deleteRemovalApplications(parent, args, context) {
      return dbQueries.removalApplication.deleteMany(args.ids)
    },
    createMessage(parent, args, context) {
      return dbQueries.message.createMessage({
        message: args.message,
        aplId: args.aplId,
      })
    },
  },
  Date: dateScalar,
}
