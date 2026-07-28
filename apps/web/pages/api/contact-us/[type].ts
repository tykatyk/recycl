import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import {
  proposeWasteTypeSchema,
  contactUsSchema,
} from '../../../lib/validation'
import { checkCaptcha } from '../../../lib/helpers/checkCaptcha'
import { sendEmail } from '../../../lib/helpers/email/mailer'
import { apiHandler } from '../../../lib/helpers/errorHelpers'
import {
  validationErrorResponse,
  captchaNotPassedResponse,
} from '../../../lib/helpers/responses'
import type { NextApiRequest, NextApiResponse } from 'next/types'
import { INTERNAL_SERVER_ERROR } from '../../../lib/errors'
import * as yup from 'yup'
import { EmailLetterModel } from '@recycl/shared/dist/server/db'
import type { EmailLetterVariant } from '@recycl/shared/dist/server/db/models/emailLetter'

const getEmailFrom = (email: string) => email.toLowerCase().replace(/\s/g, '')

const getEmailText = (obj: Record<string, string>) =>
  Object.values(obj).join('\r\n')

const getHtml = (obj: Record<string, string>) => {
  const { header, ...rest } = obj
  return `
        <html>
            <head>
              <meta charset="utf-8" />
              <title>${header}</title>
            </head>
            <body style="font-family: Arial, Helvetica, sans-serif;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td>
                  <h1 style="font-weight:500; font-size:1.25rem; lineHeight:1.6; letter-spacing:0.0075em">${header}</h1>
                </td>
              </tr>
                <tr>
                  <td>
                    <p>
                      ${Object.values(rest).join('</p><p>')}
                    </p>
                  </td>
                </tr>
              </table>
            </body>
          </html>
        `
}

const validateEmailTo = (email: string) => {
  try {
    yup.string().email().validateSync(email)
  } catch (err) {
    console.log(err)
    throw new Error(INTERNAL_SERVER_ERROR)
  }
}
type HandleEmailSendingParams = {
  to: string
  from: string
  subject: string
  messageType: EmailLetterVariant
  html: string
  text: string
}
const handleEmailSending = async (params: HandleEmailSendingParams) => {
  const { to, from, subject, html, text } = params
  const emailLetterParams = { to, from, subject, message: text }

  try {
    await sendEmail({ to, subject, html, text })
  } catch (err) {
    console.log(err)
    await EmailLetterModel.create({
      ...emailLetterParams,
      status: 'failed',
      lastError: err instanceof Error ? err.message : 'Unknown error',
    })
    throw new Error(`Could not send an email to the admin`)
  }
  await EmailLetterModel.create({
    ...emailLetterParams,
    status: 'sent',
  })
}

const generalContactHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, authOptions)

  const { recaptchaToken, ...values } = req.body

  try {
    await contactUsSchema.validate(values, { abortEarly: false })
  } catch (error) {
    console.log(error)
    return validationErrorResponse(error, res)
  }

  const {
    email,
    subject: userSubject,
    userName,
    message,
  } = values as yup.InferType<typeof contactUsSchema>

  const emailFrom = getEmailFrom(email)
  const emailTo = process.env.SMTP_USER || ''
  validateEmailTo(emailTo)
  const subject = `Новове сообщение с сайта ${process.env.BRAND}`

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

  res.status(200).json({ success: true })
}

const proposeWasteTypeContactHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const session = await getServerSession(req, res, authOptions)

  const { recaptchaToken, ...values } = req.body

  try {
    await proposeWasteTypeSchema.validate(values, { abortEarly: false })
  } catch (error) {
    console.log(error)
    return validationErrorResponse(error, res)
  }

  const { userName, email, wasteTypeToAdd, additionalNotes } =
    values as yup.InferType<typeof proposeWasteTypeSchema>

  const notes = additionalNotes
    ? `Дополнительные примечания пользователя: ${additionalNotes}`
    : ''

  const emailTo = process.env.SMTP_USER || ''

  validateEmailTo(emailTo)

  const emailFrom = getEmailFrom(email)

  const emailText = {
    header: `Поступило предложение о добавлении нового типа вторсырья`,
    userName: `Имя пользователя, который внес предложение: ${userName}.`,
    userEmail: `Email пользователя: ${email}.`,
    userId: `ID пользователя: ${session?.id || 'недоступен'}.`,
    wasteTypeToAdd: `Тип вторсырья, который предлагается добавить: ${wasteTypeToAdd.toLocaleLowerCase()}.`,
    additionalNotes: `${notes}`,
  }

  const emailParams = {
    to: emailTo,
    from: emailFrom,
    subject: 'Предложение о добавлении нового типа вторсырья',
    messageType: 'proposeWasteType' as const,
    html: getHtml(emailText),
    text: getEmailText(emailText),
  }

  await handleEmailSending(emailParams)

  res.status(200).json({ success: true })
}

const requestHandlers = {
  general: generalContactHandler,
  'propose-waste-type': proposeWasteTypeContactHandler,
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
