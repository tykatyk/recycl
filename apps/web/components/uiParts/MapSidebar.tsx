import { useState } from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import {
  Drawer,
  Toolbar,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import AddIcon from '@mui/icons-material/Add'
import MapActionButton from './MapActionButton'
import variant from '../../pages/api/subscriptions/variant'

const createAddButtonText = "Подать объявление о наличии вторсырья"

const PREFIX = 'MapSidebar'

const classes = {
  drawer: `${PREFIX}-drawer`,
  drawerOpen: `${PREFIX}-drawerOpen`,
  drawerClose: `${PREFIX}-drawerClose`,
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
}))

const drawerWidth = 240

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
        <List>
          <ListItemButton
            component="a"
            href="/applications/create"
            key={createAddButtonText}
            sx={{
              color:'primary.main'
            }}
          >
            <ListItemIcon>
              <AddIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary={createAddButtonText} primaryTypographyProps={{variant:'body2'}} sx={{whiteSpace: "normal"}} />
          </ListItemButton>
          <Divider variant="inset" component="li" />
          {children}
        </List>
      </Drawer>
    </Root>
  )
}
