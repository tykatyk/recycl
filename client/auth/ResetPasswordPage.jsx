import React from 'react'
import { Grid } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { GET_USER_BY_TOKEN } from '../../lib/graphql/queries/user'
import { useQuery } from '@apollo/client'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'
import Head from '../uiParts/Head.jsx'
import ResetLayout from '../layouts/ResetLayout.jsx'
import ResetPasswordForm from './ResetPasswordForm.jsx'

export default function ResetPasswordPage({ token }) {
  const { loading, error, data } = useQuery(GET_USER_BY_TOKEN, {
    variables: { token },
  })

  if (loading)
    return (
      <>
        <Head title="Recycl | Reset Password" />
        <PageLoadingCircle />
      </>
    )

  if (error)
    return <ResetLayout message="Возникла ошибка при проверке токена" />

  if (!data.getByToken)
    return <ResetLayout message="Срок действия ссылки истек" />

  return <ResetPasswordForm token={token} />
}
