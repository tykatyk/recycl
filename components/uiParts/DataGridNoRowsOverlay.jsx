import React from 'react'
import { styled } from '@mui/material/styles'

import { GridOverlay } from '@mui/x-data-grid'
import InfoIcon from '@mui/icons-material/Info'

const PREFIX = 'DataGridNoRowsOverlay'

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
    color: theme.palette.secondary.main,
  },
}))

export default function DataGridNoRowsOverlay() {
  return (
    <StyledGridOverlay className={classes.root}>
      <InfoIcon color="secondary" fontSize="large" />
      <div className={classes.label}>Нет данных</div>
    </StyledGridOverlay>
  )
}
