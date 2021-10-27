import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
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
    login: String!
    email: String!
    roles: [String!]!
    isActive: Boolean
  }
`
