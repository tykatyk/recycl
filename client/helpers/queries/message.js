import { gql } from '@apollo/client'

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
  mutation CreateMessage($message: String, $aplId: String) {
    createMessage(message: $message, aplId: $aplId)
  }
`
