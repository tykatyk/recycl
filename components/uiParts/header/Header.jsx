import React, { useState, useEffect } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { AppBar, Toolbar, Container } from '@mui/material'
import UserMenu from './UserMenu'
import UnreadDialogsCounter from './UnreadDialogsCounter'
import UserAvatar from './UserAvatar'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import CreateButton from './CreateButton'
import { useSession } from 'next-auth/react'

const PREFIX = 'Header'

const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  buttons: `${PREFIX}-buttons`,
  gutter: `${PREFIX}-gutter`,
}

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  [`&.${classes.root}`]: {
    zIndex: theme.zIndex.drawer + 1,
    background: theme.palette.primary.main,
  },

  [`& .${classes.header}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 0,
  },

  [`& .${classes.buttons}`]: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },

  [`& .${classes.gutter}`]: {
    display: 'flex',
    paddingLeft: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
    },
  },
}))

export default function Header(props) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const menuOpen = Boolean(anchorEl)
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  })
  const { mobileView, drawerOpen } = state
  const { status } = useSession()
  const { currentDialogId } = props

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
  }, [theme])

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
    <StyledAppBar position="static" id="mainHeader" className={classes.root}>
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
                <UnreadDialogsCounter currentDialogId={currentDialogId} />
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
    </StyledAppBar>
  )
}
