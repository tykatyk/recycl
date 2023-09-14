import mail from '@sendgrid/mail'
import { perFormErrorResponse } from './responses'

mail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function sendEmail(res, options) {
  if (!res) throw new Error('res argument is undefined')
  if (typeof res != 'object') throw new Error('res argument is not an object')

  const {
    to,
    subject = '',
    message = '',
    name = 'Recycl',
    templateId = '',
    dynamicTemplateData = null,
  } = options

  if (!to)
    throw new Error('options.to is undefined. Pleas provide an addressee')

  const { frontendMessage = `Вам отправлено сообщение на ${to}` } = options

  let mailOptions = {
    to,
    from: {
      email: process.env.EMAIL_FROM,
      name,
    },
    subject,
  }
  if (templateId && dynamicTemplateData) {
    mailOptions.templateId = templateId
    mailOptions.dynamicTemplateData = dynamicTemplateData
  } else if (message) {
    mailOptions.text = message
    mailOptions.html = message.replace(/\r\n/g, '<br>')
  } else {
    throw new Error('Please provide either template data or message')
  }

  try {
    await mail.send(mailOptions)
    return res.status(200).json({
      message: frontendMessage,
    })
  } catch (error) {
    console.log(error)
    perFormErrorResponse('Возникла ошибка при отправке сообщения')
  }
}
