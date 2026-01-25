import { Typography, Box, Button } from '@mui/material'
import { ReactElement, useCallback, useState } from 'react'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import CustomSnackbar from '../uiParts/Snackbars'
import SuccessfullUnsubscribe from './SuccsesfulUnsubscribe'
import { unsubscribeApiResponseStatuses } from '../../lib/subscriptions/unsubscribeApiResponseCodes'
import type { UnsubscribeApiResponse } from '../../lib/subscriptions/types'

const unsubscribeAPI = '/api/subscriptions/unsubscribe'
const { SUCCESS, ERROR } = unsubscribeApiResponseStatuses

const errorMessge = 'Ошибка при получении данных'
const headingText = 'Для отписки от рассылки нажмите кнопку'
const buttonText = 'Отписаться'

const TokenExpiredOrUsedUnsubscribe = ({
  handleTokenExpired,
}: {
  handleTokenExpired: () => Promise<void>
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 4 }} align="center">
        {headingText}
      </Typography>

      <Box>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={loading}
          onClick={async () => {
            setLoading(true)
            await handleTokenExpired()
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

  const handleTokenExpired = useCallback(async () => {
    //ToDo: maybe use try catch
    const response = await fetch(unsubscribeAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    if (!response.ok) {
      setError(errorMessge)
      return
    }
    const data: UnsubscribeApiResponse = await response.json()

    if (data.status === ERROR) {
      setError(errorMessge)
    } else if (data.status === SUCCESS) {
      setData(data)
    }
  }, [token])

  switch (data?.status) {
    case SUCCESS:
      content = <SuccessfullUnsubscribe />
      return

    default:
      content = (
        <TokenExpiredOrUsedUnsubscribe
          handleTokenExpired={handleTokenExpired}
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
