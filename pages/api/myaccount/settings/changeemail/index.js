import { loginSchema as changeEmailSchema } from '../../../../../lib/validation'
import mail from '@sendgrid/mail'
mail.setApiKey(process.env.SENDGRID_API_KEY)
import dbConnect from '../../../../../lib/db/connection'
import { User } from '../../../../../lib/db/models'
import mapErrors from '../../../../../lib/mapErrors'
import sendEmail from '../../../../../lib/sendEmail'
import { getSession } from 'next-auth/react'
import { compare } from 'bcrypt'

const userNotFound = function (res) {
  return res.status(401).json({
    error: {
      type: 'perForm',
      message: 'Пользователь не найден',
    },
  })
}

export default async function changeEmailHandler(req, res) {
  if (req.method === 'GET') res.status(405).end()

  const session = await getSession({ req })
  if (!session) res.status(401).end()

  //check if request data is correct before processing further
  try {
    await changeEmailSchema.validate(req.body, { abortEarly: false })
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
  let result = null
  const newEmail = req.body.email
  const password = req.body.password
  try {
    await dbConnect()
    result = await Promise.all([
      User.findById(session.id),
      User.find({ email: newEmail, _id: { $ne: session.id } }),
    ]).then((result) => {
      return result
    })
    const [user, otherUsers] = result

    if (!user) return userNotFound(res)

    if (otherUsers && otherUsers.length > 0) {
      return res.status(422).json({
        error: {
          type: 'perField',
          message: {
            email: 'Этот адрес уже используется',
          },
        },
      })
    }

    const passwordCorrect = await compare(password, user.password)
    if (!passwordCorrect) return userNotFound(res)

    if (user.email === newEmail) {
      return res.status(422).json({
        error: {
          type: 'perField',
          message: {
            email: 'Этот адрес уже установлен в качестве текущего',
          },
        },
      })
    }

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
  const to = req.body.email
  const subject = `Запрос на смену email на сайте ${process.env.NEXT_PUBLIC_URL}`

  const link = `${process.env.NEXT_PUBLIC_URL}myaccount/settings/changeemail/${user.resetEmailToken}`
  const message = `Здравствуйте.\r\n
  Вы получили это письмо потому что запросили операцию смены адреса электронной почты на сайте ${process.env.NEXT_PUBLIC_URL}\r\n
              Для подтверждения перейдите по ссылке ${link}\r\n
              Cсылка действительна на протяжении часа.\r\n
              Если вы не запрашивали это действие, просто проигнорируйте это письмо.\r\n`
  const frontendMessage = `Для смены email перейдите по ссылке из письма, которое отпавлено на ${to}`

  return await sendEmail(res, {
    to,
    subject,
    message,
    frontendMessage,
  })
}
