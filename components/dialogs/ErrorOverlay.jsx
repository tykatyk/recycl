import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography, Box } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

const PREFIX = 'ErrorOverlay'

const classes = {
  root: `${PREFIX}-root`,
}

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

export default function ErrorOverlay(props) {
  const { message = 'Ошибка при загрузке данных' } = props
  return (
    <StyledBox className={classes.root}>
      <ErrorIcon color="error" fontSize="large" />
      <Typography align="center" color="error">
        {message}
      </Typography>
    </StyledBox>
  )
}
