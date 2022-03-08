import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getNumberOfUnreadMessages: Int
  }

  type Mutation {
    createMessage(message: String, aplId: String): String
  }

  type MessageOutput {
    _id: ID!
    text: String!
    ad: RemovalApplicationOutput!
    sender: UserOutput!
    receiver: UserOutput!
    isViewed: Boolean
  }

  input Message {
    message: String!
    applId: ID!
    initiatorId: ID!
    senderId: ID!
    receiverId: ID!
  }
`
