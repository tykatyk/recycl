import path from 'path'
import sendpulse from 'sendpulse-api'
import EmailSendingMetrics from './emailSendingMetrics'
import { Email } from '../../types/email'

/*
 * https://login.sendpulse.com/settings/#api
 */
const tokenStorage = path.join(__dirname, '../../../sendpulseTokenStorage')

const callback = (data: any, metrics: EmailSendingMetrics) => {
  if (!data.is_error) return

  metrics.totalErrors++

  const { error_code, message } = data

  const parts: string[] = []

  if (error_code) {
    parts.push(`ErrorCode: ${error_code}`)
  }

  if (message) {
    parts.push(`Message: ${message}`)
  }

  const errorMessage =
    parts.length > 0
      ? parts.join(', ')
      : 'Message: unknown error while sending an email'

  metrics.errorMessages.push(errorMessage)
}

export const emailSenderSendpulse = (
  email: Email,
  metrics: EmailSendingMetrics,
) => {
  sendpulse.init(
    process.env.SENDPULSE_ID,
    process.env.SENDPULSE_SECRET,
    tokenStorage,
    function (token: any) {
      if (!token) {
        console.log('No sendpulse email token')
        return
      }
      if (token && token.is_error) {
        console.log('Sendpulse email token error')
        return
      }
    },
  )

  sendpulse.smtpSendMail((data: any) => {
    callback(data, metrics)
  }, email)
}
