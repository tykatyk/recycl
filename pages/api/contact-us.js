import { contactUsSchema } from '../../lib/validation'
import { checkCaptcha } from '../../lib/helpers/checkCaptcha'
import sendEmail from '../../lib/helpers/sendEmail'
import {
  errorResponse,
  captchaNotPassedResponse,
} from '../../lib/helpers/responses'

export default async function contactUsHandler(req, res) {
  const { recaptcha, ...messageData } = req.body
  const captchaPassed = await checkCaptcha(recaptcha)
  if (!captchaPassed) return captchaNotPassedResponse(res)

  try {
    await contactUsSchema.validate(messageData, { abortEarly: false })
  } catch (error) {
    console.log(error)
    return errorResponse(error, res)
  }

  const contactUsEmail = 'tykatyk@gmail.com'
  const frontendMessage = 'Сообщение отправлено'
  const message = `Новое сообщение от пользователя ${messageData.username}.\r\n Электронная почта ${messageData.email}. \r\n ${messageData.message}`
  return await sendEmail(res, {
    to: contactUsEmail,
    from: messageData.email,
    name: 'Recycl contact page',
    subject: messageData.subject,
    message,
    frontendMessage,
  })
}
