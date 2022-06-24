import React from 'react'
import { makeStyles, Typography, Button } from '@material-ui/core'
import Link from './uiParts/Link.jsx'

const useStyles = makeStyles((theme) => ({
  link: {
    fontSize: '1rem',
    lineHeight: '1.5',
    letterSpacing: '0.00938em',
    color: '#adce5d',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  termsPopup: {
    padding: theme.spacing(4),
    background: '#6f0595',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    zIndex: '999',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  termsButton: {
    marginLeft: 40,
  },
}))

export default function CookieConsentPopup() {
  const classes = useStyles()

  return (
    <div container className={classes.termsPopup}>
      <div>
        <Typography>
          Мы используем файлы cookie для улучшения качества работы.
        </Typography>
        <Typography>
          Пользуясь сайтом, вы соглашаетесь с{' '}
          <Link
            href="/privacy-policy"
            className={classes.link}
            style={{ color: '#0feb5b' }}
          >
            Политикой приватности
          </Link>
          .
        </Typography>
      </div>
      <Button
        variant="contained"
        color="secondary"
        className={classes.termsButton}
      >
        OK
      </Button>
    </div>
  )
}
