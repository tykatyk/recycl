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
import BlurOnIcon from '@material-ui/icons/BlurOn'
import LineWeightIcon from '@material-ui/icons/LineWeight'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import MapSidebarQuantity from './MapSidebarQuantity'
import MapActionButton from './MapActionButton'
import MapSidebarWasteTypes from './MapSidebarWasteTypes'

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

export default function MapSidebar() {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [wasteTypeOpen, setWasteTypeOpen] = useState(true)
  const [quantityOpen, setQuantityOpen] = useState(true)
  const [checked, setChecked] = useState([0])

  const handleDrawerToggle = () => {
    setOpen(!open)
  }
  const handleWasteTypeToggle = () => {
    setWasteTypeOpen(!wasteTypeOpen)
  }
  const handleQuantityToggle = () => {
    setQuantityOpen(!quantityOpen)
  }

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
          <ListItem button component="a" href="/" key="На главную">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="На главную" />
          </ListItem>
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
          <ListItem button key={'Количество'} onClick={handleQuantityToggle}>
            <ListItemIcon>
              <LineWeightIcon />
            </ListItemIcon>
            <ListItemText primary={'Количество'} />
            {quantityOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <MapSidebarQuantity open={quantityOpen} />
          <Divider variant="inset" component="li" />
          <ListItem button key={'Тип отходов'} onClick={handleWasteTypeToggle}>
            <ListItemIcon>
              <BlurOnIcon />
            </ListItemIcon>
            <ListItemText primary={'Тип отходов'} />
            {wasteTypeOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <MapSidebarWasteTypes open={wasteTypeOpen} />
        </List>
      </Drawer>
    </>
  )
}
