import message from './message'
import location from './location'
import removalApplication from './removalApplication'
import user from './user'
import userRole from './userRole'
import wasteType from './wasteType'

import { gql } from 'apollo-server-micro'

const baseSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`
export default [
  baseSchema,
  message,
  location,
  removalApplication,
  wasteType,
  user,
  userRole,
]
