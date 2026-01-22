import React from 'react'
import dbConnect from '../../../lib/db/connection'
import ConfirmEmailPage from '../../../components/auth/ConfirmEmailPage'
import { User } from '../../../lib/db/models'

export default function ConfirmEmail(props) {
  const { urlIsValid } = props
  return <ConfirmEmailPage urlIsValid={urlIsValid} />
}

export async function getServerSideProps(context) {
  await dbConnect()
  const user = await User.findOne({
    confirmEmailToken: context.query.confirmEmailToken,
  })

  if (user) {
    user.confirmEmailToken = undefined
    user.confirmEmailExpires = undefined //ToDo: add to resetpassword route
    user.emailConfirmed = true
    await user.save()
  }
  return {
    props: {
      urlIsValid: !!user,
    },
  }
}
