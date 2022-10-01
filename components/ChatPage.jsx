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
import { InView } from 'react-intersection-observer'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import CheckIcon from '@material-ui/icons/Check'
import DoneAllIcon from '@material-ui/icons/DoneAll'
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
import NoDataOverlay from './dialogs/NoDataOverlay.jsx'
import {
  CREATE_MESSAGE,
  UPDATE_MESSAGE,
  GET_DIALOG,
  GET_UNREAD_DIALOG_IDS,
} from '../lib/graphql/queries/message'
import { chatSchema } from '../lib/validation'
import whitespaceRegex from '../lib/validation/regularExpressions'
import io from 'socket.io-client'

const messageContainerHeight = 400

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    width: '100%',
  },

  dialogWrapper: {
    position: 'relative',
    paddingBottom: theme.spacing(7),
  },

  dialog: {
    height: messageContainerHeight,
    overflowY: 'auto',
  },

  loadingIndicator: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
    color: theme.palette.grey['900'],
    background: theme.palette.secondary.main,
    borderRadius: theme.spacing(1),
    padding: 4,
  },
  typingIndicator: {
    position: 'absolute',
    bottom: theme.spacing(1),
    left: theme.spacing(2),
  },
  newMessageIndicator: {
    position: 'absolute',
    bottom: 0,
    right: theme.spacing(4),
  },
  checkmark: { color: '#adce5d', marginLeft: theme.spacing(1) },
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
  messageInfo: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: theme.spacing(1),
    marginRight: theme.spacing(1),

    '& > :first-child': {
      marginRight: 4,
    },
  },
  //aligns messages sent by the other user to the right
  right: {
    justifyContent: 'flex-end',
    '& $message': {
      alignItems: 'flex-end',
    },
  },
  remainedSymbolsIndicator: {
    marginLeft: theme.spacing(2),
  },
}))

