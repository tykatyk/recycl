import type { Email, EmailData } from './types'
import { getBrandName, getEmailFrom } from '@recycl/shared/dist/email'

export const emailsPerHour = 50

export function prepareEmailObj(params: EmailData) {
  const { userName, userEmail, subject, html } = params

  const emailObj: Email = {
    html,
    subject,
    from: {
      name: getBrandName(),
      email: getEmailFrom(),
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
