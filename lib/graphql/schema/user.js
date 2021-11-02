import { gql } from 'apollo-server-micro'

export default gql`
  type Mutation {
    createUser(user: UserInput): UserOutput
  }
  type UserOutput {
    _id: ID!
    login: String!
    email: String!
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
