import React from 'react'
// import LocationOnIcon from '@material-ui/icons/LocationOn'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

// import Divider from '@material-ui/core/Divider'
import Layout from '../src/components/Layout.jsx'
import { Formik } from 'formik'
import * as yup from 'yup'
import RemovalForm from '../src/components/RemovalForm.jsx'

const validationSchema = yup.object({
  autocomplete: yup.mixed().required('Это поле не может быть пустым'),
  autocomplete2: yup.mixed().required('Это поле не может быть пустым'),
})

export default function HandOverClaim() {
  return (
    <Layout>
      <Grid
        container
        direction="column"
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '16px',
        }}
      >
        <Formik
          enableReinitialize
          initialValues={{
            wasteLocation: '',
            quantity: 0,
            passDocumet: false,
            wasteType: '',
            notificationCities: [],
            notificationCitiesCheckbox: false,
            notificationRadius: 0,
            notificationRadiusCheckbox: false,
            passDocumet: false,
          }}
          validationSchema={yup.object().shape(
            {
              wasteLocation: yup.mixed().required(),
              // notificationCities: yup.array().min(1),

              notificationRadiusCheckbox: yup
                .boolean()
                .when('notificationCitiesCheckbox', {
                  is: false,
                  then: yup.boolean().oneOf([true]),
                }),
              notificationCitiesCheckbox: yup
                .boolean()
                .when('notificationRadiusCheckbox', {
                  is: false,
                  then: yup.boolean().oneOf([true]),
                }),
            },
            ['notificationRadiusCheckbox', 'notificationCitiesCheckbox']
          )}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              setSubmitting(false)
              alert(JSON.stringify(values, null, 2))
            }, 500)
          }}
        >
          {({ submitForm, isSubmitting, errors, touched, values }) => {
            return <RemovalForm submitForm isSubmitting errors touched values />
          }}
        </Formik>
      </Grid>
    </Layout>
  )
}
