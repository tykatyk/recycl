import React, { useState, useEffect } from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Fab,
  Paper,
  Grid,
  Divider,
  TextField,
  makeStyles,
} from '@material-ui/core'
import SendIcon from '@material-ui/icons/Send'
import Layout from './layouts/Layout.jsx'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useMutation, useQuery } from '@apollo/client'
import RedirectUnathenticatedUser from './uiParts/RedirectUnathenticatedUser.jsx'
import PageLoadingCircle from './uiParts/PageLoadingCircle.jsx'
import ErrorOverlay from './dialogs/ErrorOverlay.jsx'

import { CREATE_MESSAGE } from '../lib/graphql/queries/message'
import { GET_DIALOG } from '../lib/graphql/queries/message'

const useStyles = makeStyles({
  chatSection: {
    width: '100%',
  },

  dialog: {
    height: '70vh',
    overflowY: 'auto',
  },

  right: {
    justifyContent: 'flex-end',
    '& $message': {
      alignItems: 'flex-end',
    },
  },
  message: {
    maxWidth: '85%',
    alignItems: 'flex-start',
  },
  fromMe: { alignItems: 'flex-end' },
})

export default function ChatPage(props) {
  const classes = useStyles()
  const { data: session } = useSession()
  const [state, setState] = useState({
    dialogReceiverId: '',
    dialogInitiatorId: '',
    receiverId: '',
    receiverName: '',
    ad: '',
  })
  const thisUserId = session && session.id ? session.id : ''
  const thisUserName = session && session.user ? session.user.name : ''
  const { dialogId } = props
  const [
    createMessageMutation,
    { loading: creatingMessage, error: createMessageError, data: messageData },
  ] = useMutation(CREATE_MESSAGE)
  const {
    loading: gettingDialog,
    error: getDialogError,
    data: dialogData,
  } = useQuery(GET_DIALOG, {
    variables: {
      id: dialogId,
    },
  })

  const dataIsCorrect = () => {
    if (dialogData && dialogData.getDialog && dialogData.getDialog.length > 0) {
      return true
    }
    return false
  }
  useEffect(() => {
    if (!dataIsCorrect()) return

    const firstMessage = dialogData.getDialog[0]
    const dialogReceiverId = firstMessage.dialogReceiverId
    const dialogInitiatorId = firstMessage.dialogInitiatorId

    if (!dialogReceiverId && !dialogInitiatorId) {
      //ToDo: set error state
      console.log('Required params are not present')
      return
    }

    const newState = {}

    newState.receiverId =
      firstMessage.receiverId === thisUserId
        ? firstMessage.senderId
        : firstMessage.receiverId

    newState.receiverName =
      firstMessage.receiverName === thisUserName
        ? firstMessage.senderName
        : firstMessage.receiverName

    newState.ad = firstMessage.ad

    if (dialogReceiverId && dialogInitiatorId) {
      newState.dialogReceiverId = dialogReceiverId
      newState.dialogInitiatorId = dialogInitiatorId
      setState({ ...state, ...newState })
      return
    }

    if (!dialogInitiatorId) {
      newState.dialogReceiverId = dialogReceiverId

      if (dialogReceiverId === firstMessage.receiverId) {
        newState.dialogInitiatorId = firstMessage.senderId
      } else {
        newState.dialogInitiatorId = firstMessage.receiverId
      }
      setState({ ...state, ...newState })
      return
    }

    if (!dialogReceiverId) {
      newState.dialogInitiatorId = dialogInitiatorId

      if (dialogInitiatorId === firstMessage.receiverId) {
        newState.dialogReceiverId = firstMessage.senderId
      } else {
        newState.dialogReceiverId = firstMessage.receiverId
      }
      setState({ ...state, ...newState })
    }
  }, [dialogData, thisUserId, thisUserName])

  const handleClick = (e) => {
    createMessageMutation({
      variables: {
        message: {
          ...state,
          text: e.target.value,
          senderId: thisUserId,
          senderName: thisUserName,
          dialogId,
        },
      },
    })
  }

  let content = null
  if (gettingDialog) content = <PageLoadingCircle />
  if (getDialogError) content = <ErrorOverlay /> //ToDo: Add incorrect data error
  if (dataIsCorrect())
    content = (
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={12}>
          <List className={classes.dialog}>
            {dialogData.getDialog.map((message) => {
              const now = new Date()
              const currMonth = now.getMonth()
              const currDate = now.getDate()

              const creationDate = new Date(message.createdAt)
              const month = creationDate.getMonth()
              const date = creationDate.getDate()
              const hours = creationDate.getHours()
              const minutes = '0' + creationDate.getMinutes()

              let dateTime
              if (currDate != date || currMonth != month) {
                dateTime = `${hours}:${minutes.substr(
                  -2
                )}, ${creationDate.toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: 'short',
                })}`
              } else {
                dateTime = `${hours}:${minutes.substr(-2)}`
              }
              return (
                <ListItem
                  key={message._id}
                  className={clsx({
                    [classes.right]: message.senderId !== thisUserId,
                  })}
                >
                  <Grid
                    container
                    direction="column"
                    className={classes.message}
                  >
                    <Grid item>
                      <ListItemText primary={message.text}></ListItemText>
                    </Grid>
                    <Grid item>
                      <ListItemText secondary={dateTime}></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              )
            })}

            <ListItem key="2">
              <Grid
                container
                direction="column"
                className={clsx(classes.message)}
              >
                <Grid item>
                  <ListItemText primary="Hey, Iam Good! What about you ?"></ListItemText>
                </Grid>
                <Grid item>
                  <ListItemText secondary="09:31"></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Divider />
          <Grid container style={{ alignItems: 'center', padding: '20px' }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Напишите что-нибудь"
                fullWidth
                multiline
                variant="outlined"
                rows={4}
                onChange={(e) => handleClick(e)}
              />
            </Grid>
            <Grid item xs={1} align="right">
              <Fab color="primary" aria-label="add">
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    )

  return (
    <RedirectUnathenticatedUser>
      <Layout title="Диалог с ... относительно ... | Recycl">{content}</Layout>
    </RedirectUnathenticatedUser>
  )
}
