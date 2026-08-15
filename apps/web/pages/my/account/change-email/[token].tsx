import { dbConnect, UserModel } from '@recycl/shared/dist/server/db'
import LayoutWithoutHeader from '../../../../components/layouts/LayoutWithoutHeader'
import { Box, Alert, Button } from '@mui/material'
import router from 'next/router'

type ChangeEmailProps = {
  urlIsValid: boolean
}

const brand = process.env.NEXT_PUBLIC_BRAND || ''
const title = `Смена email | ${brand}`

const buttonText = 'На главную'

export default function ChangeEmail(props: ChangeEmailProps) {
  const { urlIsValid } = props

  return (
    <LayoutWithoutHeader title={title}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '&>*': {
              mb: 3,
            },
          }}
        >
          <Box>
            <Alert
              variant="filled"
              severity={urlIsValid ? 'success' : 'error'}
              sx={{ color: '#fff' }}
            >
              {urlIsValid
                ? 'Адрес электронной почты успешно изменен'
                : 'Срок действия ссылки истек'}
            </Alert>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={() => router.push('/')}
              sx={{ color: '#fff' }}
              variant={'outlined'}
            >
              {buttonText}
            </Button>
          </Box>
        </Box>
      </Box>
    </LayoutWithoutHeader>
  )
}

export async function getServerSideProps(context) {
  await dbConnect()
  const user = await UserModel.findOne({
    resetEmailToken: context.query.token,
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  const { resetEmailExpires, newEmail } = user
  const urlIsValid =
    resetEmailExpires && new Date(resetEmailExpires) >= new Date()

  user.resetEmailToken = undefined
  user.resetEmailExpires = undefined
  user.newEmail = undefined
  if (newEmail && urlIsValid) {
    user.email = newEmail
  }

  await user.save()

  return {
    props: {
      urlIsValid: true,
    },
  }
}
