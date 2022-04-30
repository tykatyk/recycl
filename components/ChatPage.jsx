import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
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
import { useApolloClient, useMutation } from '@apollo/client'
import RedirectUnathenticatedUser from './uiParts/RedirectUnathenticatedUser.jsx'
import PageLoadingCircle from './uiParts/PageLoadingCircle.jsx'
import ErrorOverlay from './dialogs/ErrorOverlay.jsx'
import { CREATE_MESSAGE, GET_DIALOG } from '../lib/graphql/queries/message'

const messageContainerHeight = 400

const useStyles = makeStyles((theme) => ({
  chatSection: {
    width: '100%',
  },

  dialog: {
    height: messageContainerHeight,
    overflowY: 'auto',
  },

  right: {
    justifyContent: 'flex-end',
    '& $message': {
      alignItems: 'flex-end',
    },
  },
  message: {
    width: 'auto',
    maxWidth: '85%',
  },
  messageContent: {
    background: '#747875',
    borderRadius: '1em',
    borderTopLeftRadius: 0,
    padding: theme.spacing(1),
  },
  messageDate: {
    marginRight: theme.spacing(1),
    alignItems: 'flex-start',
    minHeight: 150,
  },
  fromMe: { alignItems: 'flex-end' },
}))

export default function ChatPage(props) {
  const classes = useStyles()
  const { data: session } = useSession()
  const thisUserId = session && session.id ? session.id : ''
  const thisUserName = session && session.user ? session.user.name : ''
  const { dialogId } = props
  const client = useApolloClient()
  const [loading, setLoading] = useState(false)
  const [getDialogError, setGetDialogError] = useState('')

  const [
    createMessageMutation,
    { loading: creatingMessage, error: createMessageError, data: messageData },
  ] = useMutation(CREATE_MESSAGE)

  const dataIsCorrect = (dialogData) => {
    if (dialogData && dialogData.getDialog && dialogData.getDialog.length > 0) {
      return true
    }
    return false
  }
  const [dialogData, setDialogData] = useState(null)
  const [title, setTitle] = useState('Диалог | Recycl')

  const limit = 1 //num messages to receive when quering database
  const messageContainerRef = useRef()
  const nodesRef = useRef([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [items, setItems] = useState([])
  const [anchorIndex, setAnchorIndex] = useState(0)
  const [canLoadMore, setCanLoadMore] = useState(true)

  const getMoreData = async function (offset = '', count = limit) {
    if (!dialogId || !canLoadMore || loading) return

    setLoading(true)
    const result = await client
      .query({
        query: GET_DIALOG,
        variables: {
          id: dialogId,
          offset,
          limit: count,
        },
      })
      .then((result) => {
        return result
      })
      .catch((error) => {
        setGetDialogError(true)
        return null
        //ToDo handle error
      })
      .finally(() => setLoading(false))

    if (!result.data || !dataIsCorrect(result.data)) {
      setCanLoadMore(false)
      return
    }

    const prevItems = items
    let newItems = []
    result.data.getDialog.forEach((item) =>
      newItems.push({ data: item, height: 0 })
    )
    setItems([...newItems, ...prevItems])

    const numLoaded = result.data.getDialog.length
    if (prevItems.length > 0) setAnchorIndex(numLoaded)

    if (canLoadMore && result.data.getDialog.length < count) {
      setCanLoadMore(false)
    }
  }

  const ensureScroll = () => {
    if (
      messageContainerRef.current.scrollHeight <=
        messageContainerRef.current.offsetHeight &&
      canLoadMore
    ) {
      getMoreData(items[0].data._id)
    } else if (initialLoad) {
      setInitialLoad(false)
    }
  }

  const handleResize = (isLoaded) => {
    if (isLoaded) ensureScroll()
  }

  const handleClick = (e) => {
    if (!dialogData) return //ToDo: handle errror

    createMessageMutation({
      variables: {
        message: {
          dialogReceiverId,
          dialogInitiatorId,
          receiverId,
          receiverName,
          ad,
          text: e.target.value,
          senderId: thisUserId,
          senderName: thisUserName,
          dialogId,
        },
      },
    })
  }

  const handleScroll = async (e) => {
    if (messageContainerRef.current.scrollTop === 0 && canLoadMore) {
      getMoreData(items[0].data._id)
      return
    }
  }

  useEffect(() => {
    let isLoaded = true
    window.addEventListener('resize', () => handleResize(isLoaded))

    return () => {
      isLoaded = false
      window.removeEventListener('resize', () => handleResize(isLoaded))
    }
  }, [])

  useEffect(() => {
    if (items.length == 0 && dialogId) getMoreData()
  }, [dialogId])

  useEffect(() => {
    if (!messageContainerRef.current) return
    let nodeHeight = 0
    let i = 0
    let currentPos = 0

    while (i < anchorIndex) {
      nodeHeight = nodesRef.current[i].offsetHeight
      currentPos += nodeHeight
      i++
    }
    if (initialLoad) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    } else {
      messageContainerRef.current.scrollTop = currentPos
    }

    if (!dialogData) {
      const firstMessage = items[0].data
      //dialogReceiverId and dialogInitiatorId are the same in each message which belongs to this dialog
      let dialogReceiverId = firstMessage.dialogReceiverId
      let dialogInitiatorId = firstMessage.dialogInitiatorId
      let receiverId
      let receiverName
      let ad

      if (!dialogReceiverId && !dialogInitiatorId) {
        //ToDo: set error state
        console.log('Required params are not present')
        return
      }

      receiverId =
        firstMessage.receiverId === thisUserId
          ? firstMessage.senderId
          : firstMessage.receiverId

      receiverName =
        firstMessage.receiverName === thisUserName
          ? firstMessage.senderName
          : firstMessage.receiverName

      ad = firstMessage.ad

      if (dialogReceiverId && dialogInitiatorId) {
        setDialogData({
          dialogReceiverId,
          dialogInitiatorId,
          receiverId,
          receiverName,
          ad,
        })
        return
      }

      if (!dialogInitiatorId) {
        if (dialogReceiverId === firstMessage.receiverId) {
          dialogInitiatorId = firstMessage.senderId
        } else {
          dialogInitiatorId = firstMessage.receiverId
        }
        return
      }

      if (!dialogReceiverId) {
        if (dialogInitiatorId === firstMessage.receiverId) {
          dialogReceiverId = firstMessage.senderId
        } else {
          dialogReceiverId = firstMessage.receiverId
        }
      }

      setDialogData({
        dialogReceiverId,
        dialogInitiatorId,
        receiverId,
        receiverName,
        ad,
      })
    }
  }, [items, anchorIndex])

  useEffect(() => {
    if (messageContainerRef.current) ensureScroll()
  })

  useEffect(() => {
    if (dialogData) {
      setTitle(
        `Диалог с ${dialogData.receiverName} относительно ${dialogData.ad.wasteType.name}`
      )
    }
  }, [dialogData])

  let content = null
  if (loading) content = <PageLoadingCircle />
  if (getDialogError) content = <ErrorOverlay /> //ToDo: Add incorrect data error
  if (items.length > 0) {
    content = (
        <Grid container component={Paper} className={classes.chatSection}>
          <Grid item xs={12}>
            <List
              className={classes.dialog}
              ref={messageContainerRef}
              onScroll={(e) => handleScroll(e)}
            >
              {items.map((item, index) => {
                const message = item.data
                const refIndex = index
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
                  dateTime = `${hours}:${minutes.substring(
                    minutes.length - 2
                  )}, ${creationDate.toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: 'short',
                  })}`
                } else {
                  dateTime = `${hours}:${minutes.substring(minutes.length - 2)}`
                }
                return (
                  <ListItem
                    ref={(el) => {
                      nodesRef.current[index] = el
                    }}
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
                      <Grid item className={classes.messageContent}>
                        <ListItemText primary={message.text}></ListItemText>
                      </Grid>
                      <Grid item className={classes.messageDate}>
                        <ListItemText secondary={dateTime}></ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                )
              })}
            </List>
          </Grid>
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
  }

  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>{content}</Layout>
    </RedirectUnathenticatedUser>
  )
}
