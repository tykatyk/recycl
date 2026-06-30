import { Drawer, Box } from '@mui/material'
import AdSidebarItems from './AdSidebarItems'

const drawerWidth = 280

export default function AdSidebarListView(props) {
  const { selectedValue, handleChange } = props

  return (
    <Box sx={{ width: drawerWidth }}>
      <Drawer
        // open={true}
        variant="permanent"
        sx={(theme) => ({
          // maxWidth: drawerWidth,
          // flexShrink: 0,
          // whiteSpace: 'nowrap',

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            // overflowX: 'hidden',
            // background: (theme) => theme.palette.grey[900],
            background: '#283f4c',
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
