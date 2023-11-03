import { useEffect } from 'react'
import { Paper, Grid, Typography, Button, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Layout from '../layouts/Layout'
import SendMessage from '../uiParts/SendMessage'
import NoRows from '../uiParts/NoRows'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import type { Event as RecycleEvent } from '../../lib/types/event'
import { useSession } from 'next-auth/react'

interface PopulatedProp {
  name: string
  _id: string
}

export default function ShowSingleEvent(props: { event: RecycleEvent | null }) {
  const { event } = props
  const content = event ? <ShowData applicationData={event} /> : <NoRows />
  const { data: session } = useSession()

  //update the counter of number of times the ad was viewed
  useEffect(() => {
    //if the user is viewing his own ad, don't increment the counter
    if (!event || (event.user as PopulatedProp)._id === session?.id) return

    fetch('/api/num-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adType: 'event',
        adId: event._id,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          console.log('Не могу обновить число просмотров обьявления')
        }
      })
      .catch((error) => {
        console.log(
          'Неизвестная ошибка при обновлении числа просмотров обьявления',
        )
      })
  }, [])

  return (
    <Layout title="Предложение о вывозе отходов | Recycl">{content}</Layout>
  )
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
}))

function ShowData(props: { applicationData: RecycleEvent }) {
  const { applicationData } = props
  const user = applicationData.user as PopulatedProp
  const waste = applicationData.waste as PopulatedProp

  return (
    <Grid container spacing={2} direction="column" item xs>
      <Grid container item spacing={2} direction="column" xs sx={{ mb: 4 }}>
        <Grid item xs sx={{ mb: 4 }}>
          <Typography component="h1" variant="h3" gutterBottom>
            Предложение о вывозе отходов
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              href={`/users/${user._id}`}
              sx={{ textTransform: 'none' }}
              startIcon={<AccountCircleIcon />}
              color="secondary"
            >
              {user.name}
            </Button>
          </Box>
        </Grid>
        <Grid item xs>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Населенный пункт
            </Typography>
            <Typography>{applicationData.location?.description}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Тип отходов
            </Typography>
            <Typography>{waste.name}</Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Дата
            </Typography>
            <Typography>
              {dayjs(applicationData.date)
                .locale('ru')
                .format('D MMMM YYYY г.')}
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Время начала
            </Typography>
            <Typography>
              {dayjs(applicationData.date).locale('ru').format('HH:mm')}
            </Typography>
          </StyledPaper>
        </Grid>
        <Grid item xs>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Контактный телефон
            </Typography>
            <Typography>{applicationData.phone}</Typography>
          </StyledPaper>
        </Grid>
        {applicationData.comment && (
          <Grid item xs>
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Примечание автора
              </Typography>
              <Typography>{applicationData.comment}</Typography>
            </StyledPaper>
          </Grid>
        )}
      </Grid>
      <Grid container item direction="column" xs>
        <Grid item xs>
          <StyledPaper sx={{ bgcolor: 'primary.dark' }}>
            <SendMessage
              receiver={{
                _id: user._id,
                name: user.name,
              }}
            />
          </StyledPaper>
        </Grid>
      </Grid>
    </Grid>
  )
}
