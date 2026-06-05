import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { NextApiRequest, NextApiResponse } from 'next'
import { WasteType, dbConnect } from '@recycl/shared/dist/server/db/'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import { addWasteTypeSchema } from '../../../lib/validation'
import { checkCaptcha } from '../../../lib/helpers/checkCaptcha'
// import sendEmail from '../../../lib/helpers/sendEmail'
import {
  validationErrorResponse,
  captchaNotPassedResponse,
} from '../../../lib/helpers/responses'

async function wasteTypes(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.id) return res.status(401).end()

  await dbConnect()

  switch (req.method) {
    case 'GET': {
      const data = await WasteType.find().lean()
      return res.json(data)
    }

    case 'POST': {
      const { recaptchaToken, ...values } = req.body

      const captchaPassed = await checkCaptcha(recaptchaToken)
      if (!captchaPassed) return captchaNotPassedResponse(res)

      try {
        await addWasteTypeSchema.validate(values, { abortEarly: false })
      } catch (error) {
        console.log(error)
        return validationErrorResponse(error, res)
      }

      res.status(200).end()

      // const contactUsEmail = 'tykatyk@gmail.com'
      // const frontendMessage = 'Сообщение отправлено'
      // const message = `Новое сообщение от пользователя ${messageData.username}.\r\n Электронная почта ${messageData.email}. \r\n ${messageData.message}`
      // return await sendEmail(res, {
      //   to: contactUsEmail,
      //   from: messageData.email,
      //   name: 'Recycl contact page',
      //   subject: messageData.subject,
      //   message,
      //   frontendMessage,
      // })
    }

    default: {
      return res.status(405).end()
    }
  }
}

export default apiHandler(wasteTypes)
