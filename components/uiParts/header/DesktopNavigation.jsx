import React from 'react'
import { makeStyles } from '@material-ui/core'
import NavigationLinks from './NavigationLinks'
import Logo from './Logo'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default function DesktopNavigation() {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <Logo />
      <NavigationLinks isDesktop />
    </div>
  )
}
