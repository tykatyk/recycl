import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Drawer,
  Container,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuIcon from '@material-ui/icons/Menu'
import Link from '../Link.jsx'
import HeaderLinks from './HeaderLinks.jsx'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  header: {
    padding: 0,
  },
  accountBtn: {
    marginLeft: 'auto',
  },
}))

export default function Header() {
  const preventDefault = () => false
  const classes = useStyles()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  })
  const { data: session, status } = useSession()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      let isMounted = true

      const setResponsiveness = () => {
        if (isMounted) {
          window.innerWidth < theme.breakpoints.values.md
            ? setState((prevState) => ({ ...prevState, mobileView: true }))
            : setState((prevState) => ({ ...prevState, mobileView: false }))
        }
      }
      setResponsiveness()
      window.addEventListener('resize', () => setResponsiveness())

      return () => {
        isMounted = false
        window.removeEventListener('resize', () => setResponsiveness())
      }
    }
  }, [])

  const { mobileView, drawerOpen } = state

  const open = Boolean(anchorEl)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setAnchorEl(null)
    }
  }

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }))

    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }))

    return (
      <>
        <IconButton
          {...{
            'aria-label': 'menu',
            'aria-haspopup': 'true',
            onClick: handleDrawerOpen,
            color: 'inherit',
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          {...{
            anchor: 'left',
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
        >
          <HeaderLinks isDesktop={false} />
        </Drawer>
      </>
    )
  }

  const displayDesktop = () => <HeaderLinks isDesktop />

  return (
    <AppBar position="static" id="mainHeader">
      <Container component="div">
        <Toolbar className={classes.header}>
          {mobileView ? displayMobile() : displayDesktop()}
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            className={classes.accountBtn}
          >
            <AccountCircle />
          </IconButton>
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
                      <MenuItem onClick={handleClose}>
                        <Link href="#" onClick={preventDefault} color="inherit">
                          Мои заявки
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Link
                          href="/myaccount/settings"
                          onClick={preventDefault}
                          color="inherit"
                        >
                          Настройки
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        {status === 'unauthenticated' && (
                          <Link href="/auth/login" color="inherit">
                            Войти
                          </Link>
                        )}
                        {status === 'authenticated' && (
                          <Link
                            href="#"
                            onClick={() => {
                              preventDefault(),
                                signOut({
                                  callbackUrl: `${window.location.origin}`,
                                })
                            }}
                            color="inherit"
                          >
                            Выйти
                          </Link>
                        )}
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
