import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import { AppBar, Toolbar, Container, Box } from '@mui/material'
import UserMenu from './UserMenu'
import UnreadDialogsCounter from './UnreadDialogsCounter'
import UserAvatar from './UserAvatar'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import CreateButton from './CreateButton'
import { useSession } from 'next-auth/react'

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
    <AppBar
      position="static"
      id="mainHeader"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: '#1a2b34',
        alignSelf: 'flex-start',
      }}
    >
      <Container component="div">
        <Toolbar
          sx={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}
        >
          {mobileView ? (
            <MobileNavigation
              {...{ drawerOpen, handleDrawerOpen, handleDrawerClose }}
            />
          ) : (
            <DesktopNavigation />
          )}
          <Box
            sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}
          >
            {status === 'authenticated' && (
              <Box
                sx={{
                  display: 'flex',
                  paddingLeft: theme.spacing(2),
                  [theme.breakpoints.down('md')]: {
                    paddingLeft: 0,
                  },
                }}
              >
                <CreateButton />
                {/* <UnreadDialogsCounter currentDialogId={currentDialogId} /> */}
              </Box>
            )}
            <UserAvatar handleMenu={handleMenu} />
          </Box>
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
