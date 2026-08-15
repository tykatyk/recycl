import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { AppBar, Toolbar, Container, Box, useMediaQuery } from '@mui/material'
import UserMenu from './UserMenu'
// import UnreadDialogsCounter from './UnreadDialogsCounter'
import UserAvatar from './UserAvatar'
import DesktopNavigation from './DesktopNavigation'
import MobileNavigation from './MobileNavigation'
import HeaderActions from './HeaderActions'
import Logo from './Logo'
import { colors } from '../../../lib/helpers/themeStub'

const links = [
  {
    text: 'Пункты приема вторсырья',
    href: '/collection-points',
  },
  {
    text: 'Объявления о наличии вторсырья',
    href: '/ads',
  },
]

export default function Header(props) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  const {
    currentDialogId,
    desktopBreakpoints = { xs: 'none', md: 'flex' },
    mobileViewport,
    ...rest
  } = props

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
      {...rest}
      position="static"
      id="mainHeader"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        background: colors.darkBlueGreen,
        alignSelf: 'flex-start',
      }}
    >
      <Container component="div">
        <Toolbar
          disableGutters
          sx={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Logo />
          </Box>

          <Box sx={{ flexGrow: 1, display: desktopBreakpoints, pl: 1 }}>
            <DesktopNavigation links={links} />
          </Box>

          <Box
            sx={{ display: 'flex', alignItems: 'center', ml: 'auto', pl: 1 }}
          >
            <HeaderActions />

            {/* <UnreadDialogsCounter currentDialogId={currentDialogId} /> */}
            <Box sx={{ pl: 2 }}>
              <UserAvatar handleMenu={handleMenu} />
            </Box>
          </Box>
          <UserMenu
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            handleClose={handleClose}
            handleListKeyDown={handleListKeyDown}
          />
          <Box id="mobile-anchor">
            <MobileNavigation
              links={links}
              isMobile={isMobile}
              mobileViewport={mobileViewport}
            />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
