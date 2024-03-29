import message from './message'
import location from './location'
import removalApplication from './removalApplication'
import user from './user'
import userRole from './userRole'
import wasteType from './wasteType'

import gql from 'graphql-tag'

const baseSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }

  type DeleteManyOutput {
    n: Int
    ok: Int
    deletedCount: Int
  }
`
const typeDefs = [
  baseSchema,
  message,
  location,
  removalApplication,
  wasteType,
  user,
  userRole,
]
export default typeDefs
