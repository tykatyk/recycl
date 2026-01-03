import sendpulse from 'sendpulse-api'
import EmailSendingMetrics from './emailSendingMetrics'

/*
 * https://login.sendpulse.com/settings/#api
 */
const API_USER_ID = '22d2e61be64bf734875895be82bf4de7'
const API_SECRET = '87ceb5f698bdc1a85e93ac4a92a3358c'
const TOKEN_STORAGE = './sendpulseTokenStorage'

const callback = (data: any, metrics: EmailSendingMetrics) => {
  let errorMessage = ''
  // ToDo: refactor errorMessage

  if (data.is_error) metrics.totalErrors++
  if (data.error_code) {
    errorMessage = `${errorMessage}ErrorCode: ${data.error_code}`
  }
  if (data.message) {
    errorMessage = `;${errorMessage}Message: ${data.message}`
  }
}

//ToDo: maybe chang the type of email
export const emailSenderSendpulse = async (email: any, metrics: any) => {
  sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, function (token: any) {
    if (!token) {
      console.log('no sendpulse email token')
      return
    }
    if (token && token.is_error) {
      console.log('sendpulse email token error')
      return
    }
  })

  sendpulse.smtpSendMail((data) => {
    callback(data, metrics)
  }, email)
}
