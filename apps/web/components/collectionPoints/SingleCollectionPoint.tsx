import { Grid, Typography, Box, Button } from '@mui/material'
// import SendMessage from '../uiParts/SendMessage'
import Chip from '@mui/material/Chip'
import Link from '../uiParts/Link'
const background = '#264352'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import { useCallback, useState } from 'react'
import { useSnackbar } from 'notistack'
import LocationPinIcon from '@mui/icons-material/LocationPin'
import { collectionPointTypes } from '@recycl/shared/dist/constants'
import ComplaintDialog from '../uiParts/ComplaintDialog'
import dayjs from 'dayjs'

const defaultPhone = '(xxx)-xxx-xx-xx'
const phoneLoadingErrorMessage = 'Что то пошло не так'

export default function SingleCollectionPoint(props) {
  const { data } = props
  const [showPhone, setShowPhone] = useState(false)
  const [phone, setPhone] = useState(defaultPhone)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false)

  const buttonHandler = useCallback(async () => {
    if (phone !== defaultPhone) return
    if (!data) return

    const adId = data._id

    try {
      setLoading(true)
      const result = await fetch('/api/collection-points/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId }),
      })
      const data = await result.json()

      setPhone(data)
      setShowPhone(true)
    } catch (error) {
      enqueueSnackbar(phoneLoadingErrorMessage, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [phone, data])

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 1 }}>
          <Typography component="h1" variant="h4">
            Пункт приема вторсырья
          </Typography>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'grey.400',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <LocationPinIcon />
            {`Местоположение: ${data.location.description}`}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          '&>*': {
            mb: 4,
          },
          '& :last-child': {
            mb: 0,
          },
        }}
      >
        <Box>
          <Grid container spacing={2}>
            <Chip
              label={`Тип пункта приема: ${collectionPointTypes[data.variant].toLowerCase()}`}
              size="small"
            />
            <Chip label={`Добавил: ${data.user.name}`} size="small" />
          </Grid>
        </Box>

        {data.variant === 'mobile' && (
          <Box sx={{ p: 2, background: `${background}`, borderRadius: 2 }}>
            <Typography
              component={'h2'}
              variant="h5"
              gutterBottom
            >{`Дата и время начала`}</Typography>
            <Typography>
              {dayjs(data.date).format('DD.MM.YYYY HH:MM')}
            </Typography>
          </Box>
        )}

        <Box sx={{ p: 2, background: `${background}`, borderRadius: 2 }}>
          <Typography
            component={'h2'}
            variant="h5"
            gutterBottom
          >{`Виды вторсырья, которые принимаются`}</Typography>

          <Grid container spacing={2}>
            {data.wasteTypes.map((item, idx) => {
              return <Chip key={idx} label={item} size="small" />
            })}
          </Grid>
        </Box>
        <Box sx={{ p: 2, background: `${background}`, borderRadius: 2 }}>
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

        {data.comment && (
          <Box>
            <Typography component={'h2'} variant="h5" gutterBottom>
              Опиcание
            </Typography>
            <Typography>{data.comment}</Typography>
          </Box>
        )}

        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="text"
              color="error"
              size="small"
              onClick={() => {
                setComplaintDialogOpen(true)
              }}
              startIcon={<GppMaybeIcon />}
            >
              Пожаловаться
            </Button>
          </Box>
          <ComplaintDialog
            open={complaintDialogOpen}
            setOpen={setComplaintDialogOpen}
            contentType="collectionPoint"
          />
        </Box>
      </Box>
    </Box>
  )
}
