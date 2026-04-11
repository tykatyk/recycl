import type { Email, EmailData } from '../../types/email'

export const emailsPerHour = 50
const emailsPerMonth = 12000

const brandName = process.env.BRAND || ''
const emailFrom = process.env.EMAIL_FROM || ''

export function prepareEmailObj(params: EmailData) {
  const { userName, userEmail, subject, html } = params

  const emailObj: Email = {
    html,
    subject,
    from: {
      name: brandName,
      email: emailFrom,
    },
    to: [
      {
        name: userName,
        email: userEmail,
      },
    ],
  }
  return emailObj
}

export const buildEncodedEmail = (data: EmailData) => {
  const { html, ...rest } = data
  const bufferedHtml = Buffer.from(html, 'utf8')
  const encodedHtml = bufferedHtml.toString('base64')

  return prepareEmailObj({ ...rest, html: encodedHtml })
}
