import React from 'react'
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Box,
  Typography,
  makeStyles,
  useTheme,
  Container,
} from '@material-ui/core'

import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

import Link from './Link.jsx'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={`${process.env.NEXT_PUBLIC_PRODUCTION_URL}`}>
        Recycl
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignIn() {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Электронная почта"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Пароль"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Пароль повторно"
            type="password"
            id="password2"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.submit}
          >
            Зарегистрироваться
          </Button>
          <Grid container style={{ justifyContent: 'flex-end' }}>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                style={{ color: `${theme.palette.text.secondary}` }}
              >
                {'Есть аккаунт? Войдите'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
