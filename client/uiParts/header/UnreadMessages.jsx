import React, { useState, useEffect } from 'react'
import { IconButton, Badge } from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail'
import { useQuery } from '@apollo/client'
import Snackbar from '../Snackbars.jsx'
import { GET_NUMBER_OF_UNREAD_MESSAGES } from '../../../lib/graphql/queries/message'

export default function UnreadMessages() {
  const { loading, data, error } = useQuery(GET_NUMBER_OF_UNREAD_MESSAGES)
  const [backendError, setBackendError] = useState(null)

  useEffect(() => {
    if (error) {
      console.log(JSON.stringify(error, null, 2))
      setBackendError('Не могу получить число непрочитанных сообщений')
    }
  }, [error])

  if (loading) {
    return (
      <IconButton href="#">
        <Badge badgeContent={0} color="secondary">
          <MailIcon
            aria-label="incoming messages"
            aria-controls="menu-appbar"
            aria-haspopup="false"
            color="inherit"
          />
        </Badge>
      </IconButton>
    )
  }

  return (
    <>
      <IconButton href="#">
        <Badge
          badgeContent={
            data && data.getNumberOfUnreadMessages
              ? data.getNumberOfUnreadMessages
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
      <Snackbar
        severity="error"
        open={!!backendError}
        message={backendError}
        handleClose={() => {
          setBackendError(null)
        }}
      />
    </>
  )
}
