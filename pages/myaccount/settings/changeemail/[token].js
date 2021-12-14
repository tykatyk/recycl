import React from 'react'
import ChangeEmailPage from '../../../../client/uiParts/userSettings/ChangeEmailPage.jsx'
import dbConnect from '../../../../lib/db/connection'
import { User } from '../../../../lib/db/models'

export default function ChangeEmail(props) {
  const { user } = props
  return <ChangeEmailPage user={user} />
}

export async function getServerSideProps(context) {
  await dbConnect()
  const user = await User.findOne({ resetEmailToken: context.query.token })

  if (user) {
    user.resetEmailToken = undefined
    user.resetEmailExpires = undefined //ToDo: add to resetpassword route
    await user.save()
  }
  return {
    props: {
      urlIsValid: !!user,
    },
  }
}
