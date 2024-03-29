import React from 'react'
import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'
import DialogsRow from './DialogsRow'
import { useSession } from 'next-auth/react'

const PREFIX = 'DialogsList'

const classes = {
  root: `${PREFIX}-root`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`&.${classes.root}`]: {
    '& > :last-child': {
      borderBottom: 'none',
    },
  },
}))

export default function DialogsList(props) {
  const { data: session } = useSession()
  const { messages, checkedRows, handleRowToggle } = props
  const thisUserId = session.id

  if (messages) {
    return (
      <StyledGrid item xs={12} className={classes.root}>
        {messages.map((message) => {
          return (
            <DialogsRow
              key={message._id}
              messageId={message._id}
              dialogId={message.dialogId}
              username={
                thisUserId == message.senderIid
                  ? message.receiverName
                  : message.senderName
              }
              senderId={message.senderId}
              text={message.text}
              viewed={message.viewed}
              subject={`${message.ad.wasteType.name} в городе ${message.ad.wasteLocation.description}`}
              checked={
                checkedRows
                  .map((el) => el.dialogId)
                  .indexOf(message.dialogId) !== -1
              }
              handleRowToggle={handleRowToggle}
            />
          )
        })}
      </StyledGrid>
    )
  }

  return null
}
