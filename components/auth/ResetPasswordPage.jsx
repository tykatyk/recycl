import React from 'react'
import { GET_USER_BY_TOKEN } from '../../lib/graphql/queries/user'
import { useQuery } from '@apollo/client'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import Head from '../uiParts/Head'
import ResetLayout from '../layouts/ResetLayout'
import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPage({ token }) {
  const { loading, error, data } = useQuery(GET_USER_BY_TOKEN, {
    variables: { token },
  })

  const title = 'Сброс пароля'

  if (loading)
    return (
      <>
        <Head title={title} />
        <PageLoadingCircle />
      </>
    )

  if (error)
    return (
      <ResetLayout
        title={title}
        message="Возникла ошибка при проверке токена"
      />
    )

  if (!data.getByToken)
    return <ResetLayout title={title} message="Срок действия ссылки истек" />

  return <ResetPasswordForm token={token} />
}
