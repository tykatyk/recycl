import React from 'react'
import { makeStyles } from '@material-ui/core'
import Link from '../Link.jsx'
const useStyles = makeStyles({
  root: {
    fontSize: '1.5rem',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    lineHeight: '1.334',
    letterSpacing: 0,
    color: '#adce5d',
  },
})

export default function Logo() {
  const classes = useStyles()
  return (
    <Link underline="none" href="/" className={classes.root}>
      recycl
    </Link>
  )
}
