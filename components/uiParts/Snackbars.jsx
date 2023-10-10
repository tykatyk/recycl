import { Snackbar, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Alert } from '@mui/material'

export default function Snackbars(props) {
  const { message, severity = 'success', open, handleClose } = props

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="secondary"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <Alert
        sx={{ color: '#fff' }}
        variant="filled"
        onClose={handleClose}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
