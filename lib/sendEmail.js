import mail from '@sendgrid/mail'

mail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function sendEmail(res, options) {
  if (!res) throw new Error('res argument is undefined')
  if (typeof res != 'object') throw new Error('res argument is not an object')

  const { to, subject = '', message = '' } = options

  if (!to)
    throw new Error('options.to is undefined. Pleas provide an addressee')

  const { frontendMessage = `Вам отправлено сообщение на ${to}` } = options

  const mailOptions = {
    to,
    from: process.env.EMAIL_FROM,
    subject,
    text: message,
    html: message.replace(/\r\n/g, '<br>'),
  }

  try {
    await mail.send(mailOptions)
    return res.status(200).json({
      message: frontendMessage,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Возникла ошибка при отправке сообщения',
      },
    })
  }
}
