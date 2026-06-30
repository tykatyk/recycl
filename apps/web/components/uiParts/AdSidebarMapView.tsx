import { useState } from 'react'
import { Drawer, Box } from '@mui/material'
import MapActionButton from './MapActionButton'
import AdSidebarItems from './AdSidebarItems'

const drawerWidth = 240

export default function AdSidebarMapView(props) {
  const [drawerOpen, setDrawerOpen] = useState(true)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const { selectedValue, handleChange } = props

  return (
    <Box sx={{ width: drawerOpen ? drawerWidth : 0 }}>
      <MapActionButton onClick={handleDrawerToggle} open={drawerOpen} />
      <Drawer
        open={drawerOpen}
        variant="permanent"
        sx={(theme) => ({
          maxWidth: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',

          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : 0,
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: drawerOpen
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          },
        })}
      >
        <AdSidebarItems
          selectedValue={selectedValue}
          handleChange={handleChange}
        />
      </Drawer>
    </Box>
  )
}
