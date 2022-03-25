import React from 'react'
import { Container, Typography, makeStyles } from '@material-ui/core'
import Link from './Link.jsx'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
  container: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
    '& > :last-child': {
      marginBottom: 0,
    },
  },
  link: {
    '&:hover': {
      color: '#adce5d',
    },
  },
}))

export default function Footer() {
  const classes = useStyles()

  return (
    <footer className={classes.root}>
      <Container component="div" className={classes.container}>
        <Typography variant="body2" color="textSecondary" align="center">
          <Link
            color="inherit"
            underline="none"
            href="/supportus"
            className={classes.link}
          >
            Поддержать проект
          </Link>
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          <Link
            color="inherit"
            underline="none"
            className={classes.link}
            href={`${process.env.NEXT_PUBLIC_URL}`}
          >
            {`Recycl ${new Date().getFullYear()} ©`}
          </Link>
        </Typography>
      </Container>
    </footer>
  )
}
