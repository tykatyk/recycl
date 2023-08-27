import gql from 'graphql-tag'

export default gql`
  type Mutation {
    createUser(user: UserInput!): UserOutput
    deleteNotConfirmedUser(id: String!): UserOutput
    deleteUser: UserOutput
    updateUserContacts(contacts: ContactsInput!): UserOutput
    updatePhone(phone: String!): String
    updatePassword(oldPassword: String!, newPassword: String!): Boolean
  }

  type Query {
    getUserByEmail(email: String!): UserOutput
    getByToken(token: String!): UserOutput
    getUserContacts(id: String!): UserOutput
    getPhone(id: String!): UserOutput
  }

  type UserOutput {
    _id: ID!
    name: String!
    email: String!
    emailConfirmed: Boolean!
    confirmEmailToken: String
    confirmEmailExpires: Date
    password: String
    image: String
    roles: [String!]!
    isActive: Boolean
    createdAt: Date!
    updatedAd: Date!
    location: LocationOutput
    phone: String
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
