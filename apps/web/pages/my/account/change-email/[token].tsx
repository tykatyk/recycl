import ChangeEmailPage from '../../../../components/uiParts/userSettings/ChangeEmailPage'
import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'

export default function ChangeEmail(props) {
  const { urlIsValid } = props
  return <ChangeEmailPage urlIsValid={urlIsValid} />
}

export async function getServerSideProps(context) {
  await dbConnect()
  const user = await UserModel.findOne({
    resetEmailToken: context.query.token,
    resetEmailExpires: { $gte: Date.now() },
  })
  if (!user) {
    return {
      notFound: true,
    }
  }
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
