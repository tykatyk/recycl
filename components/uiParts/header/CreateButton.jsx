import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Button, IconButton, useMediaQuery } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'

const PREFIX = 'CreateButton'

const classes = {
  createButton: `${PREFIX}-createButton`,
}

const StyledButton = styled(Button)(({ theme }) => ({
  [`&.${classes.createButton}`]: {
    textTransform: 'capitalize',
    marginRight: theme.spacing(2),
    fontSize: '1rem',
    fontWeight: '400',
  },
}))

export default function CreateButton(props) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('md'))

  const href = '/applications/create'

  if (matches) {
    return (
      <IconButton
        aria-label="create application"
        color="inherit"
        href={href}
        size="large"
      >
        <AddCircleIcon />
      </IconButton>
    )
  }

  return (
    <StyledButton
      variant="outlined"
      color="inherit"
      href={href}
      className={classes.createButton}
    >
      Создать
    </StyledButton>
  )
}
