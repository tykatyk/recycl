import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { validationMessages } from '@recycl/shared/dist/validation'

const { required, maxLength, minLength } = validationMessages

const validationSchema = yup.object({
  complaint: yup
    .string()
    .min(25, minLength)
    .max(50, maxLength)
    .required(required),
})

type FormDialogProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}
export default function ComplainDialog(props: FormDialogProps) {
  const { open, setOpen } = props

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
  }

  const formik = useFormik({
    initialValues: {
      complaint: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log('here')
      //   alert(JSON.stringify(values, null, 2))
      //   handleClose()
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
              margin="dense"
              id="complaint"
              name="complaint"
              label="Текст жалобы"
              fullWidth
              variant="standard"
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
