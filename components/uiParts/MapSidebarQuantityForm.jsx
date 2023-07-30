import React, { useEffect } from 'react'
import { TextField, Button, Typography, makeStyles } from '@material-ui/core'
import { Formik, Form, ErrorMessage } from 'formik'
import ButtonSubmittingCircle from './ButtonSubmittingCircle.jsx'
import { quantitySchema } from '../../lib/validation'
import mapErrors from '../../lib/helpers/mapErrors'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    overflowX: 'hidden',
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    '& > *': {
      marginRight: theme.spacing(1),
    },
    '& > :last-child': {
      marginRight: 0,
    },
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
  submit: {
    marginTop: 5,
  },
}))

export default function MapSidebarQuantityForm(props) {
  const classes = useStyles()
  const { min = 0, max = 0 } = props
  let errorMsg = null

  return (
    <Formik
      enableReinitialize
      initialValues={{
        min,
        max,
      }}
      onSubmit={(values, { setSubmitting }) => {}}
      validate={async (values) => {
        return await quantitySchema
          .validate(values, {
            abortEarly: false,
            validationContext: { min, max },
          })
          .then(() => ({}))
          .catch((error) => {
            // console.log(JSON.stringify(error, null, 2))
            const errors = mapErrors(error)
            return errors
          })
      }}
    >
      {({
        isSubmitting,
        handleChange,
        handleBlur,
        touched,
        values,
        errors,
        setFieldValue,
      }) => {
        if (touched.min && Boolean(errors.min)) {
          errorMsg = <ErrorMessage name="min" />
        } else if (touched.max && Boolean(errors.max)) {
          errorMsg = <ErrorMessage name="max" />
        } else {
          errorMsg = null
        }

        useEffect(() => {
          if (min) setFieldValue('min', min) //ToDo add check for min == 0
          if (max) setFieldValue('max', max) //ToDo add check for max == 0
        }, [min, max])

        return (
          <Form className={classes.root}>
            <div className={classes.wrapper}>
              <div>
                <TextField
                  color="secondary"
                  fullWidth
                  name="min"
                  variant="outlined"
                  FormHelperTextProps={{
                    className: classes.helperTextRoot,
                  }}
                  helperText="От"
                  size="small"
                  value={values.min}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.min && Boolean(errors.min)}
                />
              </div>
              <div>
                <TextField
                  color="secondary"
                  fullWidth
                  name="max"
                  variant="outlined"
                  FormHelperTextProps={{
                    className: classes.helperTextRoot,
                  }}
                  helperText="До"
                  size="small"
                  value={values.max}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.max && Boolean(errors.max)}
                />
              </div>
              <div>
                <Button
                  size="small"
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  Ок
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </div>
            </div>
            <div>
              {errorMsg && (
                <Typography
                  color="error"
                  variant="body2"
                  style={{ marginTop: 8 }}
                >
                  {errorMsg}
                </Typography>
              )}
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
