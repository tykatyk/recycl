import React from 'react'
import { Typography, Box, makeStyles } from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  text: {
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
}))

export default function NoData() {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <InfoIcon color="secondary" fontSize="large" />
      <Typography className={classes.text}>Нет данных</Typography>
    </Box>
  )
}
