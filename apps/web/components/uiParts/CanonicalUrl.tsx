export default function CanonicalUrl({
  asPath,
  locale,
  defaultLocale,
  locales,
}: {
  asPath: string
  locale?: string
  defaultLocale?: string
  locales?: readonly string[]
}) {
  const siteUrl = process.env.NEXT_PUBLIC_URL

  if (!siteUrl || !locales) return null

  // 1. Get the path without the locale prefix
  const cleanPath =
    locale !== defaultLocale && asPath.startsWith(`/${locale}`)
      ? asPath.replace(`/${locale}`, '') || '/'
      : asPath

  // 2. Separate the pathname from query params (canonical URLs shouldn't include tracking/dynamic queries)
  const [cleanPathname] = cleanPath.split('?')

  // 3. Build the self-referencing canonical URL
  const canonicalUrl = `${siteUrl}${locale === defaultLocale ? '' : `/${locale}`}${cleanPathname}`

  return (
    <>
      {/* Self-referencing Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Language Links (hreflang) */}
      {locales.map((loc) => {
        const isDefault = loc === defaultLocale
        const localePath = isDefault ? cleanPathname : `/${loc}${cleanPathname}`

        return (
          <link
            key={loc}
            rel="alternate"
            hrefLang={loc}
            href={`${siteUrl}${localePath}`}
          />
        )
      })}

      {/* x-default tag for unmatched languages (points to default locale) */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${siteUrl}${cleanPathname}`}
      />
    </>
  )
}
