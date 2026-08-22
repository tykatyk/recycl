import ErrorComponent from '../components/ErrorComponent'
import { useTranslations } from 'use-intl'

export default function ServerErrorPage() {
  const t = useTranslations('ServerErrorPage')
  return (
    <ErrorComponent
      headerText={t('title')}
      contentText={t('content')}
      title={t('title')}
    />
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../messages/${locale}.json`)).default,
    },
  }
}
