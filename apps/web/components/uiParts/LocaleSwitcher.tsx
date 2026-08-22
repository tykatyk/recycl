import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import Link from './Link'
import Cookies from 'js-cookie'

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')

  const { locale, locales, route } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale) as string

  if (!otherLocale) {
    return null
  }

  const handleClick = () => {
    Cookies.set('NEXT_LOCALE', otherLocale, {
      expires: 365,
      path: '/',
    })
  }

  return (
    <Link
      href={route}
      locale={otherLocale}
      onClick={handleClick}
      sx={{
        color: '#fff',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      {t('switchLocale', { locale: locale as string })}
    </Link>
  )
}
