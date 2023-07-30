import { emailSchema } from '../../../lib/validation'
import dbConnect from '../../../lib/db/connection.mjs'
import { User } from '../../../lib/db/models.mjs'
import sendEmail from '../../../lib/helpers/sendEmail'
import { checkCaptcha } from '../../../lib/helpers/checkCaptcha'
import {
  errorResponse,
  captchaNotPassedResponse,
} from '../../../lib/helpers/responses'

export default async function forgetPasswordHandler(req, res) {
  //check if request data is correct before processing further
  const { email, recaptcha } = req.body

  const captchaPassed = await checkCaptcha(recaptcha)
  if (!captchaPassed) return captchaNotPassedResponse(res)

  try {
    await emailSchema.validate({ email }, { abortEarly: false })
  } catch (error) {
    console.log(error)
    return errorResponse(error, res)
  }

  //check if a user exists
  let user
  try {
    await dbConnect()
    user = await User.findOne({ email })

    if (user) {
      //Generate and set password reset token
      user.generatePasswordReset()
    } else {
      //if user doesn't exist return error
      return res.status(401).json({
        error: {
          type: 'perField',
          message: {
            email: 'Пользователь с таким адресом электронной почты не найден',
          },
        },
      })
    }
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Возникла ошибка при проверке существования пользователя',
      },
    })
  }

  //saving updated user to the database
  try {
    await user.save()
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Ошибка при сохранении данных пользователя',
      },
    })
  }

  // send email
  const to = user.email
  const actionUrl = `${process.env.NEXT_PUBLIC_URL}auth/resetpassword/${user.resetPasswordToken}`
  const dynamicTemplateData = {
    name: user.name,
    hostUrl: process.env.NEXT_PUBLIC_URL,
    actionUrl,
    date: new Date().getFullYear(),
  }
  const frontendMessage = `Для сброса пароля перейдите по ссылке из письма, которое отпавлено на ${to}`

  return await sendEmail(res, {
    to,
    templateId: 'd-6c14e6364c4e4ff3b7d50d9a449df529',
    dynamicTemplateData,
    frontendMessage,
  })
}
