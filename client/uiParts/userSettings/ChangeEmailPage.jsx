import React from 'react'
import ResetLayout from '../../layouts/ResetLayout.jsx'

export default function ChangeEmailPage({ urlIsValid }) {
  if (!urlIsValid) return <ResetLayout message="Срок действия ссылки истек" />

  return (
    <ResetLayout
      message="Адрес электронной почты успешно изменен"
      severity="success"
    />
  )
}
