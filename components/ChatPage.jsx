import React, { useState, useEffect, useRef } from 'react'
import {
  Fade,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Fab,
  Paper,
  Badge,
  Typography,
  makeStyles,
} from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Layout from './layouts/Layout.jsx'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useApolloClient, useMutation } from '@apollo/client'
import RedirectUnathenticatedUser from './uiParts/RedirectUnathenticatedUser.jsx'
import Snackbars from './uiParts/Snackbars.jsx'
import TextFieldFormik from './uiParts/formInputs/TextFieldFormik.jsx'
import { Formik, Form, Field } from 'formik'
import PageLoadingCircle from './uiParts/PageLoadingCircle.jsx'
import ButtonSubmittingCircle from './uiParts/ButtonSubmittingCircle.jsx'
import ErrorOverlay from './dialogs/ErrorOverlay.jsx'
import {
  CREATE_MESSAGE,
  GET_DIALOG,
  GET_UNREAD_DIALOG_IDS,
} from '../lib/graphql/queries/message'
import { chatSchema } from '../lib/validation'
import whitespaceRegex from '../lib/validation/regularExpressions'
import io from 'socket.io-client'

const messageContainerHeight = 400

const useStyles = makeStyles((theme) => ({
  chat: {
    width: '100%',
  },

  loading: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    color: theme.palette.grey['900'],
    background: theme.palette.secondary.main,
    borderRadius: theme.spacing(1),
    padding: 4,
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
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    maxWidth: '85%',
  },
  messageContent: {
    background: theme.palette.grey['600'],
    borderRadius: '1em',
    borderTopLeftRadius: 0,
    padding: theme.spacing(1),
  },
  messageDate: {
    marginRight: theme.spacing(1),
  },
  remainedSymbols: {
    marginLeft: theme.spacing(2),
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
  const [numUnreadUpdated, setNumUnreadUpdated] = useState(false)

  const [createMessageMutation] = useMutation(CREATE_MESSAGE)

  const dataIsCorrect = (dialogData) => {
    if (dialogData && dialogData.getDialog && dialogData.getDialog.length > 0) {
      return true
    }
    return false
  }
  const [dialogData, setDialogData] = useState(null)
  const [title, setTitle] = useState('Диалог | Recycl')

  const limit = 50 //number of messages to receive when quering database
  const charsLeft = 1000
  const messageContainerRef = useRef()
  const nodesRef = useRef([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [items, setItems] = useState([])
  const anchorIndex = useRef(0)
  const prevAnchorIndex = useRef(0)
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [severity, setSeverity] = useState('')
  const [notification, setNotification] = useState('')
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const [socket, setSocket] = useState(null)
  const [userIsTyping, setUserIsTyping] = useState(false)
  const [newMessage, setNewMessage] = useState(null)
  const [scrolledToBottom, setScrolledToBottom] = useState(true)

  //ToDo: refactor args names
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
        setSeverity('error')
        setNotification('Ошибка при загрузке данных')
        return null
      })
      .finally(() => setLoading(false))

    if (!result || !result.data || !dataIsCorrect(result.data)) {
      setCanLoadMore(false)
      return
    }

    const numLoaded = result.data.getDialog.length

    anchorIndex.current = numLoaded
    if (items.length > 0 && numLoaded > 0) {
      prevAnchorIndex.current = 0
    }

    let newItems = []
    for (let i = result.data.getDialog.length - 1; i >= 0; i--) {
      newItems.push(result.data.getDialog[i])
    }

    setItems([...newItems, ...items])

    if (canLoadMore && result.data.getDialog.length < count) {
      setCanLoadMore(false)
    }
  }

  const handleResize = (isLoaded) => {
    if (isLoaded) handleScroll()
  }

  const handleSubmit = async (values, options) => {
    if (!dialogData) return
    const { setSubmitting, resetForm } = options

    setSubmitting(true)
    await createMessageMutation({
      variables: {
        message: {
          ...dialogData,
          text: values.message,
          senderId: thisUserId,
          senderName: thisUserName,
          dialogId,
        },
      },
    })
      .then((result) => {
        //emit newMessage event after user has sent new message
        if (socket && result && result.data)
          socket.emit('messageAdded', result.data)
        resetForm()
      })
      .catch((error) => {
        setSeverity('error')
        setNotification('Ошибка при отправке сообщения')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const isScrolledToBottom = () => {
    const messageContainer = messageContainerRef.current
    const currScroll = messageContainer.scrollTop
    if (
      messageContainer.scrollHeight -
        currScroll -
        messageContainer.clientHeight <
      1
    ) {
      return true
    }
    return false
  }

  const handleScroll = (e) => {
    const messageContainer = messageContainerRef.current
    if (!messageContainer) return

    const currScroll = messageContainer.scrollTop
    if (currScroll === 0 && canLoadMore) {
      getMoreData(items[0]._id)
      return
    } else if (initialLoad) {
      setInitialLoad(false)
    }

    //check if messageContainer is scrolled to bottom
    if (isScrolledToBottom()) {
      if (showScrollBottom) setShowScrollBottom(false)
      if (newMessage) setNewMessage(null)
      if (!scrolledToBottom) setScrolledToBottom(true)
    } else {
      if (scrolledToBottom) setScrolledToBottom(false)
      if (
        messageContainer.scrollHeight - currScroll >
          2 * messageContainer.offsetHeight &&
        !showScrollBottom
      ) {
        setShowScrollBottom(true)
      }
    }
  }
  const handleScrollBottomClick = () => {
    const messageContainer = messageContainerRef.current
    messageContainer.style.scrollBehavior = 'smooth'
    messageContainer.scrollTop = messageContainer.scrollHeight
    messageContainer.style.scrollBehavior = 'auto'
  }

  const socketInitializer = async () => {
    await fetch('/api/socketio')
    const newSocket = io({ autoConnect: false })

    newSocket.off('newMessage').on('newMessage', (message) => {
      if (isScrolledToBottom()) {
        setScrolledToBottom(true)
      } else {
        setScrolledToBottom(false)
      }
      setNewMessage(message.createMessage)

      setItems((prevItems) => [...prevItems, message.createMessage])
    })

    newSocket.off('typing').on('typing', () => {
      setUserIsTyping(true)
    })
    setSocket(newSocket)
  }

  useEffect(() => {
    //start webSocket server if it's not already started
    socketInitializer()

    //add resize listener
    let isLoaded = true
    window.addEventListener('resize', () => handleResize(isLoaded))

    return () => {
      isLoaded = false
      window.removeEventListener('resize', () => handleResize(isLoaded))
    }
  }, [])

  useEffect(() => {
    if (!session || !socket) return
    if (!socket.connected) {
      socket.auth = { userId: session.id }
      socket.connect()
    }

    return () => {
      if (socket && socket.connected) socket.disconnect()
    }
  }, [session, socket])

  useEffect(() => {
    if (!userIsTyping) return
    let isActive = true

    setTimeout(() => {
      if (isActive) {
        setUserIsTyping(false)
      }
    }, 700)

    return () => {
      isActive = false
    }
  }, [userIsTyping])

  //load initial data
  useEffect(() => {
    if (dialogId && items.length == 0) getMoreData()
  }, [dialogId])

  useEffect(() => {
    if (items.length === 0) return

    //set dialog data to enable sending messages
    if (!dialogData) {
      const firstMessage = items[0]
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

      ad = firstMessage.ad._id

      setTitle(
        `Диалог с ${receiverName} относительно ${firstMessage.ad.wasteType.name}`
      )

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
  }, [items])

  //make sure that message container has scroll bar
  //to enable user to load more data when he scrolls
  useEffect(() => {
    if (!messageContainerRef.current) return
    let nodeHeight = 0
    let i = 0
    let currentPos = 0

    //calculate anchor scroll top position
    while (i < anchorIndex.current) {
      nodeHeight = nodesRef.current[i].offsetHeight
      currentPos += nodeHeight
      i++
    }

    //scroll to desired position
    if (anchorIndex.current !== prevAnchorIndex.current) {
      messageContainerRef.current.scrollTop = currentPos
      prevAnchorIndex.current = anchorIndex.current
    } else if (
      initialLoad ||
      (newMessage && newMessage.senderId === thisUserId) ||
      (newMessage && newMessage.senderId !== thisUserId && scrolledToBottom)
    ) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    } else if (
      newMessage &&
      newMessage.senderId !== thisUserId &&
      !scrolledToBottom &&
      !showScrollBottom
    ) {
      setShowScrollBottom(true)
    }
    handleScroll()
  }, [items])

  //update unread dialogs counter
  useEffect(() => {
    if (!numUnreadUpdated && dialogData) {
      client.refetchQueries({ include: [GET_UNREAD_DIALOG_IDS] }).then(() => {
        setNumUnreadUpdated(true)
      })
    }
  }, [dialogData])

  //ToDo: Add no data overlay
  let content = null
  if (items.length == 0 && loading) content = <PageLoadingCircle />
  if (items.length == 0 && getDialogError) content = <ErrorOverlay />
  if (items.length > 0) {
    content = (
      <>
        {!!notification && (
          <Snackbars
            open={!!notification}
            handleClose={() => {
              setNotification('')
              setSeverity('')
            }}
            message={notification}
            severity={severity}
          />
        )}
        <Box component={Paper} className={classes.chat}>
          <Box style={{ position: 'relative', paddingBottom: 56 }}>
            {loading && (
              <Typography
                component="span"
                variant="body2"
                className={classes.loading}
              >
                Загрузка...
              </Typography>
            )}
            <List
              className={classes.dialog}
              ref={messageContainerRef}
              onScroll={(e) => handleScroll(e)}
            >
              {items.map((message, index) => {
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
                    <Box className={classes.message}>
                      <Box className={classes.messageContent}>
                        <ListItemText primary={message.text}></ListItemText>
                      </Box>
                      <Box className={classes.messageDate}>
                        <ListItemText secondary={dateTime}></ListItemText>
                      </Box>
                    </Box>
                  </ListItem>
                )
              })}
            </List>
            {userIsTyping && (
              <Fade
                in={userIsTyping}
                style={{ position: 'absolute', bottom: 16, left: 16 }}
              >
                <Typography variant="body2" color="textSecondary">
                  Печатает...
                </Typography>
              </Fade>
            )}
            {showScrollBottom && (
              <Fade in={showScrollBottom}>
                <Fab
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 36,
                  }}
                  color="secondary"
                  size="small"
                  aria-label="scroll to bottom"
                  onClick={() => {
                    handleScrollBottomClick()
                  }}
                >
                  {newMessage ? (
                    <Badge
                      color="error"
                      badgeContent=" "
                      overlap="circular"
                      variant="dot"
                    >
                      <ArrowDownwardIcon />
                    </Badge>
                  ) : (
                    <ArrowDownwardIcon />
                  )}
                </Fab>
              </Fade>
            )}
          </Box>

          <Box style={{ alignItems: 'center', padding: '16px' }}>
            <Formik
              enableReinitialize
              initialValues={{ message: '' }}
              validationSchema={chatSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                await handleSubmit(values, {
                  setSubmitting,
                  resetForm,
                })
              }}
            >
              {({ isSubmitting, values, errors, setFieldValue, setErrors }) => {
                if (errors.message) setErrors({})
                let availableSymbols = charsLeft - values.message.length
                availableSymbols = availableSymbols >= 0 ? availableSymbols : 0

                if (values.message.length > charsLeft) {
                  setFieldValue(
                    'message',
                    values.message.substring(0, charsLeft),
                    false
                  )
                }

                return (
                  <Form
                    onChange={(e) => {
                      if (socket && dialogData && dialogData.receiverId) {
                        socket.emit('userIsTyping', {
                          receiverId: dialogData.receiverId,
                        })
                      }
                    }}
                  >
                    <Box>
                      <Field
                        component={TextFieldFormik}
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        name="message"
                        id="message"
                        label="Напишите что-нибудь"
                      />
                    </Box>
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className={classes.remainedSymbols}
                      >
                        Осталось: {availableSymbols}
                      </Typography>
                    </Box>
                    <Box>
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={
                          values.message.replace(whitespaceRegex, '') === '' ||
                          isSubmitting
                        }
                      >
                        Отправить
                        {isSubmitting && <ButtonSubmittingCircle />}
                      </Button>
                    </Box>
                  </Form>
                )
              }}
            </Formik>
          </Box>
        </Box>
      </>
    )
  }

  return (
    <RedirectUnathenticatedUser>
      <Layout title={title}>{content}</Layout>
    </RedirectUnathenticatedUser>
  )
}
