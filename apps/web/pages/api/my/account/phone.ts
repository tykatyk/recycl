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
  const userId = session.id

  switch (req.method) {
    case 'GET': {
      await dbConnect()
      const user = await UserModel.findById(userId)
      if (!user) return res.status(404)

      res.json({ phone: user.phone })
      break
    }
    case 'PATCH': {
      const { phone } = req.body
      const newPhone = await phoneValidator.validate(phone, {
        stripUnknown: true,
      })

      if (!newPhone) {
        return res.status(400).end()
      }

      await dbConnect()

      const result = await Promise.all([
        UserModel.findById(session.id),
        UserModel.find({ phone: newPhone }),
      ])

      const [user, otherUsers] = result

      if (!user) return res.status(404)
      if (otherUsers && otherUsers.length > 0) {
        return res.status(422).json({
          error: {
            type: 'perField',
            message: {
              phone: 'Этот номер уже используется',
            },
          },
        })
      }

      user.phone = newPhone
      await user.save()
      res.status(200).end()
      break
    }
    default:
      res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(userPhoneHandler)
