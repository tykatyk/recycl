import React from 'react'
import ResetPasswordPage from '../../../components/auth/ResetPasswordPage'

export default function Reset(props) {
  const { token } = props
  return <ResetPasswordPage token={token} />
}

export async function getServerSideProps(context) {
  return {
    props: { token: context.query.token },
  }
}
