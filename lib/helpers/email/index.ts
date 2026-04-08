import type { Email, EmailData } from '../../types/email'

const host = process.env.HOST || ''
const brandName = process.env.BRAND || ''
const emailFrom = process.env.EMAIL_FROM || ''

export const canSendEmails = () => {
  if (!host) {
    console.log('host is undefined')
    return false
  }

  if (!brandName) {
    console.log('No brand name')
    return false
  }

  if (!emailFrom) {
    console.log('No email from address')
    return false
  }
  return true
}

export const withExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  {
    maxRetries = 6,
    initialDelay = 5000,
    maxDelay = 60 * 60 * 1000,
    factor = 4,
  } = {},
) => {
  let attempt = 0
  while (attempt <= maxRetries) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }

      const delay = Math.min(initialDelay * Math.pow(factor, attempt), maxDelay)

      await new Promise((r) => setTimeout(r, delay))
      attempt++
    }
  }
  // unreachable, but required for TS
  throw new Error('Unexpected retry failure')
}

export function prepareEmailObj(params: EmailData) {
  const { userName, userEmail, subject, html } = params

  // const receiverName = notification.receiverName ?? notification.receiverEmail

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
