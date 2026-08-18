import { useEffect, useState } from 'react'
import { Grid, Typography, InputAdornment, Button, Box } from '@mui/material'
import PlacesAutocomplete from '../uiParts/formInputs/PlacesAutocomplete'
import TextFieldFormik from '../uiParts/formInputs/TextFieldFormik'
import SelectFormik from '../uiParts/formInputs/SelectFormik'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import ButtonSubmittingCircle from '../uiParts/ButtonSubmittingCircle'
import { Formik, Form, Field } from 'formik'
import { useRouter } from 'next/router'
import { getNormalizedValues } from './removalFormConfig'
import { adSchema } from '../../lib/validation'
import { useSnackbar } from 'notistack'
import {
  userPhoneFetcher,
  wasteTypeFetcher,
} from '../../lib/helpers/dataFetcher'

const errorMessage = 'Что то пошло не так'
const initVal = {
  title: '',
  wasteLocation: null as any,
  wasteType: '',
  quantity: '',
  contactPhone: '',
  comment: '',
}

type FormValues = typeof initVal

export default function RemovalForm(props) {
  const { h1 } = props
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [initialValues, setInitialValues] = useState<FormValues>(initVal)
  const [wasteTypesData, setWasteTypesData] = useState([])
  const { id } = router.query
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const createHandler = async (values: FormValues, setSubmitting) => {
    try {
      setSubmitting(true)
      const normalizedValues = getNormalizedValues(values)

      const response = await fetch('/api/my/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //  id,
          ...normalizedValues,
        }),
      })
      if (response.status !== 200) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
        return
      }

      enqueueSnackbar('Документ создан', { variant: 'success' })
      router.push('/my/ads')
    } catch (err) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const updateHandler = async (values: FormValues, setSubmitting) => {
    try {
      setSubmitting(true)
      const normalizedValues = getNormalizedValues(values)

      const response = await fetch(`/api/my/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          //  id,
          ...normalizedValues,
        }),
      })

      if (response.status !== 200) {
        enqueueSnackbar(errorMessage, { variant: 'error' })
        return
      }

      enqueueSnackbar('Документ обновлен', { variant: 'success' })
      router.back()
    } catch (err) {
      enqueueSnackbar(errorMessage, { variant: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    if (id) {
      const adFether = async () => {
        try {
          setLoading(true)

          const response = await fetch(`/api/my/ads/${id}`)
          if (response.status === 404) {
            router.push('/404')
          }

          const data = await response.json()
          if (!data) return router.push('/404')

          setInitialValues(data)
        } catch (error) {
          setError(true)
        } finally {
          setLoading(false)
        }
      }
      adFether()
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
        onSubmit={async (values, { setSubmitting }) => {
          if (id) {
            await updateHandler(values, setSubmitting)
          } else {
            await createHandler(values, setSubmitting)
          }
        }}
      >
        {({ isSubmitting }) => {
          const shouldDisable = loading || isSubmitting

          return (
            <Box>
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography component="h1" variant="h4">
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
