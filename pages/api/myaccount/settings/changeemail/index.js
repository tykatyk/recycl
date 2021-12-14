import { emailSchema } from '../../../../../lib/validation'
import mail from '@sendgrid/mail'
mail.setApiKey(process.env.SENDGRID_API_KEY)
import dbConnect from '../../../../../lib/db/connection'
import { User } from '../../../../../lib/db/models'
import mapErrors from '../../../../../lib/mapErrors'
import { getSession } from 'next-auth/react'

export default async function changeEmailHandler(req, res) {
  if (req.method === 'GET') res.status(405).end()

  const session = await getSession({ req })
  if (!session) res.status(401).end()

  //check if request data is correct before processing further
  try {
    await emailSchema.validate(req.body, { abortEarly: false })
  } catch (error) {
    const mappedErrors = mapErrors(error)
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
    user = await User.findById(session.id)

    if (user) {
      //Generate and set email reset token
      user.generateEmailReset()
    } else {
      //if user doesn't exist return error
      return res.status(401).end()
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
  const link = `${process.env.NEXT_PUBLIC_URL}myaccount/settings/changeemail/${user.resetEmailToken}`
  const message = `Здравствуйте.\r\n
  Вы получили это письмо потому что запросили операцию смены адреса электронной почты на сайте ${process.env.NEXT_PUBLIC_URL}\r\n
              Для подтверждения перейдите по ссылке ${link}\r\n
              Cсылка действительна на протяжении часа.\r\n
              Если вы не запрашивали это действие, просто проигнорируйте это письмо.\r\n`

  const { email } = req.body

  const mailOptions = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `Запрос на смену email на сайте ${process.env.NEXT_PUBLIC_URL}`,
    text: message,
    html: message.replace(/\r\n/g, '<br>'),
  }

  try {
    await mail.send(mailOptions)
    return res.status(200).json({
      message: `Письмо с подтверждением отправлено на ${user.email}`,
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
