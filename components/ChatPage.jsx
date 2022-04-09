import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  createRef,
} from 'react'
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

const useStyles = makeStyles({
  chatSection: {
    width: '100%',
  },

  dialog: {
    height: '70vh',
    overflowY: 'auto',
    position: 'relative', //should be change to absolute
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
  const client = useApolloClient()
  const [gettingDialog, setGettingDialog] = useState(false)
  const [getDialogError, setGetDialogError] = useState('')
  const [dialogData, setDialogData] = useState([])
  const [
    createMessageMutation,
    { loading: creatingMessage, error: createMessageError, data: messageData },
  ] = useMutation(CREATE_MESSAGE)

  const dataIsCorrect = () => {
    if (dialogData && dialogData.getDialog && dialogData.getDialog.length > 0) {
      return true
    }
    return false
  }

  const [initialLoad, setInitialLoad] = useState(true)
  const scrollOffset = 50 //pixels
  const numItemsToRenderForward = 1
  const numItemsToRenderBackward = 1
  const limit = 1 //num messages to receive when quering database
  const messageContainerRef = useRef()
  const nodesRef = useRef([])
  const [items, setItems] = useState([])
  const [runwayHeight, setRunwayHeight] = useState(0)
  const [firstItemToRender, setFirstItemToRender] = useState(0)
  const [lastItemToRender, setLastItemToRender] = useState(0)
  const [anchorEl, setAnchorEl] = useState({
    index: 0,
    offset: 0,
    scrollTop: 0,
  })
  const [canLoadMore, setCanLoadMore] = useState(true)
  //load initial dialog data
  useEffect(() => handleScroll(), [])

  //add additional loaded data to items
  useEffect(() => {
    if (dataIsCorrect()) {
      const newItems = [...items]
      dialogData.getDialog.forEach((item) =>
        newItems.push({ data: item, height: 0 })
      )
      setItems(newItems)

      if (dialogData.getDialog.length < limit) setCanLoadMore(false)
    }
  }, [dialogData])

  //This runs after all dom manipulations
  //Position all rendered elements
  //and measure new height of runway
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    if (items.length === 0) return
    let i = anchorEl.index
    let currentPos = anchorEl.offsetHeight //position from the top of the message container
    let newRunwayHeight = 0
    let node
    let nodeHeight

    while (i <= lastItemToRender) {
      node = itemsRef[i].current
      nodeHeight = node.offsetHeight
      //ToDo maybe add animation when positioning elements
      node.style.top = currentPos
      currentPos += nodeHeight
      if (!items[i].height) {
        items[i].height = nodeHeight
        newRunwayHeight += items[i].height
      }
      i++
    }

    //reset index and position
    i = anchorEl.index
    currentPos = anchorEl.offsetHeight
    console.log('items length')
    console.log(items.length)
    while (i >= firstItemToRender) {
      node = itemsRef[i].current
      console.log(node)
      nodeHeight = itemsRef[i].current.offsetHeight
      //ToDo maybe add animation when positioning elements
      node.style.top = currentPos - nodeHeight
      currentPos -= nodeHeight
      if (!items[i].height) {
        items[i].height = nodeHeight
        newRunwayHeight += items[i].height
      }
      i--
    }

    newRunwayHeight += runwayHeight
    setRunwayHeight(newRunwayHeight)
    const messageContainerNode = messageContainerRef.current
    messageContainerNode.style.height = newRunwayHeight + 'px'
    if (initialLoad) {
      messageContainerNode.scrollTop = newRunwayHeight
      setInitialLoad(false)
    } else {
      messageContainerNode.scrollTop = anchorEl.scrollTop
    }
  }, [items])

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

  //ToDo: scroll to the end of message container on initial load
  const handleScroll = async (e) => {
    if (typeof window === 'undefined') return
    if (gettingDialog) return

    const currScroll = messageContainerRef.current
      ? messageContainerRef.current.scrollTop
      : 0
    let newAnchorScrollTop = anchorEl.scrollTop
    let newAnchorIndex = anchorEl.index
    let newAnchorOffset = 0

    const delta = currScroll - newAnchorScrollTop
    const offset = items.length ? items[items.length - 1]._id : '' //offset in items to load

    if (items.length === 0 && canLoadMore) {
      const numLoaded = await loadMoreData(offset)
      setLastItemToRender(numLoaded)
      if (numLoaded < limit) setCanLoadMore(false)
    } else if (delta === 0) return

    //scroll forward
    if (delta > 0) {
      while (
        newAnchorIndex < items.length - 1 &&
        newAnchorScrollTop < currScroll
      ) {
        newAnchorScrollTop += items[newAnchorIndex++].height
      }
      setFirstItemToRender(
        newAnchorIndex - numItemsToRenderBackward >= 0
          ? newAnchorIndex - numItemsToRenderBackward
          : 0
      )
      setLastItemToRender(
        newAnchorIndex + numItemsToRenderForward <= items.length - 1
          ? newAnchorIndex + numItemsToRenderForward
          : items.length - 1
      )
    }
    //scroll backward
    if (delta < 0) {
      while (newAnchorIndex >= 0 && newAnchorScrollTop > currScroll) {
        newAnchorScrollTop -= items[newAnchorIndex--].height
      }

      let numNewMessages = 0

      if (newAnchorScrollTop > currScrollTop) {
        //loadMoreData
        numNewMessages = await loadMoreData(offset)
      }
      setFirstItemToRender(
        newAnchorIndex - numItemsToRenderForward >= 0
          ? newAnchorIndex - numItemsToRenderForward
          : 0
      )
      setLastItemToRender(
        newAnchorIndex + numItemsToRenderBackward <=
          items.length + numNewMessages - 1
          ? newAnchorIndex + numItemsToRenderBackward
          : items.length + numNewMessages - 1
      )
    }
    setAnchorEl({
      index: newAnchorIndex,
      offset: newAnchorOffset, //ToDo: offset is not set correctly here
      scrollTop: newAnchorScrollTop,
    })
  }

  const loadMoreData = async function (offset) {
    setGettingDialog(true)
    client
      .query({
        query: GET_DIALOG,
        variables: {
          id: dialogId,
          offset: offset,
          limit,
        },
      })
      .then((result) => {
        setDialogData(result.data)
        return result.data.getDialog.length
      })
      .catch((error) => {
        setGetDialogError(true)
        console.log('error in loading data')
        console.log(error)
        return 0
        //ToDo handle error
      })
      .finally(() => setGettingDialog(false))
  }

  let content = null
  if (gettingDialog) content = <PageLoadingCircle />
  if (getDialogError) content = <ErrorOverlay /> //ToDo: Add incorrect data error
  if (dataIsCorrect()) {
    let i = firstItemToRender
    const itemsToRender = []
    while (i <= lastItemToRender) {
      itemsToRender.push(items[i])
      i++
    }
    content = (
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={12}>
          <List
            className={classes.dialog}
            ref={messageContainerRef}
            onScroll={() => handleScroll(e)}
          >
            {canLoadMore && (
              <ListItem
                key="scrollOffset"
                style={{
                  height: `${scrollOffset}px`,
                  position: 'absolute',
                  top: `-${scrollOffset}px`,
                }}
              />
            )}
            {itemsToRender.map((item, index) => {
              const message = item.data
              const refIndex = index + firstItemToRender
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
                  ref={(el) => (itemsRef.current[refIndex] = el)}
                  key={message._id}
                  className={clsx({
                    [classes.right]: message.senderId !== thisUserId,
                  })}
                  style={{ position: 'absolute' }}
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
  }

  return (
    <RedirectUnathenticatedUser>
      <Layout title="Диалог с ... относительно ... | Recycl">{content}</Layout>
    </RedirectUnathenticatedUser>
  )
}
