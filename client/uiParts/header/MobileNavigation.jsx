import React from 'react'
import { IconButton, Drawer, makeStyles } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NavigationLinks from './NavigationLinks.jsx'
import Logo from './Logo.jsx'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  logoWrapper: {
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
    justifyContent: 'center',
  },
})

export default function MobileNavigation(props) {
  const classes = useStyles()
  const { drawerOpen, handleDrawerOpen, handleDrawerClose } = props

  return (
    <div className={classes.wrapper}>
      <IconButton
        {...{
          'aria-label': 'menu',
          'aria-haspopup': 'true',
          onClick: handleDrawerOpen,
          color: 'inherit',
        }}
      >
        <MenuIcon />
      </IconButton>
      <div className={classes.logoWrapper}>
        <Logo />
      </div>
      <Drawer
        {...{
          anchor: 'left',
          open: drawerOpen,
          onClose: handleDrawerClose,
        }}
      >
        <NavigationLinks isDesktop={false} />
      </Drawer>
    </div>
  )
}
