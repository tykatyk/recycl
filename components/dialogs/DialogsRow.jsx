import React from 'react'
import { styled } from '@mui/material/styles'
import { Grid, Typography, Checkbox } from '@mui/material'
import { useRouter } from 'next/router'
import clsx from 'clsx'

import { useSession } from 'next-auth/react'

const PREFIX = 'DialogsRow'

const classes = {
  root: `${PREFIX}-root`,
  unreadMessage: `${PREFIX}-unreadMessage`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`&.${classes.root}`]: {
    padding: theme.spacing(2),
    borderBottom: '1px solid #fff',
    cursor: 'pointer',
    background: theme.palette.background.paper,
    '&:hover': {
      background: theme.palette.grey['800'],
    },
    alignItems: 'stretch',
  },

  [`& .${classes.unreadMessage}`]: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
}))

export default function DialogsRow(props) {
  const { data: session } = useSession()
  const router = useRouter()

  const {
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

  const navigateLink = (e) => {
    if (e.type === 'click' || e.key === 'Enter') {
      let ref = e.target != null ? e.target : e.srcElement
      if (!ref || ref.nodeName === 'INPUT') return
      router.push(`/my/dialogs/${dialogId}`)
    }
  }

  return (
    <StyledGrid
      className={classes.root}
      container
      item
      xs={12}
      alignItems="center"
      role="link"
      tabIndex="0"
      aria-label={`Dialog with ${username} about ${subject}`}
      onClick={(e) => navigateLink(e)}
    >
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
      <Grid
        item
        xs={2}
        zeroMinWidth
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
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
    </StyledGrid>
  )
}
