import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'
import { apiHandler } from '../../../../lib/helpers/errorHelpers'
import { getEmailText, sendEmail } from '../../../../lib/helpers/email/mailer'
import { email as emailValidator } from '@recycl/shared/dist/validation'
import { CHANGE_EMAIL_EXPIRATION_PERIOD } from '@recycl/shared/dist/constants'
import { getFullHtml } from '@recycl/shared/dist/email'

async function emailHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') res.status(405).end()

  const session = await getServerSession(req, res, authOptions)
  if (!session) return res.status(401).end()

  const userId = session.id
  const { email } = req.body
  const newEmail = await emailValidator.validate(email, {
    abortEarly: false,
  })

  await dbConnect()
  const result = await Promise.all([
    UserModel.findById(userId),
    UserModel.find({ email: newEmail }),
  ])

  const [user, otherUsers] = result

  if (!user) return res.status(404).end()

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
  //Generate and set email reset token
  user.generateEmailReset()
  user.newEmail = newEmail
  await user.save()

  // send email
  const actionUrl = `${process.env.NEXT_PUBLIC_URL}/my/account/change-email/${user.resetEmailToken}`

  // const frontendMessage = `Для смены email перейдите по ссылке из письма, которое отпавлено на ${validated}`
  const title = `Смена адреса электронной почты на сайте ${process.env.BRAND}`

  const emailText = {
    title,
    p1: `Для смены адреса электронной почты перейдите по ссылке ${actionUrl}`,
    p2: `Ссылка действительна на протяжении ${CHANGE_EMAIL_EXPIRATION_PERIOD} минут.`,
    p3: 'Если вы не совершали это действие, просто проигнорируйте данное письмо.',
  }

  const content = `
    <tr>
      <td style="padding:0 0 4px 8px">
        Для смены адреса электронной почты перейдите по <a href="${actionUrl}" style="color: #adce5d";>ссылке</a>
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 4px 8px">
        ${emailText.p2}
      </td>
    </tr>
    <tr>
      <td style="padding:0 0 4px 8px">
        ${emailText.p3}
      </td>
    </tr>
  `

  const emailParams = {
    to: newEmail,
    subject: title,
    messageType: 'proposeWasteType' as const,
    html: getFullHtml({ content, title }),
    text: getEmailText(emailText),
  }

  sendEmail(emailParams)

  res.status(200).end()
}

export default apiHandler(emailHandler)
