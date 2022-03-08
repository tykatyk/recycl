import { gql } from '@apollo/client'

export const GET_NUMBER_OF_UNREAD_MESSAGES = gql`
  query GetNumberOfUnreadMessages {
    getNumberOfUnreadMessages
  }
`

//ToDo check if this query is present in schema
export const GET_MESSAGES_BY_APPLICATION = gql`
  query GetMessagesByApplication($aplId: ID!) {
    getMessagesByApplication(aplId: $aplId) {
      lastMessage
      isRead
      wasteLocation
      wasteType
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($message: Message) {
    createMessage(message: $message)
  }
`
