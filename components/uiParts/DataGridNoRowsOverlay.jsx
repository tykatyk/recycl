import React from 'react'
import { makeStyles } from '@material-ui/core'
import { GridOverlay } from '@mui/x-data-grid'
import InfoIcon from '@material-ui/icons/Info'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
}))

export default function DataGridNoRowsOverlay() {
  const classes = useStyles()

  return (
    <GridOverlay className={classes.root}>
      <InfoIcon color="secondary" fontSize="large" />
      <div className={classes.label}>Нет данных</div>
    </GridOverlay>
  )
}
