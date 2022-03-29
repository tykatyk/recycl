import { gql } from '@apollo/client'

export const GET_UNREAD_DIALOGS_IDS = gql`
  query GetUnreadDialogsIDs {
    getUnreadDialogsIDs
  }
`

export const GET_DIALOGS = gql`
  query GetDialogs($offset: ID, $limit: Int) {
    getDialogs(offset: $offset, limit: $limit) {
      dialogs {
        _id
        text
        ad {
          wasteType {
            name
          }
          wasteLocation {
            description
          }
        }
        senderId
        senderName
        receiverId
        receiverName
        dialogId
        dialogInitiatorId
        dialogReceiverId
        viewed
        createdAt
      }
      totalCount
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
    deleteDialogs(ids: $ids) {
      deletedCount
    }
  }
`
export const DELETE_STALE_DIALOGS = gql`
  mutation DeleteStaleDialogs {
    deleteStaleDialogs {
      deletedCount
    }
  }
`
