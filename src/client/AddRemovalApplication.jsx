import React from 'react'
import { Grid } from '@material-ui/core'
import Layout from './Layout.jsx'
import RemovalForm from './removalApplicationForm/RemovalForm.jsx'
import { useMutation } from '@apollo/client'
import { CREATE_REMOVAL_APPLICATION } from '../server/graphqlQueries'

const initialValues = {
  wasteLocation: '',
  wasteType: '',
  quantity: '',
  comment: '',
  passDocumet: false,
  notificationCities: [],
  notificationCitiesCheckbox: false,
  notificationRadius: '',
  notificationRadiusCheckbox: false,
}

export default function RemovalApplication(props) {
  const [executeMutation, { data, loading, error }] = useMutation(
    CREATE_REMOVAL_APPLICATION
  )

  const submitHandler = (values) => {
    const normalizedValues = {}
    Object.assign(normalizedValues, values)

    const wasteLocation = {
      description: values.wasteLocation.description,
      place_id: values.wasteLocation.place_id,
      structured_formatting: values.wasteLocation.structured_formatting,
    }

    normalizedValues.wasteLocation = wasteLocation

    const notificationCities = values.notificationCities.map((item) => {
      const normalizedItem = {}
      normalizedItem.description = item.description
      normalizedItem.place_id = item.place_id
      normalizedItem.structured_formatting = item.structured_formatting
      return normalizedItem
    })
    normalizedValues.notificationCities = notificationCities
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
