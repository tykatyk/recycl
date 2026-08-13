import { initializeApollo } from '../../../lib/apolloClient/apolloClient'
import { registerSchema } from '../../../lib/validation'
import { checkCaptcha } from '../../../lib/helpers/checkCaptcha'
// import { perFormErrorResponse } from '../../../lib/helpers/responses'
import { captchaNotPassedResponse } from '../../../lib/helpers/responses'
import { METHOD_NOT_ALLOWED } from '../../../lib/errors'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { NextApiRequest, NextApiResponse } from 'next'
import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'

async function signUpHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const { name, email, role, recaptcha } = req.body

  const captchaPassed = await checkCaptcha(recaptcha)
  if (!captchaPassed) return captchaNotPassedResponse(res)

  await registerSchema.validate(
    {
      name,
      email,
      role,
    },
    { abortEarly: false },
  )

  await dbConnect()
  const existing = await UserModel.findOne({ email })
  if (existing) return res.status(422).end()

  const user = await UserModel.create({ name, email, roles: [role] })
  if (!user) return res.status(500).end()

  res.status(200).end()
}

export default apiHandler(signUpHandler)
