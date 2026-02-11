import ResetLayout from '../layouts/ResetLayout'

export default function ConfirmEmailPage({ urlIsValid }) {
  const title = 'Подтверждение email'
  if (!urlIsValid)
    return <ResetLayout title={title} message="Срок действия ссылки истек" />

  return (
    <ResetLayout
      title={title}
      message="Email адрес успешно подтвержден"
      severity="success"
    />
  )
}
