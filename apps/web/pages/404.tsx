import ErrorPage from '../components/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      headerText="Страница не найдена"
      contentText="Запрашиваемая вами страница не найдена на этом сервере"
      title="Страница не найдена | Recycl"
    />
  )
}
