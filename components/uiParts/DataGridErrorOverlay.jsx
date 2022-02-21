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
    color: theme.palette.error.main,
  },
}))

export default function DataGridErrorOverlay() {
  const classes = useStyles()

  return (
    <GridOverlay className={classes.root}>
      <InfoIcon color="error" fontSize="large" />
      <div className={classes.label}>Возникла ошибка при загрузке данных</div>
    </GridOverlay>
  )
}
