import React, { useState } from 'react'
import clsx from 'clsx'
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  makeStyles,
} from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home'
import AddIcon from '@material-ui/icons/Add'
import MapActionButton from './MapActionButton'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: 0,
  },
  secondaryColor: {
    color: theme.palette.secondary.main,
  },
}))

export default function MapSidebar(props) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleDrawerToggle = () => {
    setOpen(!open)
  }
  const { children } = props

  return (
    <>
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
            href="removal/application/create"
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
    </>
  )
}
