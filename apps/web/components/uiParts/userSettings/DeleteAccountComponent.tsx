import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import ConfirmDialog from '../ConfirmDialog'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import { signOut } from 'next-auth/react'
import { enqueueSnackbar } from 'notistack'

const errorMessage = 'Что то пошло не так'
const dialogMessage = `Удаление аккаунта приведет к удалению всех ваших данных.
  Это действие нельзя отменить. Вы действительно хотите продолжить?`
const api = '/api/my/account/delete'

export default function DeleteAccountComponent() {
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = React.useState(false)
  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status !== 204) throw new Error(errorMessage)

      enqueueSnackbar('Ваш аккаунт удален', {
        variant: 'success',
      })
      signOut()
    } catch (error) {
      enqueueSnackbar(errorMessage, {
        variant: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Box>
        <Button
          type="button"
          onClick={() => {
            setOpen(true)
          }}
          fullWidth
          variant="contained"
          disabled={loading}
          style={{ width: 'auto' }}
        >
          Удалить аккаунт
          {loading && <ButtonSubmittingCircle />}
        </Button>
      </Box>

      <ConfirmDialog
        title="Подтвердите удаление аккаунта"
        message={dialogMessage}
        open={open}
        handleConfirm={async () => {
          setOpen(false)
          await handleDelete()
        }}
        handleReject={() => {
          setOpen(false)
        }}
      />
    </Box>
  )
}
