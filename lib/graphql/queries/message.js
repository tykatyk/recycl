import { gql } from '@apollo/client'

export const GET_UNREAD_DIALOGS_IDS = gql`
  query GetUnreadDialogsIDs {
    getUnreadDialogsIDs
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
