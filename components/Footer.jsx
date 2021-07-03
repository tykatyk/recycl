import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme) => ({
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: 'auto',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    },
    backgroundColor: '#20232a',
    color: '#fff',
    '& > :first-child': {
      marginBottom: theme.spacing(2)
    }
  }
}))

export default function Footer() {
  const classes = useStyles()

  return (
    <footer className={classes.footer}>
      <Typography variant="body2" align="center">
        <Link color="inherit" href="https://material-ui.com/">
          Recycl
        </Link>
        {' © '}
        {new Date().getFullYear()}
      </Typography>
    </footer>
  )
}
