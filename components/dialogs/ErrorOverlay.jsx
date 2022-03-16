import React from 'react'
import { Typography, Box, makeStyles } from '@material-ui/core'
import ErrorIcon from '@material-ui/icons/Error'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

export default function ErrorOverlay() {
  const classes = useStyles()

  return (
    <Box className={classes.root}>
      <ErrorIcon color="error" fontSize="large" />
      <Typography align="center" color="error">
        Ошибка при загрузке данных
      </Typography>
    </Box>
  )
}
