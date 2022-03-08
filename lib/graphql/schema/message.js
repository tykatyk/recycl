import { gql } from 'apollo-server-micro'

export default gql`
  type Query {
    getNumberOfUnreadMessages: Int
  }

  type Mutation {
    createMessage(message: Message): ID
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
    text: String!
    ad: ID!
    sender: ID!
    receiver: ID!
  }
`
