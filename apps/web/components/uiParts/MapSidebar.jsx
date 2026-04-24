import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import MapActionButton from './MapActionButton'

const PREFIX = 'MapSidebar'

const classes = {
  drawer: `${PREFIX}-drawer`,
  drawerOpen: `${PREFIX}-drawerOpen`,
  drawerClose: `${PREFIX}-drawerClose`,
  secondaryColor: `${PREFIX}-secondaryColor`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.drawer}`]: {
    width: drawerWidth,
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

  [`& .${classes.secondaryColor}`]: {
    color: theme.palette.secondary.main,
  },
}))

const drawerWidth = 240

export default function MapSidebar(props) {
  const [open, setOpen] = useState(false)
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
        <List>
          <ListItem
            button
            component="a"
            href="/applications/create"
            key="Подать заявку"
            className={classes.secondaryColor}
          >
            <ListItemIcon>
              <AddIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Подать заявку" />
          </ListItem>
          <Divider variant="inset" component="li" />
          {children}
        </List>
      </Drawer>
    </Root>
  )
}
