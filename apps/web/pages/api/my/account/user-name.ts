import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD_NOT_ALLOWED } from '../../../../lib/errors'
import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { userName } from '@recycl/shared/dist/validation'

async function userContactsHandler(req: NextApiRequest, res: NextApiResponse) {
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

      res.json({ username: user.name })
      break
    }
    case 'PATCH': {
      await dbConnect()
      const user = await UserModel.findById(session.id)

      if (!user) return res.status(404)
      const { username } = req.body
      const validated = await userName.validate(username, {
        stripUnknown: true,
      })

      if (!validated) {
        return res.status(400).end()
      }

      user.name = validated
      await user.save()
      res.status(200).end()
      break
    }
    default:
      res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }
}

export default apiHandler(userContactsHandler)
