import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Typography, Button } from '@mui/material'
import Cookies from 'js-cookie'
import { colors } from '../../lib/helpers/themeStub'
import { useTranslations } from 'next-intl'

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
    background: colors.darkBlueGreen,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    zIndex: '1200',
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
  const t = useTranslations('CookieConsent')
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
          <Typography>{t('weUseCookies')}</Typography>
        </div>
        <Button
          variant="contained"
          className={classes.termsButton}
          onClick={() => handleClick()}
        >
          {t('ok').toUpperCase()}
        </Button>
      </Root>
    )
  }

  return null
}
