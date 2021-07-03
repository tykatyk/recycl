import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  links: {
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}))

export default function HeaderLinks() {
  const preventDefault = (event) => event.preventDefault()
  const classes = useStyles()

  return (
    <Typography
      component="nav"
      align="right"
      className={`${classes.links} ${classes.root}`}
    >
      <Link href="#" onClick={preventDefault} color="inherit">
        Заявки на сортировку
      </Link>
      <Link href="#" onClick={preventDefault} color="inherit">
        Заявки на вывоз
      </Link>
      <Link href="#" onClick={preventDefault} color="inherit">
        Переработчики
      </Link>
      <Link href="#" onClick={preventDefault} color="inherit">
        Сборщики
      </Link>
    </Typography>
  )
}
