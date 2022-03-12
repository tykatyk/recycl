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
      viewed
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

export const DELETE_DIALOGS = gql`
  mutation DeleteDialogs($ids: [ID!]!) {
    deleteDialogs(ids: $ids)
  }
`
