import React, { useState, useEffect } from 'react'
import {
  Grid,
  Typography,
  Checkbox,
  Box,
  Button,
  TablePagination,
  makeStyles,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import clsx from 'clsx'
import Layout from './layouts/Layout.jsx'
import DataGridFooter from './uiParts/DataGridFooter.jsx'
import PageLoadingCirlce from './uiParts/PageLoadingCircle.jsx'
import RedirectUnathenticatedUser from './uiParts/RedirectUnathenticatedUser.jsx'
import { useQuery, useMutation } from '@apollo/client'
import { GET_DIALOGS } from '../lib/graphql/queries/message'
import { DELETE_DIALOGS } from '../lib/graphql/queries/message'
import { useSession } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1024,
    '& > :last-child': {
      borderBottom: 'none',
    },
  },
  header: {
    padding: theme.spacing(2),
  },
  row: {
    padding: theme.spacing(2),
    borderBottom: '1px solid #fff',
    cursor: 'pointer',
  },
  paper: {
    background: theme.palette.background.paper,
  },
  noData: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  noDataText: {
    marginTop: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
  unreadMessage: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
}))

export default function MessagesPage() {
  const classes = useStyles()
  const [checked, setChecked] = useState([])
  const [headerChecked, setHeaderChecked] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { data: session } = useSession()
  const { loading, error, data } = useQuery(GET_DIALOGS)
  const [deleteMutation] = useMutation(DELETE_DIALOGS)

  const handleToggle = (value) => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const handleHeaderToggle = () => {
    if (headerChecked) {
      setChecked([])
      setHeaderChecked(false)
    } else {
      setChecked(
        currentData.map((message) => {
          return message['_id']
        })
      )
      setHeaderChecked(true)
    }
  }

  const handleDelete = function (event) {
    if (checked.length < 1) return
    deleteMutation({
      variables: { ids: checked },
      refetchQueries: [{ query: GET_DIALOGS }],
    })
    let newData = [...currentData]
    newData.splice
    newData = newData.filter((el) => {
      checked.indexOf(el) < 0
    })
    setCurrentData()
  }

  useEffect(() => {
    if (data && data.getDialogs && data.getDialogs.length > 0) {
      setCurrentData(data.getDialogs)
    }
  }, [data])

  const Loading = () => {
    return <PageLoadingCirlce />
  }
  const Error = () => {
    return (
      <Typography align="center" color="error">
        Ошибка при загрузке данных
      </Typography>
    )
  }
  const NoData = () => {
    return (
      <Box className={classes.noData}>
        <InfoIcon color="secondary" fontSize="large" />
        <div className={classes.noDataText}>Нет данных</div>
      </Box>
    )
  }

  const Data = (props) => {
    const { messages } = props
    return (
      <Grid className={classes.root} container direction="column">
        <Header showDelete={headerChecked} />
        <MessageList messages={messages} />
      </Grid>
    )
  }

  const Header = function (props) {
    const { showDelete } = props
    let headerContent = null

    if (showDelete) {
      headerContent = (
        <Grid item xs={11}>
          <Button onClick={handleDelete}>Удалить отмеченные</Button>
        </Grid>
      )
    } else {
      headerContent = (
        <>
          <Grid item xs={3}>
            <Typography variant="body2" color="textSecondary">
              Пользователь
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body2" color="textSecondary">
              Сообщение
            </Typography>
          </Grid>
        </>
      )
    }

    return (
      <Grid
        className={classes.header}
        alignItems="center"
        container
        item
        xs={12}
      >
        <Grid item xs={1}>
          <Checkbox checked={headerChecked} onChange={handleHeaderToggle} />
        </Grid>
        {headerContent}
      </Grid>
    )
  }

  const MessageRow = function (props) {
    const { id, viewed, username, senderId, text, subject } = props
    return (
      <Grid
        className={clsx(classes.paper, classes.row)}
        container
        item
        xs={12}
        alignItems="center"
      >
        <Grid item xs={1}>
          <Checkbox
            checked={checked.indexOf(id) !== -1}
            tabIndex={-1}
            disableRipple
            onChange={() => {
              handleToggle(id)
            }}
          />
        </Grid>
        <Grid item xs={3} zeroMinWidth>
          <Typography variant="body2" color="textSecondary" noWrap>
            {username}
          </Typography>
        </Grid>

        <Grid container item xs={8} zeroMinWidth>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" noWrap>
              {subject}
            </Typography>
          </Grid>
          <Grid item xs={12} zeroMinWidth>
            <Typography
              noWrap
              color={
                !viewed && senderId != session.id
                  ? 'secondary'
                  : 'textSecondary'
              }
              className={clsx({
                [classes.unreadMessage]: !viewed && senderId != session.id,
              })}
            >
              {text}{' '}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const MessageList = function (props) {
    const { messages } = props

    const thisUserId = session.id
    if (messages) {
      return messages.map((message) => {
        return (
          <MessageRow
            key={message['_id']}
            id={message['_id']}
            username={
              thisUserId == message.sender._id
                ? message.receiver.name
                : message.sender.name
            }
            senderId={message.sender._id}
            text={message.text}
            viewed={message.viewed}
            subject={`${message.ad.wasteType.name} в городе ${message.ad.wasteLocation.description}`}
          />
        )
      })
    }

    return null
  }
  let content = null

  if (loading) content = <Loading />
  if (error) content = <Error />
  if (data && data.getMessages && data.getMessages.length === 0) {
    content = <NoData />
  }
  if (currentData) content = <Data messages={currentData} />

  return (
    <RedirectUnathenticatedUser>
      <Layout title="Мои сообщения | Recycl">
        <Grid className={classes.root} container direction="column">
          {content}
        </Grid>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
