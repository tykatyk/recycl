import { Grid, Typography, Box, Button } from '@mui/material'
import Layout from '../layouts/Layout'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
// import SendMessage from '../uiParts/SendMessage'
import { useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATION } from '../../lib/graphql/queries/removalApplication'
import Chip from '@mui/material/Chip'
import Link from '../uiParts/Link'
const background = '#264352'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import { ReactElement, useCallback, useState } from 'react'
import { useSnackbar } from 'notistack'

const defaultPhone = '(xxx)-xxx-xx-xx'
const phoneLoadingErrorMessage = 'Что то пошло не так'

export default function ShowSingle(props) {
  const { id } = props
  const { loading, data, error } = useQuery(GET_REMOVAL_APPLICATION, {
    variables: { id },
  })
  let content: ReactElement | null = null

  if (loading) return <PageLoadingCircle />

  if (error) {
    content = <ErrorMessage />
  } else {
    //data is already available here
    content = <ShowData applicationData={data.getRemovalApplication} />
  }

  return <Layout title="Заявка на вывоз отходов | Recycl">{content}</Layout>
}

function ShowData(props) {
  const { applicationData } = props
  const [showPhone, setShowPhone] = useState(false)
  const [phone, setPhone] = useState(defaultPhone)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const creationDate = new Date(applicationData.createdAt)

  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(creationDate)

  const buttonHandler = useCallback(async () => {
    if (phone !== defaultPhone) return
    if (!applicationData) return

    const adId = applicationData._id

    try {
      setLoading(true)
      const result = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, fields: ['phone'] }),
      })
      const data = await result.json()

      setPhone(data)
      setShowPhone(true)
    } catch (error) {
      enqueueSnackbar(phoneLoadingErrorMessage, { variant: 'error' })
      console.log('error')
    } finally {
      setLoading(false)
    }
  }, [phone, applicationData])

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 1 }}>
          <Typography component="h1" variant="h4">
            {applicationData.title}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            {applicationData.wasteLocation.description}
          </Typography>
        </Box>

        <Box>
          <Grid container spacing={2}>
            <Chip
              label={`Тип вторсырья: ${applicationData.wasteType}`}
              size="small"
            />

            <Chip label={`Объявление создано: ${formattedDate}`} size="small" />
            <Chip label={`Автор: ${applicationData.user.name}`} size="small" />
          </Grid>
        </Box>
      </Box>

      {applicationData.comment && (
        <Box sx={{ mb: 4, p: 2, background: `${background}`, borderRadius: 2 }}>
          <Typography component={'h2'} variant="h5" gutterBottom>
            Опиcание
          </Typography>
          <Typography>{applicationData.comment}</Typography>
        </Box>
      )}
      <Box sx={{ mb: 4, p: 2, background: `${background}`, borderRadius: 2 }}>
        <Typography
          component={'h2'}
          variant="h5"
          gutterBottom
        >{`Вес вторсырья`}</Typography>
        <Typography>{`${applicationData.quantity} кг`}</Typography>
      </Box>
      <Box sx={{ mb: 4, p: 2, background: `${background}`, borderRadius: 2 }}>
        <Typography component={'h2'} variant="h5" gutterBottom>
          Контактный телефон
        </Typography>
        <Box>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Typography sx={{ color: (theme) => theme.palette.text.primary }}>
              {showPhone ? (
                <Link href={`tel:${phone}`} sx={{ color: 'inherit' }}>
                  {phone}
                </Link>
              ) : (
                defaultPhone
              )}
            </Typography>

            {!showPhone && (
              <Button
                size="small"
                onClick={() => buttonHandler()}
                color="secondary"
                loading={loading}
              >
                Показать
              </Button>
            )}
          </Grid>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'secondary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
            align="right"
          >
            <GppMaybeIcon />
            <Link href={'#'} sx={{ color: 'inherit' }}>
              Пожаловаться на объявление
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

function ErrorMessage(props) {
  return (
    <Grid>
      <Typography align="center" color="error">
        Ошибка при загрузке данных
      </Typography>
    </Grid>
  )
}
