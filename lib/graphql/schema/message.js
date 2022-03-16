import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getUnreadDialogsIDs: [ID]
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

  type DialogsOutput {
    dialogs: [MessageOutput]
    totalCount: Int
  }

  input Message {
    text: String!
    ad: ID!
    sender: ID!
    receiver: ID!
  }
`
