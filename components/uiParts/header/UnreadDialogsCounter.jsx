import React, { useState, useEffect } from 'react'
import { IconButton, Badge } from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail'
import { useQuery } from '@apollo/client'
import Snackbar from '../Snackbars.jsx'
import { GET_UNREAD_DIALOGS_IDS } from '../../../lib/graphql/queries/message'

export default function UnreadDialogsCounter(props) {
  const { data, error, refetch } = useQuery(GET_UNREAD_DIALOGS_IDS)
  const [backendError, setBackendError] = useState(null)
  const { shownDialog } = props

  useEffect(() => {
    if (error) {
      setBackendError('Не могу получить число непрочитанных сообщений')
    }
  }, [error])

  useEffect(() => {
    if (shownDialog) refetch()
  }, [shownDialog])

  return (
    <>
      <IconButton href="/my/messages">
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
