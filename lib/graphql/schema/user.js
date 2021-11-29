import { gql } from 'apollo-server-micro'

export default gql`
  type Mutation {
    createUser(user: UserInput): UserOutput
  }
  type Query {
    getUser(email: String): UserOutput
    getByToken(token: String): UserOutput
    userExists(email: String): Boolean
  }
  type UserOutput {
    _id: ID!
    username: String!
    email: String!
    password: String!
    roles: [String!]!
    isActive: Boolean
    createdAt: Date!
    updatedAd: Date!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    roles: [String!]!
    isActive: Boolean
  }
`
