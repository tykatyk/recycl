import React from 'react'
import { styled } from '@mui/material/styles'
import NavigationLinks from './NavigationLinks'
import Logo from './Logo'

const PREFIX = 'DesktopNavigation'

const classes = {
  wrapper: `${PREFIX}-wrapper`,
}

const Root = styled('div')({
  [`&.${classes.wrapper}`]: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default function DesktopNavigation() {
  return (
    <Root className={classes.wrapper}>
      <Logo />
      <NavigationLinks isDesktop />
    </Root>
  )
}
