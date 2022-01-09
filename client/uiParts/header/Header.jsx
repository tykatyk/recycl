import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  MenuItem,
  Drawer,
  Container,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
  Badge,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MailIcon from '@material-ui/icons/Mail'
import MenuIcon from '@material-ui/icons/Menu'
import Link from '../Link.jsx'
import HeaderLinks from './HeaderLinks.jsx'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import appoloClient from '../../../lib/appoloClient/appoloClient'

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  header: {
    padding: 0,
  },
  actions: {
    marginLeft: 'auto',
  },
}))

export default function Header() {
  const preventDefault = () => false
  const classes = useStyles()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  })
  const { status } = useSession()

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
    <AppBar position="static" id="mainHeader" className={classes.root}>
      <Container component="div">
        <Toolbar className={classes.header}>
          {mobileView ? displayMobile() : displayDesktop()}

          <div className={classes.actions}>
            <Button
              variant="outlined"
              color="inherit"
              href="/removal/application/create"
              style={{ textTransform: 'capitalize ' }}
            >
              Создать
            </Button>
            <IconButton href="#">
              <Badge badgeContent={4} color="secondary">
                <MailIcon
                  aria-label="incoming messages"
                  aria-controls="menu-appbar"
                  aria-haspopup="false"
                  color="inherit"
                />
              </Badge>
            </IconButton>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
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
                        <Link
                          href="/removal/application"
                          onClick={preventDefault}
                          color="inherit"
                        >
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
                            onClick={async () => {
                              preventDefault(),
                                await signOut({
                                  callbackUrl: `${window.location.origin}`,
                                })
                              await appoloClient.resetStore()
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
