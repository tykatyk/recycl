import Layout from '../../../components/layouts/Layout'
import { Box, Button, Grid, Typography } from '@mui/material'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import PageLoadingCircle from '../../../components/uiParts/PageLoadingCircle'
import { ReactElement, useState } from 'react'
import { emailSchema } from '../../../lib/validation'
import { Formik, FormikHelpers, Form, Field } from 'formik'
import ButtonSubmittingCircle from '../../../components/uiParts/ButtonSubmittingCircle'
import TextFieldFormik from '../../../components/uiParts/formInputs/TextFieldFormik'
import notification from '../../api/jobs/notification'
import CustomSnackbar from '../../../components/uiParts/Snackbars'
import { useRouter } from 'next/router'

const titleHeading = 'Необходимо подтвердить email'
const submitHandler = async () => {}

const ConfirmEmailForm = () => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ email: '' }}
      validationSchema={emailSchema}
      //ToDo: add types to values
      onSubmit={(values: any, actions: FormikHelpers<Event>) => {}}
    >
      {({ isSubmitting, initialValues }) => {
        return (
          <Form>
            <Grid
              item
              container
              component="fieldset"
              sx={{
                m: 0,
                p: 0,
                mb: 5,
                '& > div': {
                  pb: 2,
                },
                '& > div:last-child': {
                  pb: 0,
                },
                border: 'none',
              }}
            >
              <Grid item xs={12}>
                <Field
                  component={TextFieldFormik}
                  label="Email"
                  color="secondary"
                  type="email"
                  fullWidth
                  name="email"
                  variant="outlined"
                  helperText="*Обязательное поле"
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Сохранить
                  {isSubmitting && <ButtonSubmittingCircle />}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )
      }}
    </Formik>
  )
}

export default function ConfirmEmail() {
  const router = useRouter()
  const session = useSession()
  const { status } = session
  let content: ReactElement | null = null
  const [severity, setSeverity] = useState<string>('success')
  const [notification, setNotification] = useState<string>('')

  switch (status) {
    case 'loading': {
      content = <PageLoadingCircle />
      break
    }

    case 'unauthenticated': {
      router.push({
        pathname: '/auth/login',
        query: {
          //ToDo: change "from" url
          from: `${process.env.NEXT_PUBLIC_URL}${router.asPath}`,
        },
      })
      break
    }
    case 'authenticated': {
      content = <ConfirmEmailForm />
      break
    }
    default:
      content = null
  }

  return (
    <Layout title={`${titleHeading} | Recycl`}>
      <Grid
        container
        direction="column"
        sx={{
          margin: '0 auto',
        }}
      >
        <Typography gutterBottom variant="h4" component="h1" sx={{ mb: 4 }}>
          {titleHeading}
        </Typography>

        <CustomSnackbar
          severity={severity}
          open={!!notification}
          message={notification}
          handleClose={() => {
            setNotification('')
          }}
        />
      </Grid>
    </Layout>
  )
}
