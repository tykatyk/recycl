import type { Email, EmailData } from './types'

export const emailsPerHour = 50
const emailsPerMonth = 12000

const getBrandName = () => {
  if (!process.env.BRAND) {
    throw new Error('process.env.BRAND is not defined')
  }
  return process.env.BRAND
}

const getEmailFrom = () => {
  if (!process.env.EMAIL_FROM) {
    throw new Error('process.env.EMAIL_FROM is not defined')
  }
  return process.env.EMAIL_FROM
}

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
