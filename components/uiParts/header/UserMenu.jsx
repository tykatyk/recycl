import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import {
  MenuItem,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  ListItem,
  MenuList,
  ListItemText,
} from '@mui/material'
import Link from '../Link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { initializeApollo } from '../../../lib/apolloClient/apolloClient'

const PREFIX = 'UserMenu'

const classes = {
  link: `${PREFIX}-link`,
}

const StyledPopper = styled(Popper)({
  [`& .${classes.link}`]: {
    width: '100%',
    height: '100%',
  },
})

const apolloClient = initializeApollo()

export default function UserMenu(props) {
  const theme = useTheme()

  const { data: session, status } = useSession()
  const preventDefault = () => false
  const { open, anchorEl, handleClose, handleListKeyDown } = props

  const menuItems = [
    {
      text: 'Сдать отходы',
      href: '/my/applications',
    },
    {
      text: 'Собрать отходы',
      href: '/my/events',
    },
    {
      text: 'Настройки',
      href: '/my/account',
    },
  ]

  let logIn = (
    <Link
      href="/auth/login"
      color="inherit"
      underline="none"
      className={classes.link}
    >
      Войти
    </Link>
  )

  if (status === 'authenticated') {
    logIn = (
      <Link
        href="/"
        onClick={async () => {
          preventDefault(),
            await signOut({
              callbackUrl: `${window.location.origin}`,
            })
          await apolloClient.resetStore()
        }}
        color="inherit"
        underline="none"
        className={classes.link}
      >
        Выйти
      </Link>
    )
  }

  return (
    <StyledPopper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      transition
      disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === 'bottom' ? 'center top' : 'center bottom',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList id="menu-list-grow" onKeyDown={handleListKeyDown}>
                {status === 'authenticated' && (
                  <ListItem divider>
                    <ListItemText
                      style={{
                        textAlign: 'center',
                        color: theme.palette.secondary.main,
                      }}
                      secondary={session.user.name}
                    />
                  </ListItem>
                )}
                {menuItems.map((item, index) => (
                  <MenuItem onClick={handleClose} key={index}>
                    <Link
                      href={item.href}
                      onClick={preventDefault}
                      color="inherit"
                      underline="none"
                      className={classes.link}
                    >
                      {item.text}
                    </Link>
                  </MenuItem>
                ))}
                <MenuItem onClick={handleClose}>{logIn}</MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </StyledPopper>
  )
}
