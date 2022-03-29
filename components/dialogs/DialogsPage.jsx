import React, { useState, useEffect } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import DialogsHeader from './DialogsHeader.jsx'
import DialogsFooter from './DialogsFooter.jsx'
import DialogsList from './DialogsList.jsx'
import NoDataOverlay from './NoDataOverlay.jsx'
import ErrorOverlay from './ErrorOverlay.jsx'
import Layout from '../layouts/Layout.jsx'
import Snackbars from '../uiParts/Snackbars.jsx'
import PageLoadingCirlce from '../uiParts/PageLoadingCircle.jsx'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser.jsx'
import { useApolloClient, useQuery, useMutation } from '@apollo/client'
import { GET_DIALOGS } from '../../lib/graphql/queries/message'
import { DELETE_DIALOGS } from '../../lib/graphql/queries/message'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 1024,
  },
}))

export default function DialogsPage() {
  const classes = useStyles()
  const [checkedRows, setCheckedRows] = useState([])
  const [numUnreadToDelete, setNumUnreadToDelete] = useState(0)
  const [headerChecked, setHeaderChecked] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const [notification, setNotification] = useState('')
  const [severity, setSeverity] = useState('')
  const [deleteMutation] = useMutation(DELETE_DIALOGS)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(
    parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGINATION_SIZE, 10)
  )
  const [numRows, setNumRows] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(GET_DIALOGS, {
    variables: { offset: null, limit: pageSize },
  })
  const client = useApolloClient()
  const cache = client.cache

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
      const dataToProcess = data.getDialogs.dialogs

      if (startIndex > dataToProcess.length - 1) {
        setPage(page - 1 > 0 ? page - 1 : 0)
        return null
      }
      const endIndex = (page + 1) * pageSize
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

  const handleFetchMore = async () => {
    if (!dataIsValid()) return
    let lastMessageId = null
    const lastDialogIndex = data.getDialogs.dialogs.length - 1
    const lastDialog = data.getDialogs.dialogs[lastDialogIndex]
    lastMessageId = lastDialog._id
    return await fetchMore({
      variables: {
        offset: lastMessageId,
        limit: pageSize,
      },
    })
  }

  const needLoadMore = () => {
    if (!dataIsValid()) return false

    const totalLoaded = data.getDialogs.dialogs.length
    const totalCount = data.getDialogs.totalCount

    if (totalCount > totalLoaded) return true
    return false
  }

  const handleNextPageButtonClick = async () => {
    if (needLoadMore()) await handleFetchMore()
    setPage(page + 1)
  }

  const handlePreviousPageButtonClick = () => {
    setPage(page - 1)
  }

  const handleRowToggle = (dialogId) => {
    const currentIndex = checkedRows.map((el) => el.dialogId).indexOf(dialogId)
    const newCheckedRows = [...checkedRows]
    const item = currentData.filter((el) => el.dialogId === dialogId)[0]

    if (currentIndex === -1) {
      newCheckedRows.push(item)
    } else {
      newCheckedRows.splice(currentIndex, 1)
    }

    setCheckedRows(newCheckedRows)
    if (!headerChecked) setHeaderChecked(true)
  }

  const handleHeaderToggle = () => {
    if (headerChecked) {
      setCheckedRows([])
      setHeaderChecked(false)
    } else {
      if (currentData) {
        let checkedDialogs = []
        currentData.forEach((item) => {
          checkedDialogs.push(item)
        })
        setCheckedRows(checkedDialogs)
      }

      setHeaderChecked(true)
    }
  }

  const handleDelete = async (event) => {
    if (checkedRows.length < 1) return
    try {
      const ids = checkedRows.map((el) => el.dialogId)
      const result = await deleteMutation({
        variables: { ids },
      })

      if (
        !result ||
        !result.some ||
        !result.data.deleteDialogs ||
        !result.data.deleteDialogs.deletedCount
      ) {
        setCheckedRows([])
        throw new Error('Unexpected deletion result')
      }

      const dialogs = data.getDialogs.dialogs
      let unreadDialogsToDeleteCount = 0
      const remainDialogs = []
      dialogs.forEach((elem) => {
        if (
          //if dialog is not deleted
          checkedRows.map((row) => row.dialogId).indexOf(elem.dialogId) == -1
        ) {
          //add it to remain dialogs
          remainDialogs.push(elem)
        } else if (!elem.viewed) {
          //if dialog is deleted and not viewed
          unreadDialogsToDeleteCount++
        }
      })
      setNumUnreadToDelete(unreadDialogsToDeleteCount)

      cache.evict({ id: 'ROOT_QUERY', fieldName: 'getDialogs' })
      client.writeQuery({
        query: GET_DIALOGS,
        data: {
          getDialogs: {
            dialogs: remainDialogs,
            totalCount: numRows - checkedRows.length,
          },
        },
      })

      setCheckedRows([])
    } catch (error) {
      setSeverity('error')
      setNotification('Ошибка при удалении данных')
    }
  }

  useEffect(async () => {
    if (needLoadMore()) {
      await handleFetchMore()
    } else {
      setCurrentData(getDataToShow())
    }
  }, [pageSize, page])

  useEffect(() => {
    if (!dataIsValid()) {
      setCurrentData(null)
      return
    }
    if (data.getDialogs.totalCount !== numRows) {
      setNumRows(data.getDialogs.totalCount)
    }
    setCurrentData(getDataToShow())
  }, [data])

  useEffect(() => {
    if (headerChecked && checkedRows.length < 1) setHeaderChecked(false)
  }, [checkedRows])

  const Data = (props) => {
    const { messages } = props
    return (
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
        <DialogsHeader
          checked={headerChecked}
          showDelete={headerChecked}
          handleToggle={handleHeaderToggle}
          handleDelete={handleDelete}
        />
        <DialogsList
          messages={messages}
          checkedRows={checkedRows}
          handleRowToggle={handleRowToggle}
        />
        <DialogsFooter
          page={page}
          pageSize={pageSize}
          numRows={numRows}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          handleNextPageButtonClick={handleNextPageButtonClick}
          handlePreviousPageButtonClick={handlePreviousPageButtonClick}
        />
      </>
    )
  }

  let content = null

  if (loading) content = <PageLoadingCirlce />
  if (error) content = <ErrorOverlay />
  if (!error && !loading && !currentData) {
    content = <NoDataOverlay />
  }
  if (currentData) content = <Data messages={currentData} />

  return (
    <RedirectUnathenticatedUser>
      <Layout
        title="Мои сообщения | Recycl"
        numViewed={numUnreadToDelete}
        setNumViewed={setNumUnreadToDelete}
      >
        <Grid className={classes.root} container direction="column">
          {content}
        </Grid>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
