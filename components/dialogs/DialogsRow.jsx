import React from 'react'
import { Grid, Typography, Checkbox, makeStyles } from '@material-ui/core'
import clsx from 'clsx'

import { useSession } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    borderBottom: '1px solid #fff',
    cursor: 'pointer',
    background: theme.palette.background.paper,
    '&:hover': {
      background: theme.palette.grey['800'],
    },
  },
  unreadMessage: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
}))

export default function DialogsRow(props) {
  const classes = useStyles()
  const { data: session } = useSession()

  const {
    messageId,
    dialogId,
    viewed,
    username,
    senderId,
    text,
    subject,
    checked,
    handleRowToggle,
  } = props
  const textColor =
    !viewed && senderId != session.id ? 'inherit' : 'textSecondary'

  return (
    <Grid className={classes.root} container item xs={12} alignItems="center">
      <Grid item xs={2} sm={1}>
        <Checkbox
          checked={checked}
          tabIndex={-1}
          disableRipple
          onChange={() => {
            handleRowToggle(dialogId)
          }}
        />
      </Grid>
      <Grid item xs={2} zeroMinWidth>
        <Typography variant="body2" color={textColor} noWrap>
          {username}
        </Typography>
      </Grid>

      <Grid container item xs={8} zeroMinWidth>
        <Grid item xs={12}>
          <Typography
            variant="body2"
            color={textColor}
            className={clsx({
              [classes.unreadMessage]: !viewed && senderId != session.id,
            })}
            noWrap
          >
            {subject}
          </Typography>
        </Grid>
        <Grid item xs={12} zeroMinWidth>
          <Typography
            noWrap
            color={textColor}
            className={clsx({
              [classes.unreadMessage]: !viewed && senderId != session.id,
            })}
          >
            {text}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}
