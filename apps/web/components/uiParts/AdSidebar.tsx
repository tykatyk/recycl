// import { useState } from 'react'
import { Drawer, Box } from '@mui/material'
import MapActionButton from './MapActionButton'
import AdSidebarItemsMapView from './AdSidebarItemsMap'
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
          // maxWidth: drawerWidth,
          width: drawerWidth,
          flexShrink: 0,
          // whiteSpace: 'nowrap',
          anchor: 'left',
          '& .MuiDrawer-paper': {
            background: '#283f4c',

            // width: drawerOpen ? drawerWidth : 0,

            width: drawerWidth,
            // overflowX: 'hidden',
            // transition: theme.transitions.create('width', {
            //   easing: theme.transitions.easing.sharp,
            //   duration: drawerOpen
            //     ? theme.transitions.duration.enteringScreen
            //     : theme.transitions.duration.leavingScreen,
            // }),
          },
        })}
      >
        {children}
        <AdSidebarItemsCommon />
      </Drawer>
    </Box>
  )
}
