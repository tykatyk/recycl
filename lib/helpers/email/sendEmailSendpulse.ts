import sendpulse from 'sendpulse-api'
import EmailSendingMetrics from './emailSendingMetrix'
import { Email } from '../../types/email'

/*
 * https://login.sendpulse.com/settings/#api
 */
const API_USER_ID = '22d2e61be64bf734875895be82bf4de7'
const API_SECRET = '87ceb5f698bdc1a85e93ac4a92a3358c'
const TOKEN_STORAGE = './sendpulseTokenStorage'

const callback = (data: any, metrics: EmailSendingMetrics) => {
  //ToDo: check corectness of this function
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
      ? parts.join(', ') + '\n'
      : 'Message: unknown error while sending an email'

  console.log(errorMessage)
}

//ToDo: maybe change the type of email
export const emailSenderSendpulse = (
  email: Email,
  metrics: EmailSendingMetrics,
) => {
  sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, function (token: any) {
    if (!token) {
      console.log('No sendpulse email token')
      return
    }
    if (token && token.is_error) {
      console.log('Sendpulse email token error')
      return
    }
  })

  sendpulse.smtpSendMail((data: any) => {
    callback(data, metrics)
  }, email)
}
