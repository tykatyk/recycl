import sendpulse from 'sendpulse-api'
/*
 * https://login.sendpulse.com/settings/#api
 */
const API_USER_ID = '22d2e61be64bf734875895be82bf4de7'
const API_SECRET = '87ceb5f698bdc1a85e93ac4a92a3358c'
const TOKEN_STORAGE = '/public/data/'
const URL_ENDPOINT = 'https://api.sendpulse.com/smtp/emails'

export const emailSenderSendpulse = async (email) => {
  sendpulse.init(API_USER_ID, API_SECRET, TOKEN_STORAGE, function (token) {
    if (!token) {
      console.log('no email token')
      return
    }
    if (token && token.is_error) {
      console.log('email token error')
      return
    }
  })

  sendpulse.smtpSendMail((data) => console.log(data), email)
}
