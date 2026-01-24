import { Typography, Box, Grid, Button } from '@mui/material'
import { ReactElement, useState } from 'react'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import CustomSnackbar from '../uiParts/Snackbars'
import SuccessfullUnsubscribe from './SuccsesfulUnsubscribe'

const unsubscribeAPI = '/api/subscriptions/unsubscribe'
const errorMessge = 'Ошибка при получении данных'

export default function TokenNotFound({ token }: { token: string }) {
  const [error, setError] = useState<string>('')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  let content: ReactElement | null = null

  const handleTokenExpired = async (token: string) => {
    const response = await fetch(unsubscribeAPI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    if (!response.ok) {
      //ToDo: handle error
      setError(errorMessge)
    }
    const data = await response.json()
    //ToDo: handle success
    if (data.error) {
      setError(errorMessge)
    } else if (data.message === 'ok') {
      setData(data)
    }
  }

  switch (data?.message) {
    case 'ok':
      content = <SuccessfullUnsubscribe />
      return

    default:
      content = (
        <>
          <Typography variant="h4" component="h1" sx={{ mb: 4 }} align="center">
            Для отписки от рассылки нажмите кнопку ниже
          </Typography>

          <Box>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={loading}
              onClick={async () => {
                setLoading(true)
                await handleTokenExpired(token)
                setLoading(false)
              }}
            >
              Отписаться
              {loading && <ButtonSubmittingCircle />}
            </Button>
          </Box>
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
  return content
}
