import React from 'react'
import ResetPasswordPage from '../../client/ResetPasswordPage.jsx'

export default function Reset(props) {
  const { token } = props
  return <ResetPasswordPage token={token} />
}

export async function getServerSideProps(context) {
  return {
    props: { token: context.query.token }, // will be passed to the page component as props
  }
}
