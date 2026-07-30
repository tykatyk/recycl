import nodemailer from 'nodemailer'
import { EmailLetterModel } from '@recycl/shared/dist/server/db'
import type { EmailLetterVariant } from '@recycl/shared/dist/server/db/models/emailLetter'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  // secure: false, // true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // logger: true,
  // debug: true,
  transactionLog: true, // include SMTP traffic in the logs
  allowInternalNetworkInterfaces: false,
})

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text: string
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
    text,
  })
}

export const getEmailText = (obj: Record<string, string>) =>
  Object.values(obj).join('\r\n')

export const getHtml = (obj: Record<string, string>) => {
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

type HandleEmailSendingParams = {
  to: string
  from: string
  subject: string
  messageType: EmailLetterVariant
  html: string
  text: string
}
export const handleEmailSending = async (params: HandleEmailSendingParams) => {
  const { to, from, subject, html, text, messageType } = params
  const emailLetterParams = { to, from, subject, messageType, message: text }

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
