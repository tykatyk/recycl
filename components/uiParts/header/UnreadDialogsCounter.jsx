import React, { useState, useEffect } from 'react'
import { IconButton, Badge } from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail'
import { useQuery } from '@apollo/client'
import Snackbar from '../Snackbars'
import { GET_UNREAD_DIALOG_IDS } from '../../../lib/graphql/queries/message'

export default function UnreadDialogsCounter(props) {
  const { currentDialogId } = props
  const { data, error } = useQuery(GET_UNREAD_DIALOG_IDS, {
    variables: currentDialogId,
    pollInterval: 2000,
  })
  const [backendError, setBackendError] = useState(null)

  useEffect(() => {
    if (error) {
      setBackendError('Не могу получить число непрочитанных сообщений')
    }
  }, [error])

  return (
    <>
      <IconButton href="/my/dialogs">
        <Badge
          badgeContent={
            data && data.getUnreadDialogsIDs
              ? data.getUnreadDialogsIDs.length
              : 0
          }
          color="secondary"
        >
          <MailIcon
            aria-label="incoming messages"
            aria-controls="menu-appbar"
            aria-haspopup="false"
            color="inherit"
          />
        </Badge>
      </IconButton>
      {backendError && (
        <Snackbar
          severity="error"
          open={true}
          message={backendError}
          handleClose={() => {
            setBackendError(null)
          }}
        />
      )}
    </>
  )
}
