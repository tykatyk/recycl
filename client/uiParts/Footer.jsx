import React from 'react'
import { Typography, Container, makeStyles, Grid } from '@material-ui/core'
import Copyright from './Copyright.jsx'

const useStyles = makeStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
  },
}))

export default function Footer() {
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <Container component="div">
        <Copyright />
      </Container>
    </footer>
  )
}
