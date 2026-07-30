import { NextApiRequest, NextApiResponse } from 'next'
import { METHOD_NOT_ALLOWED } from '../../lib/errors'
import {
  dbConnect,
  ComplaintModel,
  UserModel,
} from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../lib/helpers/errorHelpers'
import { complaintFormSchema } from '../../lib/validation/complaintForm'
import { authOptions } from './auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { getEmailText } from '../../lib/helpers/email/mailer'
import { handleEmailSending, getHtml } from '../../lib/helpers/email/mailer'
import { email as emailValidator } from '@recycl/shared/dist/validation'

async function complaintHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: METHOD_NOT_ALLOWED })
  }

  const validated = await complaintFormSchema.validate(req.body, {
    abortEarly: false,
  })

  const { complaint, complaintUrl } = validated

  const session = await getServerSession(req, res, authOptions)
  const user = await UserModel.findById(session?.id)

  const forwarded = req.headers['x-forwarded-for']
  const userIp =
    typeof forwarded === 'string'
      ? forwarded.split(',')[0]?.trim()
      : req.socket.remoteAddress

  await dbConnect()
  await ComplaintModel.create({
    complaint: complaint.trim(),
    complaintUrl,
    userIp: userIp || '',
    ...(user ? { userId: user._id } : {}),
  })

  const emailFrom = process.env.EMAIL_FROM || ''
  await emailValidator.validate(emailFrom)

  const emailTo = process.env.SMTP_USER || ''
  await emailValidator.validate(emailTo)

  const subject = `Поступила жалоба с сайта ${process.env.BRAND}`

  const emailText = {
    header: subject,
    userIp: `IP адрес пользователя, отправившего жалобу: ${userIp}` || '',
    ...(user
      ? {
          userName: `Имя пользователя, отправившего жалобу: ${user.name}`,
          userEmail: `Email пользователя, отправившего жалобу: ${user.email}`,
        }
      : {}),
    message: `Текст сообщения: ${complaint}.`,
  }

  const emailParams = {
    to: emailTo,
    from: emailFrom,
    subject,
    messageType: 'complaint' as const,
    html: getHtml(emailText),
    text: getEmailText(emailText),
  }

  await handleEmailSending(emailParams)

  res.status(204).end()
}

export default apiHandler(complaintHandler)
