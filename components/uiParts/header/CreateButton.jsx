import React from 'react'
import {
  Button,
  IconButton,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'

const useStyles = makeStyles((theme) => ({
  createButton: {
    textTransform: 'capitalize',
    marginRight: theme.spacing(2),
    fontSize: '1rem',
    fontWeight: '400',
  },
}))

export default function CreateButton(props) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles()
  const href = '/removal/application/create'

  if (matches) {
    return (
      <IconButton aria-label="create application" color="inherit" href={href}>
        <AddCircleIcon />
      </IconButton>
    )
  }

  return (
    <Button
      variant="outlined"
      color="inherit"
      href={href}
      className={classes.createButton}
    >
      Создать
    </Button>
  )
}
