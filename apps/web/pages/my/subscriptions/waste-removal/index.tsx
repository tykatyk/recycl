import { Box, Button, InputAdornment, Stack, Typography } from '@mui/material'
import Layout from '../../../../components/layouts/Layout'
import { Formik, Form, Field } from 'formik'
import TextFieldFormik from '../../../../components/uiParts/formInputs/TextFieldFormik'
import { wasteAvailableSubscriptionSchema } from '../../../../lib/validation'
import * as yup from 'yup'
import { useState } from 'react'
import ButtonSubmittingCircle from '../../../../components/uiParts/ButtonSubmittingCircle'
import { useSnackbar } from 'notistack'

export default function WasteRemovalSubscriptionConfig() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleClick = () => {
    enqueueSnackbar('I love snacks.')
  }

  return (
    <Layout title="Указать радиус поиска пунктов приема вторсырья">
      <Box
        sx={{
          margin: 'auto',
          // display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component={'h1'} variant="h6" paragraph align="center">
          Укажите радиус поиска пунктов приема вторсырья из ваших обьявлений
        </Typography>
        <Box>
          <Formik<yup.InferType<typeof wasteAvailableSubscriptionSchema>>
            enableReinitialize
            initialValues={{ radius: '' } as any}
            validationSchema={wasteAvailableSubscriptionSchema}
            onSubmit={() => {}}
          >
            <Form>
              <Stack spacing={3}>
                <Field
                  id="radius"
                  name="radius"
                  variant="outlined"
                  fullWidth
                  component={TextFieldFormik}
                  label="Радиус поиска"
                  helperText="*Обязательное поле"
                  type="number"
                  size="small"
                  inputProps={{ min: 1, max: 200 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Км</InputAdornment>
                    ),
                  }}
                  disabled={false}
                />
                <Box>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSubmitting}
                    onSubmit={() => handleClick()}
                  >
                    Сохранить
                    {isSubmitting && <ButtonSubmittingCircle />}
                  </Button>
                </Box>
              </Stack>
            </Form>
          </Formik>
        </Box>
      </Box>
    </Layout>
  )
}
