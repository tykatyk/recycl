import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getUnreadDialogsIDs: [ID]
    getDialogs(offset: ID, limit: Int): PaginatedDialogsOutput
  }

  type Mutation {
    createMessage(message: Message): ID
    deleteDialogs(ids: [ID!]!): Int
  }

  type MessageOutput {
    _id: ID!
    text: String!
    ad: RemovalApplicationOutput!
    sender: UserOutput!
    receiver: UserOutput!
    viewed: Boolean
  }

  type DialogOutput {
    _id: ID!
    messages: [MessageOutput]
  }

  type PaginatedDialogsOutput {
    dialogs: [DialogOutput]
    totalCount: Int
  }

  input Message {
    text: String!
    ad: ID!
    sender: ID!
    receiver: ID!
  }
`
