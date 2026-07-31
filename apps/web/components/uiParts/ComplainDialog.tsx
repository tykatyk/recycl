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

const errorMessage = 'Что то пошло не так'
const successMessage = 'Сообщение отправлено администратору'

type FormDialogProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ComplainDialog(props: FormDialogProps) {
  const { open, setOpen } = props
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
  }

  const handleChange = (token) => {
    setRecaptchaToken(token)
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      complaint: '',
      complaintUrl: router.asPath,
    },
    validationSchema: complaintFormSchema,
    onSubmit: async (values) => {
      if (!recaptchaToken) return

      try {
        const response = await fetch(`/api/complaint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, recaptchaToken }),
        })

        if (!response.ok) {
          throw new Error('Response is not OK')
        }
        enqueueSnackbar(successMessage, {
          variant: 'success',
        })
        handleClose()
      } catch (error) {
        enqueueSnackbar(errorMessage, {
          variant: 'error',
        })
      } finally {
        recaptchaRef.current?.reset()
      }
    },
  })

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: '450px',
          },
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Пожаловаться на контент</DialogTitle>
          <DialogContent>
            <DialogContentText>Опишите причину жалобы</DialogContentText>
            <Box mb={3}>
              <TextField
                multiline
                rows={3}
                variant="outlined"
                margin="dense"
                id="complaint"
                name="complaint"
                label="Текст жалобы"
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
              Отменить
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              variant="contained"
              size="small"
            >
              Отправить
              {formik.isSubmitting && <ButtonSubmittingCircle />}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}
