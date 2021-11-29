import React from 'react'
import { Grid } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { GET_USER_BY_TOKEN } from '../lib/graphql/queries/user'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import PageLoadingCircle from './uiParts/PageLoadingCircle.jsx'
import Head from './uiParts/Head.jsx'
import AuthLayout from './layouts/AuthLayout.jsx'

export default function ResetPasswordToken() {
  const router = useRouter()
  const { token } = router.query
  const { status } = useSession()
  const { loading, error, data } = useQuery(GET_USER_BY_TOKEN, {
    variables: { token },
  })

  if (status === 'authenticated') {
    router.replace('/')
    return ''
  }

  if (loading)
    return (
      <>
        <Head title="Recycl | Reset Password" />
        <PageLoadingCircle />
      </>
    )

  if (error) {
    console.log(error)
    return <Content message="Возникла ошибка при проверке токена" />
  }

  if (!data.getByToken) return <Content message="Срок действия ссылки истек" />

  router.push('/resetpassword')
  return ''
}

const Text = (props) => {
  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Alert variant="filled" severity="error">
        {props.message}
      </Alert>
    </Grid>
  )
}

const Content = (props) => {
  return (
    <AuthLayout title="Recycl | Error">
      <Grid
        container
        alignItems="center"
        direction="column"
        style={{ flex: '1 0 auto' }}
      >
        <Grid item>
          <Text message={props.message} />
        </Grid>
      </Grid>
    </AuthLayout>
  )
}
