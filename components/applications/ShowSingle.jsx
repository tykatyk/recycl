import React from 'react'
import { styled } from '@mui/material/styles'
import { Paper, Grid, Typography } from '@mui/material'
import Layout from '../layouts/Layout'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import SendMessage from '../uiParts/SendMessage'
import { useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATION } from '../../lib/graphql/queries/removalApplication'

const PREFIX = 'ShowSingle'

const classes = {
  paper: `${PREFIX}-paper`,
}

const StyledGrid = styled(Grid)(({ theme }) => ({
  [`& .${classes.paper}`]: {
    padding: theme.spacing(2),
  },
}))

export default function ShowSingle(props) {
  const { id } = props
  const { loading, data, error } = useQuery(GET_REMOVAL_APPLICATION, {
    variables: { id },
  })
  let content = null

  if (loading) return <PageLoadingCircle />

  if (error) {
    content = <ErrorMessage />
  } else {
    //data is already available here
    content = <ShowData applicationData={data.getRemovalApplication} />
  }

  return (
    <Layout title="Заявка на вывоз | Recycl">
      <StyledGrid
        container
        direction="column"
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        {content}
      </StyledGrid>
    </Layout>
  )
}

function ShowData(props) {
  const { applicationData } = props

  return (
    <Grid container spacing={2} direction="column" item xs>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Местоположение отходов
          </Typography>
          <Typography>{applicationData.wasteLocation.description}</Typography>
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Тип отходов
          </Typography>
          <Typography>{applicationData.wasteType.name}</Typography>
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Количество, кг.
          </Typography>
          <Typography>{applicationData.quantity}</Typography>
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Документ о передаче отходов на переработку
          </Typography>
          {applicationData.passDocument ? (
            <Typography>Нужен</Typography>
          ) : (
            <Typography>Не нужен</Typography>
          )}
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="h6" gutterBottom>
            Контактный телефон
          </Typography>
          <Typography>{applicationData.contactPhone}</Typography>
        </Paper>
      </Grid>
      {applicationData.wasteLocation.comment && (
        <Grid item xs>
          <Paper className={classes.paper}>
            <Typography variant="h6" gutterBottom>
              Примечание
            </Typography>
            <Typography>{applicationData.comment}</Typography>
          </Paper>
        </Grid>
      )}
      <Grid item xs>
        <Paper className={classes.paper}>
          <SendMessage
            receiver={{
              _id: applicationData.user['_id'],
              name: applicationData.user.name,
            }}
          />
        </Paper>
      </Grid>
    </Grid>
  )
}

function ErrorMessage(props) {
  return (
    <Grid item xs>
      <Typography align="center" color="error">
        Ошибка при загрузке данных
      </Typography>
    </Grid>
  )
}
