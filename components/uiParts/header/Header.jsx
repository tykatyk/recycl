import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Container,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import UserMenu from './UserMenu.jsx'
import UnreadMessages from './UnreadMessages.jsx'
import UserAvatar from './UserAvatar.jsx'
import DesktopNavigation from './DesktopNavigation.jsx'
import MobileNavigation from './MobileNavigation.jsx'
import CreateButton from './CreateButton.jsx'
import { useSession } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 0,
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  gutter: {
    display: 'flex',
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
}))

export default function Header() {
  const classes = useStyles()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl)
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  })
  const { mobileView, drawerOpen } = state
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

  const handleDrawerOpen = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: true }))
  const handleDrawerClose = () =>
    setState((prevState) => ({ ...prevState, drawerOpen: false }))

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

  return (
    <AppBar position="static" id="mainHeader" className={classes.root}>
      <Container component="div">
        <Toolbar className={classes.header}>
          {mobileView ? (
            <MobileNavigation
              {...{ drawerOpen, handleDrawerOpen, handleDrawerClose }}
            />
          ) : (
            <DesktopNavigation />
          )}
          <div className={classes.buttons}>
            {status === 'authenticated' && (
              <div className={classes.gutter}>
                <CreateButton />
                <UnreadMessages />
              </div>
            )}
            <UserAvatar handleMenu={handleMenu} />
          </div>
          <UserMenu
            open={menuOpen}
            anchorEl={anchorEl}
            handleClose={handleClose}
            handleListKeyDown={handleListKeyDown}
          />
        </Toolbar>
      </Container>
    </AppBar>
  )
}