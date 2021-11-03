import message from './message'
import removalApplication from './removalApplication'
import user from './user'
import userRole from './userRole'
import wasteType from './wasteType'

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

const dateResolver = {
  Date: dateScalar,
}

export default [
  message,
  removalApplication,
  user,
  userRole,
  wasteType,
  dateResolver,
]
