import React from 'react'
import {
  MenuItem,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  ListItem,
  MenuList,
  ListItemText,
  useTheme,
  makeStyles,
} from '@material-ui/core'
import Link from '../Link.jsx'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import appoloClient from '../../../lib/appoloClient/appoloClient'

const useStyles = makeStyles({
  link: {
    width: '100%',
    height: '100%',
  },
})

export default function UserMenu(props) {
  const theme = useTheme()
  const classes = useStyles()
  const { data: session, status } = useSession()
  const preventDefault = () => false
  const { open, anchorEl, handleClose, handleListKeyDown } = props

  const menuItems = [
    {
      text: 'Мои заявки',
      href: '/removal/application',
    },
    {
      text: 'Настройки',
      href: '/myaccount/settings',
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
          await appoloClient.resetStore()
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
    <Popper
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
    </Popper>
  )
}
