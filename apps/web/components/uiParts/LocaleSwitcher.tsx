import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import Link from './Link'
import Cookies from 'js-cookie'
import { Box } from '@mui/material'

const css = {
  color: '#fff',
  fontSize: 12,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')

  const { locale, locales, route } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale) as string

  if (!otherLocale) {
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
      {locales?.map((localeItem, idx) => {
        return (
          <Box key={idx}>
            <Link
              href={route}
              locale={localeItem}
              onClick={() => handleClick(localeItem)}
              sx={{
                ...css,
                textDecoration: localeItem === locale ? 'underline' : 'none',
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
