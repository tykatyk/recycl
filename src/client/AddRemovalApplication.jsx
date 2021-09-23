import React from 'react'
import { Grid } from '@material-ui/core'
import Layout from './Layout.jsx'
import RemovalForm from './removalApplicationForm/RemovalForm.jsx'
import { useMutation } from '@apollo/client'
import { CREATE_REMOVAL_APPLICATION } from '../server/graphqlQueries'
import {
  getInitialValues,
  getNormalizedValues,
} from './removalApplicationForm/removalFormConfig'

const initialValues = getInitialValues()

export default function RemovalApplication(props) {
  const [executeMutation, { data, loading, error }] = useMutation(
    CREATE_REMOVAL_APPLICATION
  )

  if (error)
    return <Typography>Возникла ошибка при сохранении данных</Typography>
  if (loading) return <Typography>Идет сохранение данных</Typography>

  const submitHandler = (values) => {
    const normalizedValues = getNormalizedValues(values)
    executeMutation({ variables: { application: normalizedValues } })
  }

  return (
    <Layout>
      <Grid
        container
        direction="column"
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        <RemovalForm
          initialValues={initialValues}
          submitHandler={submitHandler}
        />
      </Grid>
    </Layout>
  )
}
