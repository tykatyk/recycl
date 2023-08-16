import React, { useState, useEffect } from 'react'
import { Avatar, IconButton, makeStyles } from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { useSession } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

export default function UserAvatar(props) {
  const { data: session, status } = useSession()
  const classes = useStyles()
  const { handleMenu } = props
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    let localAvatar

    if (status === 'authenticated') {
      localAvatar = (
        <Avatar
          alt={session.user.name}
          src={session.user.image || '#'}
          className={classes.small}
        />
      )
    } else {
      localAvatar = <AccountCircle />
    }
    setAvatar(localAvatar)
  }, [session, status, classes])

  return (
    <IconButton
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleMenu}
      color="inherit"
    >
      {avatar}
    </IconButton>
  )
}
