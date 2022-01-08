import React from 'react'
import { Fab, Tooltip, makeStyles, useTheme } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '50%',
    left: 5,
    zIndex: 1,
  },
}))

export default function ShowSidebarButton(props) {
  const classes = useStyles()
  const { onClick } = props
  return (
    <Fab
      color="primary"
      aria-label="show panel"
      className={classes.root}
      onClick={onClick}
      size="small"
    >
      <Tooltip title="Показать панель">
        <ChevronRightIcon />
      </Tooltip>
    </Fab>
  )
}
