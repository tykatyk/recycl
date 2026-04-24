import React from 'react'
import { styled } from '@mui/material/styles'
import { Paper, Grid, Typography } from '@mui/material'
import Layout from '../layouts/Layout'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import SendMessage from '../uiParts/SendMessage'
import { useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATION } from '../../lib/graphql/queries/removalApplication'

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
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

  return <Layout title="Заявка на вывоз отходов | Recycl">{content}</Layout>
}

function ShowData(props) {
  const { applicationData } = props

  return (
    <Grid container spacing={2} direction="column" item xs>
      <Grid item xs sx={{ mb: 4 }}>
        <Typography component="h1" variant="h3" gutterBottom>
          Заявка на вывоз отходов
        </Typography>
      </Grid>
      <Grid item xs>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Местоположение отходов
          </Typography>
          <Typography>{applicationData.wasteLocation.description}</Typography>
        </StyledPaper>
      </Grid>
      <Grid item xs>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Тип отходов
          </Typography>
          <Typography>{applicationData.wasteType.name}</Typography>
        </StyledPaper>
      </Grid>
      <Grid item xs>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Количество, кг.
          </Typography>
          <Typography>{applicationData.quantity}</Typography>
        </StyledPaper>
      </Grid>
      <Grid item xs>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Документ о передаче отходов на переработку
          </Typography>
          {applicationData.passDocument ? (
            <Typography>Нужен</Typography>
          ) : (
            <Typography>Не нужен</Typography>
          )}
        </StyledPaper>
      </Grid>
      <Grid item xs>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Контактный телефон
          </Typography>
          <Typography>{applicationData.contactPhone}</Typography>
        </StyledPaper>
      </Grid>
      {applicationData.wasteLocation.comment && (
        <Grid item xs>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Примечание
            </Typography>
            <Typography>{applicationData.comment}</Typography>
          </StyledPaper>
        </Grid>
      )}
      <Grid item xs>
        <StyledPaper>
          <SendMessage
            receiver={{
              _id: applicationData.user['_id'],
              name: applicationData.user.name,
            }}
          />
        </StyledPaper>
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
