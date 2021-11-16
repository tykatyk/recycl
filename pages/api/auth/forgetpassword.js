import appoloClient from '../../../lib/appoloClient/appoloClient'
import { GET_USER } from '../../../lib/graphql/queries/user'
import { emailSchema } from '../../../lib/validation'
import * as yup from 'yup'
import mail from '@sendgrid/mail'
mail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function forgetPasswordHandler(req, res) {
  //check if request data is correct before processing further
  let body
  try {
    body = JSON.parse(req.body)
    await emailSchema.validate(body)
  } catch (error) {
    console.log('Некорректный адрес электронной почты')
    return res.status(422).json({
      error: {
        type: 'perField',
        message: { email: 'Некорректный адрес электронной почты' },
      },
    })
  }

  let result
  try {
    const email = body.email
    result = await appoloClient.query({
      query: GET_USER,
      variables: { email },
    })
  } catch (error) {
    console.log('Error while checking user existance')
    console.log(error)

    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Возникла ошибка при проверке существования пользователя',
      },
    })
  }

  try {
    if (result.data && result.data.getUser) {
      const user = result.data.getUser
      //Generate and set password reset token
      user.generatePasswordReset()
    } else {
      //if user doesn't exist return error
      return res.status(422).json({
        error: {
          type: 'perForm',
          message: 'Пользователь с такими учетными данными не найден',
        },
      })
    }
  } catch (error) {
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Не могу сгенерировать токен сброса пароля',
      },
    })
  }

  try {
    await user.save()
  } catch (error) {
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Ошибка при сохранении данных пользователя',
      },
    })
  }

  // send email
  const link = `${process.env.NEXT_PUBLIC_URL}api/auth/reset/${user.resetPasswordToken}`
  const message = `Здравствуйте.\n\n
      Вы получили это письмо потому что запросили сброс пароля на сайте ${process.env.NEXT_PUBLIC_URL}
                  Перейдите по ссылке ${link} для сброса пароля. \n\n
                  Если вы не запрашивали это действие, просто проигнорируйте это письмо.\n`

  const mailOptions = {
    to: user.email,
    from: `${process.env.EMAIL_FROM}`,
    subject: `Запрос на сброс пароля на сайте ${process.env.NEXT_PUBLIC_URL}`,
    text: message,
    html: message.replace(/\r\n/g, '<br>'),
  }

  mail.send(mailOptions, (error, result) => {
    if (error)
      return res.status(500).json({
        error: {
          type: 'perForm',
          message: 'Возникла ошибка при отправке сообщения',
        },
      })

    return res.status(200).json({
      message: `Сообщение для сброса пароля отправлено на ${user.email}`,
    })
  })
}
