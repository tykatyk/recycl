import React from 'react'
import { Paper, Grid, Typography, makeStyles } from '@material-ui/core'
import Layout from '../layouts/Layout.jsx'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser.jsx'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'
import { useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATION } from '../../lib/graphql/queries/removalApplication'

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
    <RedirectUnathenticatedUser>
      <Layout title="Заявка на вывоз | Recycl">
        <Grid
          container
          direction="column"
          style={{
            maxWidth: '750px',
            margin: '0 auto',
            padding: '16px',
          }}
        >
          {content}
        </Grid>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
}))

function ShowData(props) {
  const { applicationData } = props
  const classes = useStyles()
  console.log(applicationData)
  return (
    <Grid container spacing={2} direction="column" item xs>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="body2" gutterBottom>
            Местоположение отходов
          </Typography>
          <Typography>{applicationData.wasteLocation.description}</Typography>
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="body2" gutterBottom>
            Тип отходов
          </Typography>
          <Typography>{applicationData.wasteType.name}</Typography>
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="body2" gutterBottom>
            Количество, кг.
          </Typography>
          <Typography>{applicationData.quantity}</Typography>
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Typography variant="body2" gutterBottom>
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
          <Typography variant="body2" gutterBottom>
            Контактный телефон
          </Typography>
          <Typography>{applicationData.userId.phone}</Typography>
        </Paper>
      </Grid>
      {applicationData.wasteLocation.comment && (
        <Grid item xs>
          <Paper className={classes.paper}>
            <Typography variant="body2" gutterBottom>
              Примечание
            </Typography>
            <Typography>{applicationData.comment}</Typography>
          </Paper>
        </Grid>
      )}
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
