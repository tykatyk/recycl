import React from 'react'
import { Snackbar, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Alert } from '@mui/material'

function CustomAlert(props) {
  return <Alert variant="filled" {...props} />
}

export default function Snackbars(props) {
  const { message, severity, open, handleClose } = props

  return (
    <div
      css={(theme) => ({
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
      })}
    >
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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
        <CustomAlert onClose={handleClose} severity={severity}>
          {message}
        </CustomAlert>
      </Snackbar>
    </div>
  )
}
