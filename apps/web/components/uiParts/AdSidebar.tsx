import { Drawer, Box } from '@mui/material'
import MapActionButton from './MapActionButton'
import AdSidebarItemsCommon from './AdSidebarItemsCommon'

export default function AdSidebar(props) {
  const { children, drawerWidth, handleDrawerToggle, drawerOpen } = props

  return (
    <Box sx={{ width: drawerWidth }}>
      <MapActionButton onClick={handleDrawerToggle} open={drawerOpen} />
      <Drawer
        open={drawerOpen}
        variant="persistent"
        sx={(theme) => ({
          width: drawerWidth,
          flexShrink: 0,
          anchor: 'left',
          '& .MuiDrawer-paper': {
            background: '#283f4c',
            width: drawerWidth,
          },
        })}
      >
        {children}
        <AdSidebarItemsCommon />
      </Drawer>
    </Box>
  )
}
