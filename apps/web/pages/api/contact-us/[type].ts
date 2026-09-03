import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import {
  proposeWasteTypeSchema,
  contactUsSchema,
} from '../../../lib/validation'
import { checkCaptcha } from '../../../lib/helpers/checkCaptcha'
import {} from '../../../lib/helpers/responses'
import {
  captchaNotPassedResponse,
  apiHandler,
} from '../../../lib/helpers/responses'
import type { NextApiRequest, NextApiResponse } from 'next/types'
import * as yup from 'yup'
import {
  handleEmailSending,
  getEmailText,
  getHtml,
} from '../../../lib/helpers/email/mailer'
import { email as emailValidator } from '@recycl/shared/dist/validation'
import { responseStatuses } from '../../../lib/helpers/errorHelpers'
const { SUCCESS } = responseStatuses

const getEmailFrom = (email: string) => email.toLowerCase().replace(/\s/g, '')

const generalContactHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, authOptions)

  const { recaptchaToken, ...values } = req.body

  await contactUsSchema.validate(values, { abortEarly: false })

  const {
    email,
    subject: userSubject,
    userName,
    message,
  } = values as yup.InferType<typeof contactUsSchema>

  const emailFrom = getEmailFrom(email)
  const emailTo = process.env.SMTP_USER || ''
  await emailValidator.validate(emailTo)
  const subject = `Поступило новове сообщение с сайта ${process.env.BRAND}`

  const emailText = {
    header: subject,
    userTitle: `Тема сообщения, которую указал пользователь: ${userSubject}`,
    userName: `Имя пользователя: ${userName}.`,
    userEmail: `Email пользователя: ${email}.`,
    userId: `ID пользователя: ${session?.id || 'недоступен'}.`,
    message: `Текст сообщения: ${message}.`,
  }

  const emailParams = {
    to: emailTo,
    from: emailFrom,
    subject,
    messageType: 'proposeWasteType' as const,
    html: getHtml(emailText),
    text: getEmailText(emailText),
  }

  await handleEmailSending(emailParams)

  res.json({ status: SUCCESS })
}

const proposeWasteTypeHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, authOptions)

  const { recaptchaToken, ...values } = req.body

  await proposeWasteTypeSchema.validate(values, { abortEarly: false })

  const { userName, email, wasteTypeToAdd, additionalNotes } =
    values as yup.InferType<typeof proposeWasteTypeSchema>

  const notes = additionalNotes
    ? `Дополнительные примечания пользователя: ${additionalNotes}`
    : ''

  const emailTo = process.env.SMTP_USER || ''

  await emailValidator.validate(emailTo)

  const emailFrom = getEmailFrom(email)
  const subject = 'Поступило предложение о добавлении нового типа вторсырья'

  const emailText = {
    header: subject,
    userName: `Имя пользователя, который внес предложение: ${userName}.`,
    userEmail: `Email пользователя: ${email}.`,
    userId: `ID пользователя: ${session?.id || 'недоступен'}.`,
    wasteTypeToAdd: `Тип вторсырья, который предлагается добавить: ${wasteTypeToAdd.toLocaleLowerCase()}.`,
    additionalNotes: `${notes}`,
  }

  const emailParams = {
    to: emailTo,
    from: emailFrom,
    subject,
    messageType: 'proposeWasteType' as const,
    html: getHtml(emailText),
    text: getEmailText(emailText),
  }

  await handleEmailSending(emailParams)

  res.json({ status: SUCCESS })
}

const requestHandlers = {
  general: generalContactHandler,
  'propose-waste-type': proposeWasteTypeHandler,
}

async function contactUsHandler(req: NextApiRequest, res: NextApiResponse) {
  const { type: formType } = req.query

  if (typeof formType !== 'string') {
    return res.status(422).json({
      message: 'Incorrect form type',
    })
  }

  const handler = requestHandlers[formType]
  if (!handler) {
    return res.status(422).json({
      message: 'Unknown form type',
    })
  }

  const { recaptchaToken } = req.body
  const captchaPassed = await checkCaptcha(recaptchaToken)
  if (!captchaPassed) return captchaNotPassedResponse(res)

  return handler(req, res)
}

export default apiHandler(contactUsHandler)
