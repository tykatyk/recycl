import React from 'react'
import { styled } from '@mui/material/styles'

import { GridOverlay } from '@mui/x-data-grid'
import InfoIcon from '@mui/icons-material/Info'

const PREFIX = 'DataGridErrorOverlay'

const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`,
}

const StyledGridOverlay = styled(GridOverlay)(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.label}`]: {
    marginTop: theme.spacing(1),
    color: theme.palette.error.main,
  },
}))

export default function DataGridErrorOverlay() {
  return (
    <StyledGridOverlay className={classes.root}>
      <InfoIcon color="error" fontSize="large" />
      <div className={classes.label}>Ошибка при загрузке данных</div>
    </StyledGridOverlay>
  )
}
