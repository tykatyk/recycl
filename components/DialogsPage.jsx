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
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import clsx from 'clsx'
import Layout from './layouts/Layout.jsx'
import PageLoadingCirlce from './uiParts/PageLoadingCircle.jsx'
import RedirectUnathenticatedUser from './uiParts/RedirectUnathenticatedUser.jsx'
import { useQuery, useMutation } from '@apollo/client'
import { GET_DIALOGS } from '../lib/graphql/queries/message'
import { DELETE_DIALOGS } from '../lib/graphql/queries/message'
import { useSession } from 'next-auth/react'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1024,
  },
  header: {
    padding: theme.spacing(2),
  },
  messageList: {
    '& > :last-child': {
      borderBottom: 'none',
    },
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
  error: {
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

export default function DialogsPage() {
  const classes = useStyles()
  const [checked, setChecked] = useState([])
  const [headerChecked, setHeaderChecked] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { data: session } = useSession()
  const { loading, error, data } = useQuery(GET_DIALOGS)
  const [deleteMutation] = useMutation(DELETE_DIALOGS)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(2)
  const [numRows, setNumRows] = useState(0)

  const dataIsValid = () => {
    if (
      data &&
      data.getDialogs &&
      data.getDialogs.dialogs &&
      data.getDialogs.dialogs.length > 0
    ) {
      return true
    }
    return false
  }

  const getDataToShow = () => {
    if (dataIsValid()) {
      const startIndex = page * pageSize
      const endIndex = (page + 1) * pageSize
      const dataToProcess = data.getDialogs.dialogs
      const dataToShow = dataToProcess.slice(startIndex, endIndex)
      return dataToShow
    }
    return null
  }

  const handlePageChange = (_, newPage) => {
    setPage(newPage)
  }
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleCheckboxToggle = (value) => {
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
      if (currentData) {
        setChecked(
          currentData.map((message) => {
            return message['_id']
          })
        )
      }

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
    const dataToShow = getDataToShow()
    setCurrentData(dataToShow)
  }, [data, page, pageSize])

  useEffect(() => {
    if (dataIsValid()) setNumRows(data.getDialogs.dialogs.length)
  }, [data])

  const Error = () => {
    return (
      <Box className={classes.error}>
        <ErrorIcon color="secondary" fontSize="large" />
        <Typography align="center" color="error">
          Ошибка при загрузке данных
        </Typography>
      </Box>
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
        <Footer
          page={page}
          pageSize={pageSize}
          numRows={numRows}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
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

  const Footer = function (props) {
    const {
      numRows = 0,
      page = 0,
      pageSize = 25,
      handlePageChange = () => {},
      handlePageSizeChange = () => {},
    } = props
    return (
      <TablePagination
        component="div"
        count={numRows}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[1, 2, 3]}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />
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
              handleCheckboxToggle(id)
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
                !viewed && senderId != session.id ? 'secondary' : 'inherit'
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
      return (
        <Grid item xs={12} className={classes.messageList}>
          {messages.map((message) => {
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
          })}
        </Grid>
      )
    }

    return null
  }
  let content = null

  if (loading) content = <PageLoadingCirlce />
  if (error) content = <Error />
  if (!error && !loading && !currentData) {
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
