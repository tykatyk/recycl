import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import Link from './Link'
import Cookies from 'js-cookie'
import { Box } from '@mui/material'

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')

  const { locale, locales, pathname, query } = useRouter()
  if (!locale || !locales) {
    return null
  }

  const handleClick = (locale) => {
    Cookies.set('NEXT_LOCALE', locale, {
      expires: 365,
      path: '/',
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {locales?.map((localeItem) => {
        return (
          <Box key={localeItem}>
            <Link
              href={{
                pathname,
                query,
              }}
              locale={localeItem}
              onClick={() => handleClick(localeItem)}
              sx={{
                color: '#fff',
                fontSize: 12,
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
