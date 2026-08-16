import ErrorPage from '../components/ErrorPage'

const title = 'Ошибка сервера'

export default function NotFound() {
  return (
    <ErrorPage
      headerText={title}
      contentText="На сервере возникла неизвестная ошибка"
      title={title}
    />
  )
}
