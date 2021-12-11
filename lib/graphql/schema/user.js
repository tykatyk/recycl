import { gql } from 'apollo-server-micro'

export default gql`
  type Mutation {
    createUser(user: UserInput!): UserOutput
    updateUserContacts(contacts: ContactsInput!): UserOutput
  }

  type Query {
    getUserByEmail(email: String!): UserOutput
    getByToken(token: String!): UserOutput
    getUserContacts(id: String!): UserOutput
  }

  type UserOutput {
    _id: ID!
    name: String!
    email: String!
    password: String!
    roles: [String!]!
    isActive: Boolean
    createdAt: Date!
    updatedAd: Date!
    location: LocationOutput
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    roles: [String!]!
    isActive: Boolean
  }

  input ContactsInput {
    username: String!
    location: Location
  }
`
