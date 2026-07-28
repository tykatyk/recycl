import ErrorPage from '../components/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      headerText="Ошибка сервера"
      contentText="На сервере возникла неизвестная ошибка"
      title="Ошибка сервера | Recycl"
    />
  )
}
