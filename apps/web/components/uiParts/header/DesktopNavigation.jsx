import { Box } from '@mui/material'
import NavigationLinks from './NavigationLinks'
import Logo from './Logo'

export default function DesktopNavigation() {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Logo />
      <NavigationLinks isDesktop />
    </Box>
  )
}
