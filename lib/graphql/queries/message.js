import { gql } from '@apollo/client'
import { MESSAGE_OUTPUT_FRAGMENT } from './fragments/messageOutputFragment'

export const GET_UNREAD_DIALOG_IDS = gql`
  query GetUnreadDialogsIDs {
    getUnreadDialogsIDs
  }
`

export const GET_DIALOGS = gql`
  ${MESSAGE_OUTPUT_FRAGMENT}
  query GetDialogs($offset: ID, $limit: Int) {
    getDialogs(offset: $offset, limit: $limit) {
      dialogs {
        ...MessageOutputFragment
      }
      totalCount
    }
  }
`

export const GET_DIALOG = gql`
  ${MESSAGE_OUTPUT_FRAGMENT}

  query GetDialog($id: ID!, $offset: ID, $limit: Int) {
    getDialog(id: $id, offset: $offset, limit: $limit) {
      ...MessageOutputFragment
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($message: Message) {
    createMessage(message: $message) {
      _id
      text
      ad {
        _id
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

export const ON_USER_TYPING = gql`
  subscription OnUserTyping($userId: ID!, $dialogId: ID!) {
    userIsTyping(userId: $userId, dialogId: $dialogId)
  }
`
