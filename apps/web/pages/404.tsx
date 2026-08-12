import ErrorPage from '../components/ErrorPage'

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const h1 = 'Страница не найдена'
const title = `${h1} | ${brand}`

export default function NotFound() {
  return (
    <ErrorPage
      headerText={h1}
      contentText="Запрашиваемая вами страница не найдена на этом сервере"
      title={title}
    />
  )
}
