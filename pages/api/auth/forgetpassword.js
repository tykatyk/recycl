import { emailSchema } from '../../../lib/validation'
import dbConnect from '../../../lib/db/connection'
import { User } from '../../../lib/db/models'
import mapErrors from '../../../lib/mapErrors'
import sendEmail from '../../../lib/sendEmail'
import { checkCaptcha } from '../../../lib/checkCaptcha'

export default async function forgetPasswordHandler(req, res) {
  //check if request data is correct before processing further
  const { email, recaptcha } = req.body

  const captchaPassed = await checkCaptcha(recaptcha)

  if (!captchaPassed) {
    res.status(401).json({
      error: {
        type: 'perForm',
        message: 'Пожалуйста, подтвердите что вы не робот',
      },
    })
    return
  }

  try {
    await emailSchema.validate({ email }, { abortEarly: false })
  } catch (error) {
    console.log(error)
    let mappedErrors = mapErrors(error)
    if (mappedErrors) {
      return res.status(422).json({
        error: {
          type: 'perField',
          message: mappedErrors,
        },
      })
    } else {
      return res.status(500).json({
        error: {
          type: 'perForm',
          message: 'Возникла ошибка при проверке данных формы',
        },
      })
    }
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
  const subject = `Запрос на сброс пароля на сайте ${process.env.NEXT_PUBLIC_URL}`

  const link = `${process.env.NEXT_PUBLIC_URL}auth/resetpassword/${user.resetPasswordToken}`
  const message = `Здравствуйте.\r\n
  Вы получили это письмо потому что запросили операцию сброса пароля на сайте ${process.env.NEXT_PUBLIC_URL}\r\n
              Для сброса пароля перейдите по ссылке ${link}\r\n
              Cсылка действительна на протяжении часа.\r\n
              Если вы не запрашивали это действие, просто проигнорируйте это письмо.\r\n`
  const frontendMessage = `Для сброса пароля перейдите по ссылке из письма, которое отпавлено на ${to}`

  return await sendEmail(res, {
    to,
    subject,
    message,
    frontendMessage,
  })
}
