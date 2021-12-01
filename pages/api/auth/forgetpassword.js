import { emailSchema } from '../../../lib/validation'
import mail from '@sendgrid/mail'
mail.setApiKey(process.env.SENDGRID_API_KEY)
import dbConnect from '../../../lib/db/connection'
import { User } from '../../../lib/db/models'
import mapErrors from '../../../lib/mapErrors'

export default async function forgetPasswordHandler(req, res) {
  //check if request data is correct before processing further
  let body
  try {
    body = JSON.parse(req.body)
    await emailSchema.validate(body, { abortEarly: false })
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
    const email = body.email
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
  const link = `${process.env.NEXT_PUBLIC_URL}resetpassword/${user.resetPasswordToken}`
  const message = `Здравствуйте.\r\n
      Вы получили это письмо потому что запросили операцию сброса пароля на сайте ${process.env.NEXT_PUBLIC_URL}\r\n
                  Для сброса пароля перейдите по ссылке ${link} (ссылка действительна на протяжении часа). \r\n
                  Если вы не запрашивали это действие, просто проигнорируйте это письмо.\r\n`

  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_FROM,
    subject: `Запрос на сброс пароля на сайте ${process.env.NEXT_PUBLIC_URL}`,
    text: message,
    html: message.replace(/\r\n/g, '<br>'),
  }

  try {
    await mail.send(mailOptions)
    return res.status(200).json({
      message: `Сообщение для сброса пароля отправлено на ${user.email}`,
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
