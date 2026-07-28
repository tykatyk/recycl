type Email = {
  html: string
  subject: string
  from: {
    name: string
    email: string
  }
  to: [
    {
      name: string
      email: string
    },
  ]
  headers?: {
    'List-Unsubscribe': string
    'List-Unsubscribe-Post': string
  }
}

type SendPulseSuccess = {
  id: string
}
type SendPulseError = {
  error_code?: string
  message?: string
}
type SendPulseSMPTResponse = SendPulseSuccess | SendPulseError

type EmailData = {
  userName: string
  userEmail: string
  subject: string
  html: string
}

export type { Email, SendPulseError, SendPulseSMPTResponse, EmailData }
