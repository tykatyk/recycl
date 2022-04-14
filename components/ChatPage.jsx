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
import { useRouter } from 'next/router'
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
    // height: '70vh',
    height: 400,
    overflowY: 'auto',
    position: 'relative', //should be changed to absolute
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
    minHeight: 450,
  },
  fromMe: { alignItems: 'flex-end' },
  runway: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
  },
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
  const router = useRouter()
  const { dialogId } = router.query
  // const { dialogId } = props
  const client = useApolloClient()
  const [gettingDialog, setGettingDialog] = useState(false)
  const [getDialogError, setGetDialogError] = useState('')
  const [dialogData, setDialogData] = useState(null)
  const [
    createMessageMutation,
    { loading: creatingMessage, error: createMessageError, data: messageData },
  ] = useMutation(CREATE_MESSAGE)

  const dataIsCorrect = () => {
    // console.log(dialogData)
    if (dialogData && dialogData.getDialog && dialogData.getDialog.length > 0) {
      return true
    }
    return false
  }

  const [initialLoad, setInitialLoad] = useState(true)
  const numItemsToRenderForward = 1
  const numItemsToRenderBackward = 1
  const limit = 1 //num messages to receive when quering database
  const messageContainerRef = useRef()
  const runwayRef = useRef()
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
  useEffect(() => {
    if (!dialogId) return
    loadMoreData()
  }, [dialogId])

  //add additional loaded data to items
  useEffect(() => {
    if (!dataIsCorrect()) return

    const newItems = [...items]
    dialogData.getDialog.forEach((item) =>
      newItems.push({ data: item, height: 0 })
    )
    setItems(newItems)

    if (dialogData.getDialog.length < limit) setCanLoadMore(false)
  }, [dialogData])

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

  //This runs after all dom manipulations
  //Position all rendered elements
  //and measure new height of runway
  useLayoutEffect(() => {
    if (items.length === 0) return
    let i = anchorEl.index
    //position from the top of the message container
    let currentPos = anchorEl.scrollTop - anchorEl.offset
    let newRunwayHeight = 0
    let node
    let nodeHeight

    if (initialLoad) {
      if (
        messageContainerRef.current.scrollHeight <=
          messageContainerRef.current.offsetHeight &&
        canLoadMore
      ) {
        loadMoreData(items[items.length - 1].data._id) //ToDo set offset
        return
      }

      i = 0 //maybe shouldn't set i, since anchor index is already 0
      currentPos = 0

      if (!canLoadMore) {
        setInitialLoad(false)
        //scroll to bottom
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight
        return
      }

      //this counting can be done once
      while (
        i < items.length &&
        currentPos < messageContainerRef.current.offsetHeight
      ) {
        node = nodesRef.current[i]
        currentPos += node.offsetHeight
        i++ //index of last visible item in message container
      }

      if (
        items.length <
        i + numItemsToRenderForward + numItemsToRenderBackward
      ) {
        loadMoreData(items[items.length - 1].data._id) //ToDo: set offset, change limit
        return
      }

      setInitialLoad(false)
      //scroll to bottom
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight

      return
    }

    while (i <= lastItemToRender) {
      node = nodesRef.current[i]
      nodeHeight = node.offsetHeight
      //ToDo maybe add animation when positioning elements
      node.style.top = currentPos
      currentPos -= nodeHeight
      if (!items[i].height) {
        items[i].height = nodeHeight
        newRunwayHeight += items[i].height
      }
      i++
    }

    //reset index and position
    i = anchorEl.index
    currentPos = anchorEl.offsetHeight

    while (i >= firstItemToRender) {
      node = nodesRef.current[i]
      nodeHeight = nodesRef.current[i].offsetHeight
      //ToDo maybe add animation when positioning elements
      node.style.top = currentPos + nodeHeight
      currentPos += nodeHeight
      if (!items[i].height) {
        items[i].height = nodeHeight
        newRunwayHeight += items[i].height
      }
      i--
    }

    newRunwayHeight += runwayHeight
    setRunwayHeight(newRunwayHeight)
  }, [items, canLoadMore])

  const handleClick = (e) => {
    if (!dialogId) return //ToDo: handle errror
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
    // if (typeof window === 'undefined') return
    if (gettingDialog) return
    const currScroll = messageContainerRef.current
      ? messageContainerRef.current.scrollTop
      : 0
    let prevScroll = anchorEl.scrollTop
    let anchorIndex = anchorEl.index
    let anchorOffset = anchorEl.offset

    const delta = currScroll - prevScroll
    const offset = items.length ? items[items.length - 1].data._id : '' //offset in items to load
    //console.log(delta)

    //we are at the top of the dialog and want to load more messages
    if (
      canLoadMore &&
      items.length > 0 &&
      messageContainerRef.current.scrollTop == 0 //ToDo potential problem
    ) {
      const numNewMessages = await loadMoreData(offset)
      setAnchorEl({
        index: 0,
        offset: 0,
        scrollTop: 0,
      })

      setFirstItemToRender(
        anchorIndex - numItemsToRenderForward >= 0
          ? anchorIndex - numItemsToRenderForward
          : 0
      )
      setLastItemToRender(
        anchorIndex + numItemsToRenderBackward <=
          items.length + numNewMessages - 1
          ? anchorIndex + numItemsToRenderBackward
          : items.length + numNewMessages - 1
      )
      return
    }

    let anchorTop = anchorEl.scrollTop - anchorEl.offset - delta

    //scroll forward
    if (delta > 0) {
      while (anchorIndex < items.length - 1 && anchorTop < currScroll) {
        anchorTop += items[anchorIndex++].height
      }

      if (anchorIndex > items.length - 1) anchorIndex--

      if (anchorTop > currScroll) {
        anchorOffset = items[anchorIndex].height - (anchorTop - currScroll)
      } else {
        anchorOffset = 0
      }

      setFirstItemToRender(
        anchorIndex - numItemsToRenderBackward >= 0
          ? anchorIndex - numItemsToRenderBackward
          : 0
      )
      setLastItemToRender(
        anchorIndex + numItemsToRenderForward <= items.length - 1
          ? anchorIndex + numItemsToRenderForward
          : items.length - 1
      )
    }
    //scroll backward
    if (delta < 0) {
      anchorTop += items[anchorIndex].height

      while (anchorIndex >= 0 && anchorTop > currScroll) {
        anchorTop -= items[anchorIndex--].height
      }
      if (anchorIndex < 0) anchorIndex = 0
      if (anchorTop < currScroll) {
        anchorOffset = currScroll - anchorTop
      } else {
        anchorOffset = 0
      }

      setFirstItemToRender(
        anchorIndex - numItemsToRenderForward >= 0
          ? anchorIndex - numItemsToRenderForward
          : 0
      )
      setLastItemToRender(
        anchorIndex + numItemsToRenderBackward <= items.length - 1
          ? anchorIndex + numItemsToRenderBackward
          : items.length - 1
      )
    }
    setAnchorEl({
      index: anchorIndex,
      offset: anchorOffset, //ToDo: offset is not set correctly here
      scrollTop: currScroll,
    })
  }

  const loadMoreData = async function (offset = '', count = limit) {
    if (!canLoadMore) return
    setGettingDialog(true)
    return client
      .query({
        query: GET_DIALOG,
        variables: {
          id: dialogId,
          offset,
          limit: count,
        },
      })
      .then((result) => {
        setDialogData(result.data)
        const numLoaded = result.data.getDialog.length

        if (initialLoad) setLastItemToRender(numLoaded + items.length - 1)
        if (canLoadMore && numLoaded < count) setCanLoadMore(false)

        return numLoaded
      })
      .catch((error) => {
        setGetDialogError(true)
        console.log('error in loading data')
        console.log(JSON.stringify(error, null, 2))
        return 0
        //ToDo handle error
      })
      .finally(() => setGettingDialog(false))
  }

  let content = null
  if (gettingDialog) content = <PageLoadingCircle />
  if (getDialogError) content = <ErrorOverlay /> //ToDo: Add incorrect data error
  if (items.length > 0) {
    let i = lastItemToRender
    const itemsToRender = []
    // console.log('items')
    // console.log(items)
    while (i >= firstItemToRender) {
      itemsToRender.push(items[i])
      i--
    }
    content = (
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={12}>
          <List
            className={classes.dialog}
            ref={messageContainerRef}
            onScroll={(e) => handleScroll(e)}
          >
            <ListItem
              key="runway"
              className={classes.runway}
              style={{ transform: `translateY(${runwayHeight}px)` }}
              ref={runwayRef}
            />
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
                  ref={(el) => (nodesRef.current[refIndex] = el)}
                  key={message._id}
                  className={clsx({
                    [classes.right]: message.senderId !== thisUserId,
                  })}
                  // style={{ position: 'absolute' }}
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
