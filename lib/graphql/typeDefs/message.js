import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getUnreadDialogsIDs: [ID]
    getDialogs(offset: Int, limit: Int): PaginatedDialogsOutput
    getDialog(id: ID!, offset: ID, limit: Int): [MessageOutput]
  }

  type Mutation {
    createMessage(message: Message): MessageOutput
    updateMessage(id: ID!, payload: MessageUpdate!): MessageOutput
    deleteDialogs(ids: [ID!]!): DeleteManyOutput
    deleteStaleDialogs: DeleteManyOutput
  }

  type MessageOutput {
    _id: ID!
    text: String!
    ad: RemovalApplicationOutput!
    senderId: ID
    senderName: String!
    receiverId: ID!
    receiverName: String!
    dialogId: ID!
    dialogInitiatorId: ID
    dialogReceiverId: ID
    viewed: Boolean!
    createdAt: Date!
  }

  type DialogOutput {
    _id: ID!
    messages: [MessageOutput]
  }

  type PaginatedDialogsOutput {
    dialogs: [MessageOutput]
    totalCount: Int
  }

  input Message {
    text: String!
    ad: ID!
    senderId: ID!
    senderName: String!
    receiverId: ID!
    receiverName: String!
    dialogId: ID!
    dialogInitiatorId: ID
    dialogReceiverId: ID
    viewed: Boolean
  }
  input MessageUpdate {
    viewed: Boolean!
  }
`
