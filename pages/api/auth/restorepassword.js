import { passwordSchema } from '../../../lib/validation'
import * as yup from 'yup'
import mail from '@sendgrid/mail'
mail.setApiKey(process.env.SENDGRID_API_KEY)
import dbConnect from '../../../lib/db/connection'
import { User } from '../../../lib/db/models'
import mapErrors from '../../../lib/mapErrors'
import { hash } from 'bcrypt'

export default async function restorePasswordHandler(req, res) {
  //check if request data is correct before processing further
  const { password, token } = req.body
  try {
    await yup
      .reach(passwordSchema, 'password')
      .validate(password, { abortEarly: false })
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

  try {
    await dbConnect()
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Возникла ошибка при подключении к базе данных',
      },
    })
  }

  let user
  try {
    user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user)
      return res.status(401).json({
        error: { type: 'perForm', message: 'Срок действия ссылки истек' },
      })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: { type: 'perForm', message: 'Ошибка при поиске пользователя' },
    })
  }

  try {
    //Set the new password
    user.password = await hash(password, 12)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    // Save
    await user.save()
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Возникла ошибка при сохранении данных пользователя',
      },
    })
  }

  try {
    // send email
    const message = `Здравствуйте,\r\n
 Ваш пароль на сайте ${process.env.NEXT_PUBLIC_URL} успешно изменен.\r\n`

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: 'Ваш пароль изменен',
      text: message,
      html: message.replace(/\r\n/g, '<br>'),
    }

    await mail.send(mailOptions)
    res.status(200).json({ message: 'Пароль успешно изменен' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}
