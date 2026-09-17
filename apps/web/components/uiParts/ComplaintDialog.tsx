import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { complaintFormSchema } from '../../lib/validation/complaintForm'
import { useRef, useState } from 'react'
import ButtonSubmittingCircle from './ButtonSubmittingCircle'
import { Box } from '@mui/material'
import ReCAPTCHA from 'react-google-recaptcha'
import { complaintContentVariants } from '@recycl/shared/dist/constants'
import { useTranslations } from 'next-intl'
import { InferType } from 'yup'
import { validateForm } from '../../lib/helpers/errorHelpers'

type FormDialogProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  contentType: (typeof complaintContentVariants)[number]
}

type ComplaintDialog = InferType<typeof complaintFormSchema>

export default function ComplaintDialog(props: FormDialogProps) {
  const { open, setOpen, contentType } = props
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [recaptchaToken, setRecaptchaToken] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const t = useTranslations('ComplaintDialog')
  const tValidationMessages = useTranslations('ValidationMessages')

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
  }

  const handleChange = (token: string) => {
    setRecaptchaToken(token)
  }

  const formik = useFormik<ComplaintDialog>({
    enableReinitialize: true,
    initialValues: {
      complaint: '',
      complaintUrl: router.asPath,
    },
    validate: async (values) => {
      return await validateForm({
        values,
        validationSchema: complaintFormSchema,
        translations: tValidationMessages,
      })
    },

    onSubmit: async (values) => {
      if (!recaptchaToken) return

      try {
        const response = await fetch(`/api/complaint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, recaptchaToken, contentType }),
        })

        if (!response.ok) {
          throw new Error('Response is not OK')
        }
        enqueueSnackbar(t('successMessage'), {
          variant: 'success',
        })
        handleClose()
      } catch (error) {
        enqueueSnackbar(t('errorMessage'), {
          variant: 'error',
        })
      } finally {
        recaptchaRef.current?.reset()
      }
    },
  })

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{t('content')}</DialogContentText>
            <Box mb={3}>
              <TextField
                multiline
                rows={3}
                variant="outlined"
                margin="dense"
                id="complaint"
                name="complaint"
                label={t('label')}
                fullWidth
                value={formik.values.complaint}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.complaint && Boolean(formik.errors.complaint)
                }
                helperText={formik.touched.complaint && formik.errors.complaint}
              />
            </Box>
            <Box mb={3}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" size="small">
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              variant="contained"
              size="small"
            >
              {t('submit')}
              {formik.isSubmitting && <ButtonSubmittingCircle />}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}
