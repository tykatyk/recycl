import { Typography, Box, Button } from '@mui/material'
import { ReactElement, useCallback, useState } from 'react'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import CustomSnackbar from '../uiParts/Snackbars'
import SuccessfullUnsubscribe from './SuccsesfulUnsubscribe'
import { unsubscribeApiResponseCodes } from '../../lib/subscriptions/unsubscribeApiResponseCodes'
import type { UnsubscribeApiResponse } from '../../lib/subscriptions/types'

const unsubscribeAPI = '/api/subscriptions/unsubscribe'

const errorMessge = 'Ошибка при получении данных'
const headingText = 'Cрок действия ссылки истек'
const mainText = 'Для отписки от рассылки нажмите кнопку'
const buttonText = 'Отписаться'
const { SUCCESS, NOT_FOUND } = unsubscribeApiResponseCodes

const UnsubscribeExpiredOrUsedToken = ({
  handleTokenExpiredOrUsed,
}: {
  handleTokenExpiredOrUsed: () => Promise<void>
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }} align="center">
        {headingText}
      </Typography>
      <Typography sx={{ mb: 4 }}>{mainText}</Typography>

      <Box>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            await handleTokenExpiredOrUsed()
            setLoading(false)
          }}
        >
          {buttonText}
          {loading && <ButtonSubmittingCircle />}
        </Button>
      </Box>
    </>
  )
}

export default function TokenExpiredOrUsed({ token }: { token: string }) {
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<UnsubscribeApiResponse | null>(null)
  let content: ReactElement | null = null

  const handleTokenExpiredOrUsed = useCallback(async () => {
    //ToDo: maybe use try catch
    const response = await fetch(unsubscribeAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scope: 'token', data: token }),
    })
    if (!response.ok) {
      if (response.status == 404) {
        setError('Подписка не найдена')
      } else {
        setError(errorMessge)
      }

      return
    }
    const data: UnsubscribeApiResponse = await response.json()

    setData(data)
  }, [token])

  switch (data?.status) {
    case SUCCESS:
      content = <SuccessfullUnsubscribe />
      break

    default:
      content = (
        <UnsubscribeExpiredOrUsedToken
          handleTokenExpiredOrUsed={handleTokenExpiredOrUsed}
        />
      )
  }

  return (
    <>
      {content}
      <CustomSnackbar
        severity={'error'}
        open={!!error}
        message={error}
        handleClose={() => {
          setError('')
        }}
      />
    </>
  )
}
