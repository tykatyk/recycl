import React from 'react'
import { Grid } from '@material-ui/core'
import Layout from './Layout.jsx'
import RemovalForm from './removalApplicationForm/RemovalForm.jsx'
import { useLazyQuery, useMutation } from '@apollo/client'
import {
  GET_REMOVAL_APPLICATION,
  UPDATE_REMOVAL_APPLICATION,
} from '../server/graphqlQueries'
import { useRouter } from 'next/router'

export default function RemovalApplication(props) {
  const router = useRouter()
  const { id } = router.query
  const [getRemovalApplication, { called, data, loading, error }] =
    useLazyQuery(GET_REMOVAL_APPLICATION)

  if (id && !called) getRemovalApplication({ variables: { id } })
  //if error
  //if loading
  const [
    executeMutation,
    { data: updateData, loading: loadingUpdateData, updateError },
  ] = useMutation(CREATE_REMOVAL_APPLICATION)
  //if error
  //if loading

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
    executeMutation({ variables: { id: id, newValue: normalizedValues } })
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
