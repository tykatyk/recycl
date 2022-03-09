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
import { useQuery, useMutation } from '@apollo/client'
import { GET_MESSAGES } from '../lib/graphql/queries/message'
import { DELETE_MESSAGES } from '../lib/graphql/queries/message'

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
}))

export default function Messages() {
  const classes = useStyles()
  const [checked, setChecked] = useState([])
  const [headerChecked, setHeaderChecked] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const { loading, error, data } = useQuery(GET_MESSAGES)
  const [deleteMutation] = useMutation(DELETE_MESSAGES)

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
      refetchQueries: [{ query: GET_MESSAGES }],
    })
    let newData = [...currentData]
    newData.splice
    newData = newData.filter((el) => {
      checked.indexOf(el) < 0
    })
    setCurrentData()
  }

  useEffect(() => {
    if (data && data.getMessages && data.getMessages.length > 0) {
      setCurrentData(data.getMessages)
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
              От
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
    const { id, from, text, subject } = props
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
            {from}
          </Typography>
        </Grid>

        <Grid container item xs={8} zeroMinWidth>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary" noWrap>
              {subject}
            </Typography>
          </Grid>
          <Grid item xs={12} zeroMinWidth>
            <Typography noWrap>{text}</Typography>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const MessageList = function (props) {
    const { messages } = props
    if (messages) {
      return messages.map((message) => {
        return (
          <MessageRow
            key={message['_id']}
            id={message['_id']}
            from={message.sender.name}
            text={message.text}
            isViewed={message.isViewed}
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
    <Layout title="Мои сообщения | Recycl">
      <Grid className={classes.root} container direction="column">
        {content}
      </Grid>
    </Layout>
  )
}
