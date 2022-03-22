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

export default function ErrorOverlay(props) {
  const classes = useStyles()

  const { message = 'Ошибка при загрузке данных' } = props
  return (
    <Box className={classes.root}>
      <ErrorIcon color="error" fontSize="large" />
      <Typography align="center" color="error">
        {message}
      </Typography>
    </Box>
  )
}
