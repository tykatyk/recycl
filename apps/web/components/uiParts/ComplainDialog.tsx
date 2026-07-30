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

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      complaint: '',
      complaintUrl: router.asPath,
    },
    validationSchema: complaintFormSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(`/api/complaint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values }),
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отменить</Button>
            <Button type="submit">Отправить</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}
