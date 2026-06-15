import { useState } from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { Drawer, Toolbar, List } from '@mui/material'
import MapActionButton from './MapActionButton'

const PREFIX = 'MapSidebar'

const classes = {
  drawer: `${PREFIX}-drawer`,
  drawerOpen: `${PREFIX}-drawerOpen`,
  drawerClose: `${PREFIX}-drawerClose`,
}

const drawerWidth = 240

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.drawer}`]: {
    maxWidth: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },

  [`& .${classes.drawerOpen}`]: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  [`& .${classes.drawerClose}`]: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
  },
}))

export default function MapSidebar(props) {
  const [open, setOpen] = useState(true)
  const handleDrawerToggle = () => {
    setOpen(!open)
  }
  const { children } = props

  return (
    <Root>
      <MapActionButton onClick={handleDrawerToggle} open={open} />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <Toolbar />
        <List>{children}</List>
      </Drawer>
    </Root>
  )
}
