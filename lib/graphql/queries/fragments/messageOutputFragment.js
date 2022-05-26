import { gql } from '@apollo/client'

export const MESSAGE_OUTPUT_FRAGMENT = gql`
  fragment MessageOutputFragment on MessageOutput {
    _id
    text
    ad {
      _id
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
`
