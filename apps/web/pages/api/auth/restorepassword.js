import { passwordSchema } from '../../../lib/validation'
import mail from '@sendgrid/mail'
mail.setApiKey(process.env.SENDGRID_API_KEY)
import dbConnect from '../../../lib/db/connection'
import { User } from '../../../lib/db/models'
import { hash } from 'bcrypt'
import { errorResponse } from '../../../lib/helpers/responses'

export default async function restorePasswordHandler(req, res) {
  //check if request data is correct before processing further
  const { password, token } = req.body
  try {
    await passwordSchema.validate(password, { abortEarly: false })
  } catch (error) {
    console.log(error)
    return errorResponse(error, res)
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
    user.password = await hash(
      password,
      parseInt(process.env.HASHING_ROUNDS, 10)
    )
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
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
