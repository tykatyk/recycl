import React from 'react'
import { Typography, InputAdornment, makeStyles } from '@material-ui/core'
import TextFieldFormik from './formInputs/TextFieldFormik.jsx'
import { Formik, Form, Field } from 'formik'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowX: 'hidden',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  helperTextRoot: {
    textAlign: 'center',
  },
  inputRoot: {
    maxWidth: '20px',
    '& input': {
      padding: '3px !important',
    },
  },
}))

export default function MapSidebarQuantityForm() {
  const classes = useStyles()

  return (
    <Formik
      enableReinitialize
      initialValues={{
        min: '',
        max: '',
      }}
      onSubmit={(values, { setSubmitting }) => {}}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        return (
          <Form className={classes.root}>
            <div className={classes.wrapper}>
              <div style={{ marginRight: '10px' }}>
                <Field
                  component={TextFieldFormik}
                  color="secondary"
                  type="number"
                  fullWidth
                  name="min"
                  variant="outlined"
                  FormHelperTextProps={{
                    className: classes.helperTextRoot,
                  }}
                  helperText="От"
                  size="small"
                />
              </div>
              <div>
                <Field
                  component={TextFieldFormik}
                  color="secondary"
                  type="number"
                  fullWidth
                  name="max"
                  variant="outlined"
                  FormHelperTextProps={{
                    className: classes.helperTextRoot,
                  }}
                  helperText="До"
                  size="small"
                />
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
