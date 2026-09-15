import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import Link from './Link'
import Cookies from 'js-cookie'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')

  const { locale, locales, asPath } = useRouter()
  const [mounted, setMounted] = useState(false)

  const handleClick = (locale) => {
    Cookies.set('NEXT_LOCALE', locale, {
      expires: 365,
      path: '/',
    })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !locale || !locales) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {locales?.map((localeItem) => {
        return (
          <Box key={localeItem}>
            <Link
              href={asPath}
              locale={localeItem}
              onClick={() => handleClick(localeItem)}
              sx={{
                color: '#fff',
                fontSize: {
                  xs: 10,
                  sm: 12,
                },
                textDecoration: localeItem === locale ? 'underline' : 'none',

                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {t('switchLocale', { locale: localeItem })}
            </Link>
          </Box>
        )
      })}
    </Box>
  )
}
