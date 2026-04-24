import React from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import { Fab, Tooltip } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const PREFIX = 'MapActionButton'

const classes = {
  fab: `${PREFIX}-fab`,
  fabOpen: `${PREFIX}-fabOpen`,
  fabClose: `${PREFIX}-fabClose`,
}

const StyledFab = styled(Fab)(({ theme }) => ({
  [`&.${classes.fab}`]: {
    position: 'fixed',
    top: '50%',
    left: 5,
    zIndex: 1,
  },

  [`&.${classes.fabOpen}`]: {
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    left: fabLeft,
  },

  [`&.${classes.fabClose}`]: {
    transition: theme.transitions.create('left', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    left: 5,
  },
}))

const fabLeft = 250

export default function MapActionButton(props) {
  const { onClick = () => {}, open = false } = props

  return (
    <StyledFab
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
    </StyledFab>
  )
}
