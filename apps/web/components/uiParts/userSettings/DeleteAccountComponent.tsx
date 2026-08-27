import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import ConfirmDialog from '../ConfirmDialog'
import ButtonSubmittingCircle from '../ButtonSubmittingCircle'
import { signOut } from 'next-auth/react'
import { enqueueSnackbar } from 'notistack'
import { useTranslations } from 'next-intl'

const api = '/api/my/account/delete'

export default function DeleteAccountComponent() {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = React.useState(false)
  const t = useTranslations('AccountSettings.DeleteAccountComponent')

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status !== 204) throw new Error(t('errorMessage'))

      enqueueSnackbar(t('successMessage'), {
        variant: 'success',
      })
      signOut()
    } catch (error) {
      enqueueSnackbar(t('errorMessage'), {
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
          {t('deleteBtn')}
          {loading && <ButtonSubmittingCircle />}
        </Button>
      </Box>

      <ConfirmDialog
        title={t('confirmTitle')}
        message={t('confirmMessage')}
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
