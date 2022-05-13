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
  Typography,
  makeStyles,
} from '@material-ui/core'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Layout from './layouts/Layout.jsx'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useApolloClient, useMutation, useSubscription } from '@apollo/client'
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
  ON_MESSAGED_ADDED,
  GET_UNREAD_DIALOG_IDS,
} from '../lib/graphql/queries/message'
import { chatSchema } from '../lib/validation'
import whitespaceRegex from '../lib/validation/regularExpressions'

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

  const [
    createMessageMutation,
    { loading: creatingMessage, error: createMessageError, data: messageData },
  ] = useMutation(CREATE_MESSAGE)

  const { data, loading: subscriptionLoading } = useSubscription(
    ON_MESSAGED_ADDED,
    {
      variables: {
        userId: thisUserId,
      },
    }
  )

  const dataIsCorrect = (dialogData) => {
    if (dialogData && dialogData.getDialog && dialogData.getDialog.length > 0) {
      return true
    }
    return false
  }
  const [dialogData, setDialogData] = useState(null)
  const [title, setTitle] = useState('Диалог | Recycl')

  const limit = 1 //num messages to receive when quering database
  const charsLeft = 1000
  const messageContainerRef = useRef()
  const nodesRef = useRef([])
  const [initialLoad, setInitialLoad] = useState(true)
  const [items, setItems] = useState([])
  const [anchorIndex, setAnchorIndex] = useState(0)
  const [canLoadMore, setCanLoadMore] = useState(true)
  const [severity, setSeverity] = useState('')
  const [notification, setNotification] = useState('')
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const [prevScroll, setPrevScroll] = useState(0)
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
      messageContainerRef.current &&
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

  const handleSubmit = async (values, options) => {
    if (!dialogData) return
    const { setSubmitting, resetForm } = options

    setSubmitting(true)
    createMessageMutation({
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
      .then((data) => {
        resetForm()
      })
      .catch((error) => {
        setSeverity('error')
        setNotification('Не удалось отправить сообщение')
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleScroll = async (e) => {
    const messageContainer = messageContainerRef.current
    const currScroll = messageContainer.scrollTop
    if (currScroll === 0 && canLoadMore) {
      getMoreData(items[0].data._id)
      return
    }

    if (
      messageContainer.scrollHeight -
        currScroll -
        messageContainer.clientHeight <
        1 &&
      showScrollBottom
    ) {
      setShowScrollBottom(false)
    } else {
      const delta = currScroll - prevScroll
      if (delta > messageContainer.scrollHeight && !showScrollBottom)
        setShowScrollBottom(true)
    }

    setPrevScroll(currScroll)
  }

  const handleScrollBottomClick = () => {
    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight
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
  }, [items, anchorIndex])

  useEffect(() => {
    if (messageContainerRef.current) ensureScroll()
  })

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
              {items.map((item, index) => {
                const message = item.data
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
                  <ArrowDownwardIcon />
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
                const options = {
                  setSubmitting,
                  resetForm,
                }
                await handleSubmit(values, options)
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
                  <Form>
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
