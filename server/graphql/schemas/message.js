import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type Mutation {
    createMessage(message: String, aplId: String): String
  }

  type MessageOutput {
    _id: ID!
    message: String!
    applId: ID!
    initiatorId: ID!
    senderId: ID!
    receiverId: ID!
    isRead: Boolean
  }

  type LastMessageByApplicationAndUserOutput {
    lastMessage: String!
    isRead: Boolean
    wasteLocation: String
    wasteType: String
  }

  input Message {
    message: String!
    applId: ID!
    initiatorId: ID!
    senderId: ID!
    receiverId: ID!
  }
`
