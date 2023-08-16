import React from 'react'
import ChangeEmailPage from '../../../../components/uiParts/userSettings/ChangeEmailPage'
import dbConnect from '../../../../lib/db/connection'
import { User } from '../../../../lib/db/models'

export default function ChangeEmail(props) {
  const { urlIsValid } = props
  return <ChangeEmailPage urlIsValid={urlIsValid} />
}

export async function getServerSideProps(context) {
  await dbConnect()
  const user = await User.findOne({ resetEmailToken: context.query.token })
  const { newEmail } = user

  if (user) {
    user.resetEmailToken = undefined
    user.resetEmailExpires = undefined
    if (newEmail) user.email = newEmail
    user.newEmail = undefined
    user.emailConfirmed = true
    await user.save()
  }

  return {
    props: {
      urlIsValid: !!user,
    },
  }
}
