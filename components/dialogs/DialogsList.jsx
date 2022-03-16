import React from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import DialogsRow from './DialogsRow.jsx'
import { useSession } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > :last-child': {
      borderBottom: 'none',
    },
  },
}))

export default function DialogsList(props) {
  const classes = useStyles()
  const { data: session } = useSession()
  const { dialogs, checkedRows, handleRowToggle } = props
  const thisUserId = session.id

  if (dialogs) {
    return (
      <Grid item xs={12} className={classes.root}>
        {dialogs.map((dialog) => {
          const dialogId = dialog._id
          const firstMessage = dialog.messages[0]
          return (
            <DialogsRow
              key={dialogId}
              id={dialogId}
              username={
                thisUserId == firstMessage.sender._id
                  ? firstMessage.receiver.name
                  : firstMessage.sender.name
              }
              senderId={firstMessage.sender._id}
              text={firstMessage.text}
              viewed={firstMessage.viewed}
              subject={`${firstMessage.ad.wasteType.name} в городе ${firstMessage.ad.wasteLocation.description}`}
              checked={checkedRows.indexOf(dialogId) !== -1}
              handleRowToggle={handleRowToggle}
            />
          )
        })}
      </Grid>
    )
  }

  return null
}
