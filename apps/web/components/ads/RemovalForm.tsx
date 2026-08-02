import { useEffect, useState } from 'react'
import { Grid, Typography, InputAdornment, Button, Box } from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import SelectFormik from '../uiParts/formInputs/SelectFormik'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field } from 'formik'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { CREATE_AD, UPDATE_AD } from '../../lib/graphql/queries/ad'
import {
  initialValues as initVal,
  getNormalizedValues,
} from './removalFormConfig'
import { adSchema } from '../../lib/validation'
import { useSnackbar } from 'notistack'
import {
  userPhoneFetcher,
  wasteTypeFetcher,
} from '../../lib/helpers/dataFetcher'

const errorMessage = 'Что то пошло не так'

export default function RemovalForm(props) {
  const { h1 } = props
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [initialValues, setInitialValues] = useState(initVal)
  const [wasteTypesData, setWasteTypesData] = useState([])
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const [createMutation] = useMutation(CREATE_AD)
  const [updateMutation] = useMutation(UPDATE_AD)

  const createHandler = (values, setSubmitting) => {
    setSubmitting(true)
    const normalizedValues = getNormalizedValues(values)
    createMutation({
      variables: { application: normalizedValues },
      fetchPolicy: 'no-cache',
    })
      .then((data) => {
        router.push('/my/ads')
      })
      .catch((error) => {
        enqueueSnackbar(errorMessage, {
          variant: 'error',
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const updateHandler = (values, setSubmitting) => {
    setSubmitting(true)
    const normalizedValues = getNormalizedValues(values)

    fetch(`/api/my/ads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        //  id,
        ...normalizedValues,
      }),
    })
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        if (data.error) {
          enqueueSnackbar(errorMessage, { variant: 'error' })
        } else if (data.message) {
          router.back()
        }
      })
      .catch((error) => {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  useEffect(() => {
    if (id) {
      const dataFether = async () => {
        try {
          setLoading(true)

          const response = await fetch(`/api/my/ads/${id}`)
          const data = await response.json()
          if (!data) return router.push('/404')

          setInitialValues(data)
        } catch (error) {
          setError(true)
        } finally {
          setLoading(false)
        }
      }
      dataFether()
    } else {
      const phoneFetcher = async () => {
        try {
          setLoading(true)

          const phoneData = await userPhoneFetcher()
          setInitialValues({
            ...initialValues,
            contactPhone: phoneData ? phoneData.phone : '',
          })
        } catch (error) {
          enqueueSnackbar(errorMessage, { variant: 'error' })
        } finally {
          setLoading(false)
        }
      }
      phoneFetcher()
    }
  }, [id])

  useEffect(() => {
    const dataFetcher = async () => {
      try {
        setLoading(true)

        const wasteTypesData = await wasteTypeFetcher()

        setWasteTypesData(wasteTypesData)
      } catch (error) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
      } finally {
        setLoading(false)
      }
    }
    dataFetcher()
  }, [])

  if (error) return <Typography>Возникла ошибка при загрузке данных</Typography>

  if (loading) return <PageLoadingCircle />

  return (
    <Box>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={adSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (id) {
            updateHandler(values, setSubmitting)
          } else {
            createHandler(values, setSubmitting)
          }
        }}
      >
        {({ isSubmitting }) => {
          const shouldDisable = loading || isSubmitting

          return (
            <Box>
              <Box sx={{ mb: 4 }}>
                <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
                  {h1}
                </Typography>
              </Box>

              <Form>
                <Grid
                  container
                  maxWidth={'md'}
                  sx={{
                    '& > *': {
                      mb: 3,
                    },
                  }}
                >
                  <Grid size={{ xs: 12 }}>
                    <Field
                      id="title"
                      name="title"
                      variant="outlined"
                      fullWidth
                      component={TextFieldFormik}
                      label="Заголовок объявления"
                      helperText="*Обязательное поле"
                      disabled={shouldDisable}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Field
                      id="wasteLocation"
                      name="wasteLocation"
                      variant="outlined"
                      fullWidth
                      component={PlacesAutocomplete}
                      label="Местоположение вторсырья"
                      helperText="*Обязательное поле"
                      disabled={shouldDisable}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <SelectFormik
                      data={wasteTypesData}
                      name={'wasteType'}
                      label={'Тип вторсырья'}
                      helperText={'*Обязательное поле'}
                      disabled={shouldDisable}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Field
                      component={TextFieldFormik}
                      label="Количество"
                      color="secondary"
                      type="number"
                      fullWidth
                      name="quantity"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">Кг</InputAdornment>
                        ),
                      }}
                      helperText="*Обязательное поле"
                      disabled={shouldDisable}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Field
                      component={TextFieldFormik}
                      label="Контактный телефон"
                      color="secondary"
                      type="tel"
                      fullWidth
                      name="contactPhone"
                      variant="outlined"
                      helperText="*Обязательное поле"
                      disabled={shouldDisable}
                    />
                  </Grid>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={shouldDisable}
                  >
                    Сохранить
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
                </Grid>
              </Form>
            </Box>
          )
        }}
      </Formik>
    </Box>
  )
}
