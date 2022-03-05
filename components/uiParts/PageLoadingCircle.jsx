import React from 'react'
import { makeStyles, CircularProgress } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: ' 50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}))

export default function PageLoadingCircle(props) {
  const { size = 40, className = undefined } = props
  const classes = useStyles()

  return (
    <div className={className ? className : classes.root}>
      <CircularProgress size={size} color="secondary" />
    </div>
  )
}
