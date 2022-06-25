import React, { useState, useEffect } from 'react'
import { makeStyles, Typography, Button, Grow } from '@material-ui/core'
import Link from './Link.jsx'
import Cookies from 'js-cookie'

const useStyles = makeStyles((theme) => ({
  link: {
    color: '#adce5d',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  termsPopup: {
    padding: theme.spacing(4),
    background: '#6f0595;',
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
  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const handleClick = () => {
    Cookies.set('cookieConsent', 'agreed', { expires: 31, sameSite: 'Lax' })
    setShowCookieConsent(false)
  }
  useEffect(() => {
    let cookieConsentAgreed = Cookies.get('cookieConsent')
    if (!cookieConsentAgreed) setShowCookieConsent(true)
  }, [Cookies.get('cookieConsent')])

  if (showCookieConsent) {
    return (
      <div className={classes.termsPopup}>
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
          onClick={() => handleClick()}
        >
          OK
        </Button>
      </div>
    )
  }

  return null
}