export default function ChatPage(props) {
  const classes = useStyles()
  const { data: session } = useSession()
  const thisUserId = session && session.id ? session.id : ''
  const thisUserName = session && session.user ? session.user.name : ''
  const { dialogId } = props
  const apolloClient = useApolloClient()
  const [loading, setLoading] = useState(false) //Shows if data is loading
  const [messagesError, setMessagesError] = useState('') //Shows if error occurred while getting
  const [createMessageMutation] = useMutation(CREATE_MESSAGE)
  const [updateMessageMutation] = useMutation(UPDATE_MESSAGE)

  const dataIsCorrect = (data) => {
    if (data && data.getDialog && data.getDialog.length > 0) {
      return true
    }
    return false
  }
  const [dialogData, setDialogData] = useState(null)
  const [title, setTitle] = useState('Диалог | Recycl')
  const numMessagesToLoad = 50 //Number of messages to load when querying the database.
  const remainedSymbols = 1000 //Max number of symbols in a message.
  const messageContainerRef = useRef()
  const nodesRef = useRef([]) //Dom nodes of rendered messages.
  //initialLoad is true untill loaded message data is not enogh for the message container to have vertical scrollbar.
  //As soon as the message container can be vertically scrolled this state is set to false.
  const [initialLoad, setInitialLoad] = useState(true)
  const [items, _setItems] = useState([]) //Loaded message data.
  const itemsRef = useRef(items)
  const setItems = (data) => {
    itemsRef.current = data
    _setItems(data)
  }
  const anchorIndex = useRef(0) //Index of the topmost message visisble in the message container.
  const prevAnchorIndex = useRef(0)
  const canLoadMore = useRef(true) //Shows if there is additional data in the database that can be loaded.
  const [severity, setSeverity] = useState('') //Notification severity.
  const [notification, setNotification] = useState('')
  const [showScrollBottom, setShowScrollBottom] = useState(false) //Whether to show a button to scroll to the bottom of the message container.
  const [socket, setSocket] = useState(null)
  const [userIsTyping, setUserIsTyping] = useState(false)
  const [newMessage, setNewMessage] = useState(null) //New message received from the other user.
  const [scrolledToBottom, setScrolledToBottom] = useState(true)

  /**
   * Loads paginated data from database and sets them into the state.
   *
   * You don't need to provide offset at initial load
   * but you have to provide it further or you'll allways retrieve the same data
   *@param {number} limit  number of messages to load when quering database
   *@param {string} offset id of the first message in items array
   */
  const getMoreData = async function (offset = '', limit = numMessagesToLoad) {
    if (!dialogId || !canLoadMore.current || loading) return

    setLoading(true)
    const result = await apolloClient
      .query({
        query: GET_DIALOG,
        variables: {
          id: dialogId,
          offset,
          limit,
        },
        fetchPolicy: 'network-only',
      })
      .then((result) => {
        return result
      })
      .catch((error) => {
        setMessagesError(true)
        setSeverity('error')
        setNotification('Ошибка при загрузке данных')
        return null
      })
      .finally(() => setLoading(false))
    if (
      canLoadMore.current &&
      (!result || !result.data || !dataIsCorrect(result.data))
    ) {
      canLoadMore.current = false
      return
    }

    const numLoaded = result.data.getDialog.length

    anchorIndex.current = numLoaded
    if (itemsRef.current.length > 0 && numLoaded > 0) {
      prevAnchorIndex.current = 0
    }

    let newItems = []
    for (let i = numLoaded - 1; i >= 0; i--) {
      newItems.push(result.data.getDialog[i])
    }

    setItems([...newItems, ...items])

    if (canLoadMore.current && numLoaded < numMessagesToLoad) {
      canLoadMore.current = false
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
    if (currScroll === 0 && canLoadMore.current) {
      getMoreData(itemsRef.current[0]._id)
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

    newSocket.off('viewedMessage').on('viewed', (id) => {
      setItems((prevItems) => {
        const newItems = [...prevItems]
        let updatedItem
        let index

        for (let i = newItems.length - 1; i >= 0; i--) {
          if (newItems[i]._id === id) {
            updatedItem = { ...newItems[i] }
            index = i
            break
          }
        }

        if (!updatedItem) return prevItems

        updatedItem.viewed = true
        newItems[index] = updatedItem
        itemsRef.current = newItems
        _setItems(newItems)
        return newItems
      })
    })
    setSocket(newSocket)
  }

  const dialogDataInitializer = () => {
    if (items.length === 0) return

    const firstMessage = items[0]
    let dialogReceiverId = firstMessage.dialogReceiverId
    let dialogInitiatorId = firstMessage.dialogInitiatorId
    let receiverId
    let receiverName
    let ad

    if (!dialogReceiverId && !dialogInitiatorId) {
      setSeverity('error')
      setNotification('Неизвестная ошибка')
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

  const setDesiredScrollPos = () => {
    let nodeHeight = 0
    let i = 0
    let currentPos = 0

    //calculate anchor's element scroll top position
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
  }

  const calculateDateTime = (message) => {
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
    return dateTime
  }

  useEffect(() => {
    //start webSocket server if it's not already started
    if (!socket) socketInitializer()

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

    socket.auth = { userId: session.id }
    socket.connect()

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

  //start loading message data after getting id of the dialog
  useEffect(() => {
    if (dialogId && items.length == 0) getMoreData()
  }, [dialogId])

  useEffect(() => {
    //set dialog data to enable sending messages
    if (!dialogData) dialogDataInitializer()

    //make sure that message container has vertical scroll bar
    //to enable user to scroll up to load more data
    if (!messageContainerRef.current) return
    setDesiredScrollPos()
    handleScroll()
  }, [items])

  useEffect(() => {
    //Update title
    if (dialogData) {
      const firstMessage = items[0]
      setTitle(
        `Диалог с ${dialogData.receiverName} относительно ${firstMessage.ad.wasteType.name}`
      )
    }
  }, [dialogData])

  let content = <NoDataOverlay />
  if ((items.length == 0 && loading) || !socket) content = <PageLoadingCircle />
  if (items.length == 0 && messagesError) content = <ErrorOverlay />
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
        <Box component={Paper} className={classes.chatContainer}>
          <Box className={classes.dialogWrapper}>
            {loading && (
              <Typography
                component="span"
                variant="body2"
                className={classes.loadingIndicator}
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
                const dateTime = calculateDateTime(message)

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
                    <InView
                      as="div"
                      onChange={(inView, entry) => {
                        if (
                          inView &&
                          message.receiverId === thisUserId &&
                          !message.viewed
                        ) {
                          const id = items[index]._id
                          updateMessageMutation({
                            variables: { id, payload: { viewed: true } },
                          })
                            .then((result) => {
                              if (
                                !result.data ||
                                !result.data.updateMessage ||
                                !result.data.updateMessage._id
                              ) {
                                return
                              }
                              const newItems = [...items]
                              const updatedItem = { ...newItems[index] }
                              updatedItem.viewed = true
                              newItems[index] = updatedItem
                              setItems(newItems)
                              socket.emit('viewedMessage', {
                                receiverId: dialogData.receiverId,
                                messageId: result.data.updateMessage._id,
                              })
                            })
                            .catch((error) => {})
                        }
                      }}
                      className={classes.message}
                    >
                      <Box className={classes.messageContent}>
                        <ListItemText primary={message.text}></ListItemText>
                      </Box>
                      <Box className={classes.messageInfo}>
                        <ListItemText
                          style={{
                            textAlign: 'right',
                          }}
                          secondaryTypographyProps={{
                            style: {
                              display: 'flex',
                            },
                          }}
                          secondary={
                            message.senderId === thisUserId &&
                            (message.viewed ? (
                              <>
                                <span>{`${dateTime}`}</span>
                                <DoneAllIcon
                                  fontSize="small"
                                  className={classes.checkmark}
                                />
                              </>
                            ) : (
                              <>
                                <span>{`${dateTime}`}</span>
                                <CheckIcon
                                  fontSize="small"
                                  className={classes.checkmark}
                                />
                              </>
                            ))
                          }
                        ></ListItemText>
                      </Box>
                    </InView>
                  </ListItem>
                )
              })}
            </List>
            {userIsTyping && (
              <Fade
                in={userIsTyping}
                className={clsx({
                  [classes.typingIndicator]: true,
                  [classes.messageContent]: true,
                })}
              >
                <Typography variant="body2" color="textSecondary">
                  Печатает...
                </Typography>
              </Fade>
            )}
            {showScrollBottom && (
              <Fade
                in={showScrollBottom}
                className={classes.newMessageIndicator}
              >
                <Fab
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
                let availableSymbols = remainedSymbols - values.message.length
                availableSymbols = availableSymbols >= 0 ? availableSymbols : 0

                if (values.message.length > remainedSymbols) {
                  setFieldValue(
                    'message',
                    values.message.substring(0, remainedSymbols),
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
                        className={classes.remainedSymbolsIndicator}
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
