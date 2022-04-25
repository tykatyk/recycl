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

const useStyles = makeStyles({
  chatSection: {
    width: '100%',
  },

  dialog: {
    height: messageContainerHeight,
    overflowY: 'auto',
    position: 'relative',
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
    // console.log(dialogData)
    if (dialogData && dialogData.getDialog && dialogData.getDialog.length > 0) {
      return true
    }
    return false
  }

  const numItemsToRenderForward = 1
  const numItemsToRenderBackward = 1
  const limit = 1 //num messages to receive when quering database
  const messageContainerRef = useRef()
  const runwayRef = useRef()
  const nodesRef = useRef([])
  const [initialLoad, setInitialLoad] = useState(true)
  const items = useRef([])
  const [runwayHeight, setRunwayHeight] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [technicalScroll, setTechnicalScroll] = useState(false)
  const [endIndex, setEndIndex] = useState(-1)
  const [anchorEl, setAnchorEl] = useState({
    index: 0,
    //ToDo: maybe rename
    offset: 0, //num pixels of anchor element which are above visible area of message container
    scrollTop: 0, //current scroll position
  })
  const [canLoadMore, setCanLoadMore] = useState(true)
  //load initial dialog data
  useEffect(() => {
    if (!dialogId) return
    getMoreData()
  }, [dialogId])

  //This runs after all dom manipulations
  //Position all rendered elements
  //and measure new height of runway
  // useEffect(() => {
  useLayoutEffect(() => {
    if (!items.current || items.current.length === 0) return

    let i
    //position from the top of the message container
    let currentPos
    let newRunwayHeight = runwayHeight
    let node
    let nodeHeight
    console.log('f ' + startIndex)
    console.log('l ' + endIndex)

    if (!items.current[endIndex].height) {
      i = endIndex
      currentPos = 0
      let newScroll = 0

      while (i >= startIndex) {
        node = nodesRef.current[i]
        nodeHeight = nodesRef.current[i].offsetHeight
        //ToDo maybe add animation when positioning elements
        node.style.top = `${currentPos}px`
        if (i > anchorEl.index) {
          newScroll += nodeHeight
        }

        if (!items.current[i].height) {
          items.current[i].height = nodeHeight
          newRunwayHeight += items.current[i].height
        }
        currentPos += nodeHeight
        i--
      }
      messageContainerRef.current.scrollTop = newScroll
      setTechnicalScroll(true)
    } else {
      console.log('here')
      i = anchorEl.index

      currentPos = anchorEl.scrollTop - anchorEl.offset

      while (i >= startIndex) {
        node = nodesRef.current[i]
        nodeHeight = nodesRef.current[i].offsetHeight
        //ToDo maybe add animation when positioning elements
        node.style.top = `${currentPos}px`
        if (i <= anchorEl.index) currentPos += nodeHeight

        if (!items.current[i].height) {
          items.current[i].height = nodeHeight
          newRunwayHeight += items.current[i].height
        }
        i--
      }

      i = anchorEl.index
      currentPos = nodesRef.current[anchorEl.index].offsetHeight

      while (i < endIndex) {
        node = nodesRef.current[i + 1]
        nodeHeight = nodesRef.current[i + 1].offsetHeight
        //ToDo maybe add animation when positioning elements
        node.style.top = `${currentPos - nodeHeight}px`
        currentPos -= nodeHeight

        if (!items.current[i].height) {
          items.current[i].height = nodeHeight
          newRunwayHeight += items.current[i].height
        }
        i++
      }
      messageContainerRef.current.scrollTop = anchorEl.scrollTop
    }

    setRunwayHeight(newRunwayHeight)
    if (initialLoad) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight
    }

    if (
      messageContainerRef.current.scrollHeight <=
        messageContainerRef.current.offsetHeight &&
      canLoadMore
    ) {
      getMoreData(items.current[items.current.length - 1].data._id)
    } else {
      setInitialLoad(false)
    }
  }, [startIndex, endIndex])

  const handleClick = (e) => {
    if (!dialogId || items.current.length == 0) return //ToDo: handle errror

    const firstMessage = items.current[0].data
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

    if (dialogReceiverId && dialogInitiatorId) return

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

  //ToDo: scroll to the end of message container on initial load
  const handleScroll = async (e) => {
    if (typeof window === 'undefined' || loading) return

    const currScroll = messageContainerRef.current
      ? messageContainerRef.current.scrollTop
      : 0
    if (technicalScroll) {
      setAnchorEl(calculateAnchoredItem())
      setTechnicalScroll(false)
      return
    }
    let prevScroll = anchorEl.scrollTop
    let anchorIndex = anchorEl.index
    let delta = currScroll - prevScroll
    const newAnchorEl = calculateAnchoredItem()
    //we are at the top of the dialog and want to load more messages
    if (
      messageContainerRef.current.scrollTop == 0 && //ToDo potential problem
      canLoadMore
    ) {
      setAnchorEl(newAnchorEl)

      //offset in items to load
      const lastItemId = items.current.length
        ? items.current[items.current.length - 1].data._id
        : ''
      const result = await getMoreData(lastItemId)
      let numLoaded = result ? result.data.getDialog.length : 0

      fill(
        anchorIndex - numItemsToRenderBackward,
        anchorIndex + numItemsToRenderForward + numLoaded
      )
      return
    }

    //position of top edje of the anchor relative to current scroll position
    // console.log('updated delta ' + delta)
    //scroll down
    if (delta > 0) {
      fill(
        anchorIndex - numItemsToRenderBackward,
        anchorIndex + numItemsToRenderForward
      )
    } else {
      //scroll up
      console.log('up')

      fill(
        anchorIndex - numItemsToRenderForward,
        anchorIndex + numItemsToRenderBackward
      )
    }
    console.log('a ' + anchorEl.index)
    setAnchorEl(newAnchorEl)
  }
  const calculateAnchoredItem = () => {
    const currScroll = messageContainerRef.current
      ? messageContainerRef.current.scrollTop
      : 0
    if (technicalScroll) {
      return {
        index: anchorEl.index,
        offset: anchorEl.offset,
        scrollTop: currScroll,
      }
    }
    let prevScroll = anchorEl.scrollTop
    let anchorIndex = anchorEl.index
    let delta = currScroll - prevScroll

    //we are at the top of the dialog and want to load more messages
    if (
      messageContainerRef.current.scrollTop == 0 && //ToDo potential problem
      canLoadMore
    ) {
      anchorIndex = items.current.length > 0 ? items.current.length - 1 : 0
      return {
        index: anchorIndex,
        offset: 0,
        scrollTop: 0,
      }
    }

    delta += anchorEl.offset
    console.log('delta ' + delta)

    //calculate position of top edje of the anchor relative to current scroll position
    if (delta > 0) {
      while (
        anchorIndex > 0 &&
        delta > 0 &&
        delta > items.current[anchorIndex].height
      ) {
        delta -= items.current[anchorIndex].height
        anchorIndex--
      }
    } else {
      while (anchorIndex < items.current.length - 1 && delta < 0) {
        delta += items.current[anchorIndex + 1].height
        anchorIndex++
      }
    }

    return {
      index: anchorIndex,
      offset: delta,
      scrollTop: currScroll,
    }
  }

  const fill = (start, end) => {
    setStartIndex(Math.max(start, 0))
    setEndIndex(Math.min(items.current.length - 1, end))
  }

  const getMoreData = async function (offset = '', count = limit) {
    if (!canLoadMore) return
    setLoading(true)
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
        if (!dataIsCorrect(result.data)) return

        const newItems = [...items.current]
        result.data.getDialog.forEach((item) =>
          newItems.push({ data: item, height: 0 })
        )
        items.current = newItems

        if (initialLoad) setEndIndex(result.data.getDialog.length - 1)
        if (canLoadMore && result.data.getDialog.length < count)
          setCanLoadMore(false)

        return result
      })
      .catch((error) => {
        console.log(error)
        setGetDialogError(true)
        console.log('error in loading data')
        // console.log(JSON.stringify(error, null, 2))
        // return 0
        return null
        //ToDo handle error
      })
      .finally(() => setLoading(false))
  }
  let content = null
  if (loading) content = <PageLoadingCircle />
  if (getDialogError) content = <ErrorOverlay /> //ToDo: Add incorrect data error
  if (items.current && items.current.length > 0) {
    let i = endIndex
    const itemsToRender = []
    // console.log('items')
    // console.log(items)
    while (i >= startIndex) {
      itemsToRender.push(items.current[i])
      i--
    }
    // console.log('e ' + endIndex)
    // console.log('s ' + startIndex)
    // console.log(items.current)

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
              const refIndex = endIndex - index
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
