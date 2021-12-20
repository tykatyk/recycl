import React from 'react'
import ResetLayout from '../layouts/ResetLayout.jsx'

export default function ResetPasswordPage({ urlIsValid }) {
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
