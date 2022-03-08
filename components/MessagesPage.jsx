import React, { useState } from 'react'
import {
  Grid,
  Typography,
  Checkbox,
  TablePagination,
  makeStyles,
} from '@material-ui/core'
import clsx from 'clsx'
import Layout from './layouts/Layout.jsx'
import DataGridFooter from './uiParts/DataGridFooter.jsx'
import { useQuery, useMutation } from '@apollo/client'
import { GET_MESSAGES } from '../lib/graphql/queries/message'

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
}))

export default function Messages() {
  const classes = useStyles()
  const [checked, setChecked] = useState([0])

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

  const { loading, error, data } = useQuery(GET_MESSAGES)
  const messages =
    data && data.getMessages && data.getMessages.length > 0
      ? data.getMessages
      : null
  /*const [
    deleteMutation,
    { loading: deleting, error: deleteError, data: deleteData },
  ] = useMutation(DELETE_MESSAGES)*/

  // const clickHandler = function (event) {
  //   if (selected.length < 1) return
  //   deleteMutation({
  //     variables: { ids: selected },
  //     refetchQueries: [{ query: GET_MESSAGES_BY_APPLICATION }],
  //   })
  // }

  // if (loading) return <Typography>Идет загрузка данных</Typography>

  // if (error) {
  //   return <Typography>Возникла ошибка при загрузке данных</Typography>
  // }

  const Header = function () {
    return (
      <Grid
        className={classes.header}
        alignItems="center"
        container
        item
        xs={12}
      >
        <Grid item xs={1}>
          <Checkbox />
        </Grid>
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

  return (
    <Layout title="Мои сообщения | Recycl">
      <Grid className={classes.root} container direction="column">
        <Header />
        <MessageList messages={messages} />
      </Grid>
    </Layout>
  )
}
