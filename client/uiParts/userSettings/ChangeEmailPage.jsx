import React from 'react'
import ResetLayout from '../../layouts/ResetLayout.jsx'

export default function ChangeEmailPage({ urlIsValid }) {
  const title = 'Смена email'
  if (!urlIsValid)
    return <ResetLayout title={title} message="Срок действия ссылки истек" />

  return (
    <ResetLayout
      title={title}
      message="Адрес электронной почты успешно изменен"
      severity="success"
    />
  )
}
