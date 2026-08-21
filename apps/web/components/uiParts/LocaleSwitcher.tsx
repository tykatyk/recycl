import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import Link from './Link'

export default function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher')

  const { locale, locales, route } = useRouter()
  const otherLocale = locales?.find((cur) => cur !== locale) as string

  return (
    <Link
      href={route}
      locale={otherLocale}
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
