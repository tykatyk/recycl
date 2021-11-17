import dbConnect from '../../../../lib/db/connection'
import { User } from '../../../../lib/db/models'

export default async function resetPasswordHandler(req, res) {
  // dbConnect()<-this doesn't work
  console.log('query is')
  console.log(req.query)

  let user
  try {
    user = await User.findOne({
      resetPasswordToken: req.query.token,
      resetPasswordExpires: { $gt: Date.now() },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: {
        type: 'perForm',
        message: 'Возникла ошибка при получении данных пользователя',
      },
    })
  }
  console.log('user')
  console.log(user)
  if (!user) {
    res.status(401).json({
      error: {
        type: 'perForm',
        message: 'Токен недействительный или его срок действия истек',
      },
    })
  } else {
    //Redirect user to form with the email address
    return {
      redirect: {
        permanent: false,
        destination: '/resetpassword',
      },
    }
  }
}
