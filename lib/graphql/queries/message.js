import { gql } from '@apollo/client'

export const GET_NUMBER_OF_UNREAD_MESSAGES = gql`
  query GetNumberOfUnreadMessages {
    getNumberOfUnreadMessages
  }
`

export const GET_MESSAGES = gql`
  query GetMessages {
    getMessages {
      _id
      text
      isViewed
      ad {
        wasteType {
          name
        }
        wasteLocation {
          description
        }
      }
      sender {
        name
      }
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($message: Message) {
    createMessage(message: $message)
  }
`
