import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

export default function ConfirmDialog(props) {
  const {
    title = '',
    message = '',
    open = false,
    handleConfirm = null,
    handleReject = null,
  } = props
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleReject}>
            Нет
          </Button>
          <Button color="secondary" onClick={handleConfirm}>
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
