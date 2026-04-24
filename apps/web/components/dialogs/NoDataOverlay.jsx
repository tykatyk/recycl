import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography, Box } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

const PREFIX = 'NoDataOverlay'

const classes = {
  root: `${PREFIX}-root`,
  text: `${PREFIX}-text`,
}

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.text}`]: {
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
}))

export default function NoData() {
  return (
    <StyledBox className={classes.root}>
      <InfoIcon color="secondary" fontSize="large" />
      <Typography className={classes.text}>Нет данных</Typography>
    </StyledBox>
  )
}
