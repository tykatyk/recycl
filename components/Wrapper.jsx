import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    // backgroundColor: '#223c4a'
    backgroundColor: `${theme.palette.background.default}`
  }
}))

export default function Wrapper(props) {
  const classes = useStyles()
  return <div className={classes.wrapper}>{props.children}</div>
}
