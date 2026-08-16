import ErrorPage from '../components/ErrorPage'

const title = 'Страница не найдена'

export default function NotFound() {
  return (
    <ErrorPage
      headerText={title}
      contentText="Запрашиваемая вами страница не найдена на этом сервере"
      title={title}
    />
  )
}
