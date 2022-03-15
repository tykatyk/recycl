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
          const messageId = dialog['_id']
          return (
            <DialogsRow
              key={messageId}
              id={messageId}
              username={
                thisUserId == dialog.sender._id
                  ? dialog.receiver.name
                  : dialog.sender.name
              }
              senderId={dialog.sender._id}
              text={dialog.text}
              viewed={dialog.viewed}
              subject={`${dialog.ad.wasteType.name} в городе ${dialog.ad.wasteLocation.description}`}
              checked={checkedRows.indexOf(messageId) !== -1}
              handleRowToggle={handleRowToggle}
            />
          )
        })}
      </Grid>
    )
  }

  return null
}
