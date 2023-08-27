import React from 'react'
import { styled } from '@mui/material/styles'
import { IconButton, Drawer } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NavigationLinks from './NavigationLinks'
import Logo from './Logo'

const PREFIX = 'MobileNavigation'

const classes = {
  wrapper: `${PREFIX}-wrapper`,
  logoWrapper: `${PREFIX}-logoWrapper`,
}

const Root = styled('div')({
  [`&.${classes.wrapper}`]: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  [`& .${classes.logoWrapper}`]: {
    display: 'flex',
    width: '100%',
    boxSizing: 'border-box',
    justifyContent: 'center',
  },
})

export default function MobileNavigation(props) {
  const { drawerOpen, handleDrawerOpen, handleDrawerClose } = props

  return (
    <Root className={classes.wrapper}>
      <IconButton
        {...{
          'aria-label': 'menu',
          'aria-haspopup': 'true',
          onClick: handleDrawerOpen,
          color: 'inherit',
        }}
        size="large"
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
    </Root>
  )
}
