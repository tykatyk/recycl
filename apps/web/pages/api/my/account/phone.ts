import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD_NOT_ALLOWED } from '../../../../lib/errors'
import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { phone as phoneValidator } from '@recycl/shared/dist/validation'

async function userPhoneHandler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(401).end()
    return
  }

  switch (req.method) {
    case 'GET': {
      await dbConnect()
      const user = await UserModel.findById(session.id)
      if (!user) return res.status(404)

      res.json({ phone: user.phone })
      break
    }
    case 'PATCH': {
      await dbConnect()
      const user = await UserModel.findById(session.id)

      if (!user) return res.status(404)
      const { phone } = req.body
      const validated = await phoneValidator.validate(phone, {
        stripUnknown: true,
      })

      if (!validated) {
        return res.status(400).end()
      }

      user.phone = validated
      await user.save()
      res.json({ message: 'Phone updated successfully' })
      break
    }
    default:
      res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(userPhoneHandler)
