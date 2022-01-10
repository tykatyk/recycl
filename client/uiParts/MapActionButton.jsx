import React from 'react'
import clsx from 'clsx'
import { Fab, Tooltip, makeStyles } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const fabLeft = 250
const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    top: '50%',
    left: 5,
    zIndex: 1,
  },

  fabOpen: {
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    left: fabLeft,
  },
  fabClose: {
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    left: 5,
  },
}))

export default function MapActionButton(props) {
  const classes = useStyles()
  const { onClick = () => {}, open = false } = props

  return (
    <Fab
      color="primary"
      aria-label="show panel"
      className={clsx(classes.fab, {
        [classes.fabOpen]: open,
        [classes.fabClose]: !open,
      })}
      onClick={onClick}
      size="small"
    >
      {open && (
        <Tooltip title="Скрыть панель">
          <ChevronLeftIcon />
        </Tooltip>
      )}
      {!open && (
        <Tooltip title="Показать панель">
          <ChevronRightIcon />
        </Tooltip>
      )}
    </Fab>
  )
}
