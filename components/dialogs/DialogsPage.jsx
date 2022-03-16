import React, { useState, useEffect } from 'react'
import { Grid, makeStyles } from '@material-ui/core'
import DialogsHeader from './DialogsHeader.jsx'
import DialogsFooter from './DialogsFooter.jsx'
import DialogsList from './DialogsList.jsx'
import NoDataOverlay from './NoDataOverlay.jsx'
import ErrorOverlay from './ErrorOverlay.jsx'
import Layout from '../layouts/Layout.jsx'
import PageLoadingCirlce from '../uiParts/PageLoadingCircle.jsx'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser.jsx'
import { useQuery, useMutation } from '@apollo/client'
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
  const [headerChecked, setHeaderChecked] = useState(false)
  const [currentData, setCurrentData] = useState(null)
  const [deleteMutation] = useMutation(DELETE_DIALOGS)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(1)
  const [numRows, setNumRows] = useState(0)
  const { loading, error, data, fetchMore } = useQuery(GET_DIALOGS, {
    variables: { offset: null, limit: pageSize },
  })

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

  const handleFetchMore = () => {
    let lastMessageId = null
    if (!dataIsValid()) return
    if ((page + 1) * pageSize >= data.getDialogs.totalCount) return

    const lastDialogIndex = data.getDialogs.dialogs.length - 1
    const lastDialog = data.getDialogs.dialogs[lastDialogIndex]
    lastMessageId = lastDialog.messages[0]._id
    return fetchMore({
      variables: {
        offset: lastMessageId,
        limit: pageSize,
      },
    })
  }

  const handleNextPageButtonClick = () => {
    handleFetchMore().then(() => {
      setPage(page + 1)
    })
  }
  const handleRowToggle = (value) => {
    const currentIndex = checkedRows.indexOf(value)
    const newCheckedRows = [...checkedRows]

    if (currentIndex === -1) {
      newCheckedRows.push(value)
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
        setCheckedRows(
          currentData.map((message) => {
            return message['_id']
          })
        )
      }

      setHeaderChecked(true)
    }
  }

  const handleDelete = function (event) {
    if (checkedRows.length < 1) return
    deleteMutation({
      variables: { ids: checkedRows },
      refetchQueries: [{ query: GET_DIALOGS }],
    })
    let newData = [...currentData]
    newData.splice
    newData = newData.filter((el) => {
      checkedRows.indexOf(el) < 0
    })
    setCurrentData()
  }

  useEffect(() => {
    handleFetchMore()
  }, [pageSize])

  useEffect(() => {
    const dataToShow = getDataToShow()
    setCurrentData(dataToShow)
  }, [data, page, pageSize])

  useEffect(() => {
    if (dataIsValid()) setNumRows(data.getDialogs.totalCount)
  }, [data])

  useEffect(() => {
    if (headerChecked && checkedRows.length < 1) setHeaderChecked(false)
  }, [checkedRows])

  const Data = (props) => {
    const { dialogs } = props
    return (
      <Grid className={classes.root} container direction="column">
        <DialogsHeader
          checked={headerChecked}
          showDelete={headerChecked}
          handleToggle={handleHeaderToggle}
          handleDelete={handleDelete}
        />
        <DialogsList
          dialogs={dialogs}
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
        />
      </Grid>
    )
  }

  let content = null

  if (loading) content = <PageLoadingCirlce />
  if (error) content = <ErrorOverlay />
  if (!error && !loading && !currentData) {
    content = <NoDataOverlay />
  }
  if (currentData) content = <Data dialogs={currentData} />

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
