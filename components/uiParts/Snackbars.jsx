import React from 'react'
import { Snackbar, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Alert } from '@mui/material'

export default function Snackbars(props) {
  const { message, severity = 'success', open, handleClose } = props

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
        <Alert variant="filled" onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}
