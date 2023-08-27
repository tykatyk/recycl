import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Avatar, IconButton } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useSession } from 'next-auth/react'

const PREFIX = 'UserAvatar'

const classes = {
  small: `${PREFIX}-small`,
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  [`& .${classes.small}`]: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

export default function UserAvatar(props) {
  const { data: session, status } = useSession()

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
    <StyledIconButton
      aria-label="account of current user"
      aria-controls="menu-appbar"
      aria-haspopup="true"
      onClick={handleMenu}
      color="inherit"
      size="large"
    >
      {avatar}
    </StyledIconButton>
  )
}
