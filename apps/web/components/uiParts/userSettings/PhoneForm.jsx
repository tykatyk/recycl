import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { useSession } from 'next-auth/react'
import { Avatar, Button, Box, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Formik, Form, Field, useFormikContext } from 'formik'
import Snackbar from '../Snackbars'
import TextFieldFormik from '../formInputs/TextFieldFormik'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import PageLoadingCircle from '../PageLoadingCircle'
import { phoneSchema } from '../../../lib/validation'
import { GET_PHONE, UPDATE_PHONE } from '../../../lib/graphql/queries/user'
import { useMutation, useQuery } from '@apollo/client'

const PREFIX = 'PhoneForm'

const classes = {
  avatar: `${PREFIX}-avatar`,
  box: `${PREFIX}-box`,
  alternativeBox: `${PREFIX}-alternativeBox`,
  form: `${PREFIX}-form`,
  field: `${PREFIX}-field`,
  submit: `${PREFIX}-submit`,
}

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },

  [`& .${classes.box}`]: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`&.${classes.alternativeBox}`]: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  [`& .${classes.form}`]: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },

  [`& .${classes.field}`]: {
    marginBottom: theme.spacing(4),
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function PhoneForm() {
  const { data: session } = useSession()
  const [id, setId] = useState('')
  const [severity, setSeverity] = useState('error')
  const [notification, setNotification] = useState('')
  const [updatePhone, { data: updateData }] = useMutation(UPDATE_PHONE)
  const { data, error, loading } = useQuery(GET_PHONE, {
    variables: { id }, //ToDo should be refactored since user is available in appolo context
  })

  useEffect(() => {
    if (updateData && updateData.updatePhone) {
      setSeverity('success')
      setNotification('Данные успешно обновлены')
    }
  }, [updateData])

  useEffect(() => {
    if (session) setId(session.id)
  }, [session])

  const PhoneForm = () => {
    const { isSubmitting, setFieldValue } = useFormikContext()
    useEffect(() => {
      if (!data || !data.getPhone || !data.getPhone.phone) return
      setFieldValue('phone', data.getPhone.phone, false)
    }, [setFieldValue])

    return (
      <Form className={classes.form} noValidate autoComplete="off">
        <Field
          variant="outlined"
          margin="normal"
          fullWidth
          id="phone"
          label="Номер телефона"
          name="phone"
          component={TextFieldFormik}
          className={classes.field}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          className={classes.submit}
          disabled={isSubmitting}
          style={{ width: 'auto' }}
        >
          Сохранить
          {isSubmitting && <ButtonSubmittingCircle />}
        </Button>
      </Form>
    )
  }

  if (loading)
    return (
      <StyledBox className={classes.alternativeBox}>
        <PageLoadingCircle style={{ position: 'static' }} />
      </StyledBox>
    )

  if (error) {
    return (
      <Box className={classes.alternativeBox}>
        <Avatar className={classes.avatar}>
          <ErrorOutlineIcon />
        </Avatar>
        <Typography variant="body2">Ошибка при получении данных</Typography>
      </Box>
    )
  }

  return (
    <Box className={classes.box}>
      <Formik
        initialValues={{
          phone: '',
        }}
        validationSchema={phoneSchema}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          setSubmitting(true)
          try {
            await updatePhone({ variables: { phone: values.phone } })
          } catch (error) {
            if (
              error.graphQLErrors &&
              error.graphQLErrors.length > 0 &&
              error.graphQLErrors[0].extensions.detailedMessages
            ) {
              setErrors(error.graphQLErrors[0].extensions.detailedMessages)
            } else {
              setSeverity('error')
              setNotification('Возникла ошибка при сохранении данных')
            }
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <PhoneForm />
      </Formik>

      <Snackbar
        severity={severity}
        open={!!notification}
        message={notification}
        handleClose={() => {
          setNotification('')
        }}
      />
    </Box>
  )
}
