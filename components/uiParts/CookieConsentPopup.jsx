import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, Button, Grow } from '@mui/material'
import Link from './Link'
import Cookies from 'js-cookie'

const PREFIX = 'CookieConsentPopup'

const classes = {
  link: `${PREFIX}-link`,
  termsPopup: `${PREFIX}-termsPopup`,
  termsButton: `${PREFIX}-termsButton`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.link}`]: {
    color: '#adce5d',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  [`&.${classes.termsPopup}`]: {
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
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(2),
    },
  },

  [`& .${classes.termsButton}`]: {
    marginLeft: 40,
  },
}))

export default function CookieConsentPopup() {
  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const handleClick = () => {
    Cookies.set('cookieConsent', 'agreed', { expires: 31, sameSite: 'Lax' })
    setShowCookieConsent(false)
  }
  useEffect(() => {
    let cookieConsentAgreed = Cookies.get('cookieConsent')
    if (!cookieConsentAgreed) setShowCookieConsent(true)
  }, [])

  if (showCookieConsent) {
    return (
      <Root className={classes.termsPopup}>
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
      </Root>
    )
  }

  return null
}
