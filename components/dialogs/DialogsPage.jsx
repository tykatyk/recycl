import React, { useState, useEffect, useRef, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'
import DialogsHeader from './DialogsHeader'
import DialogsFooter from './DialogsFooter'
import DialogsList from './DialogsList'
import NoDataOverlay from './NoDataOverlay'
import ErrorOverlay from './ErrorOverlay'
import ChatPage from '../ChatPage'
import Layout from '../layouts/Layout'
import Snackbars from '../uiParts/Snackbars'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_DIALOGS } from '../../lib/graphql/queries/message'
import { DELETE_DIALOGS } from '../../lib/graphql/queries/message'
import { useRouter } from 'next/router'

const PREFIX = 'DialogsPage'

const classes = {
  root: `${PREFIX}-root`,
}

const StyledRedirectUnathenticatedUser = styled(RedirectUnathenticatedUser)(
  ({ theme }) => ({
    [`& .${classes.root}`]: {
      maxWidth: 1024,
    },
  })
)

const dataIsValid = (data) => {
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

export default function DialogsPage() {
  const [checkedRows, setCheckedRows] = useState([])
  const [headerChecked, setHeaderChecked] = useState(false)
  const [notification, setNotification] = useState('')
  const [severity, setSeverity] = useState('')
  const [deleteMutation] = useMutation(DELETE_DIALOGS)
  const [numRows, setNumRows] = useState(0)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(
    // parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGINATION_SIZE, 10)
    1
  )
  const navigation = useRef('')
  const prevDialogId = useRef(null)

  const [loadDialogs, { loading, error, data, refetch }] = useLazyQuery(
    GET_DIALOGS,
    {
      variables: { offset: 0, limit: pageSize },
      fetchPolicy: 'network-only',
    }
  )

  const router = useRouter()

  const handlePageChange = (_, newPage) => {
    setPage(newPage)
  }
  const handlePageSizeChange = async (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleFetch = useCallback(
    async function (offset = 0) {
      // if (!dataIsValid()) return
      await loadDialogs({
        variables: { offset, limit: pageSize },
      })
    },
    [pageSize, loadDialogs]
  )

  const needLoadMore = () => {
    if (!dataIsValid()) return false

    const numDialogsOnCurrentPage = data.getDialogs.dialogs.length
    const totalCount = data.getDialogs.totalCount

    if (totalCount > page * pageSize + numDialogsOnCurrentPage) return true
    return false
  }

  const getNextDialogs = async () => {
    if (needLoadMore()) {
      //ToDo: Maybe needLoadMore function is not needed
      navigation.current = 'forward'
      await handleFetch((page + 1) * pageSize)
    }
  }

  const getPreviousDialogs = async () => {
    navigation.current = 'backward'
    await handleFetch(Math.max((page - 1) * pageSize), 0)
  }

  const deleteDialogs = async () => {
    if (checkedRows.length < 1) return
    //ids of dialogs to to delete
    const ids = checkedRows.map((el) => el.dialogId)
    //delete dialogs from database
    try {
      const result = await deleteMutation({
        variables: { ids },
      })
      if (
        !result ||
        !result.data ||
        !result.data.deleteDialogs ||
        !result.data.deleteDialogs.deletedCount
      ) {
        setCheckedRows([])
        throw new Error('Unexpected deletion result')
      }
    } catch (error) {
      setSeverity('error')
      setNotification('Ошибка при удалении данных')
    }

    //uncheck header if it's checked
    if (headerChecked) setHeaderChecked(false)
    //uncheck deleted rows
    setCheckedRows([])
    //load new data
    await handleFetch(page * pageSize)
  }

  const toggleRow = (dialogId) => {
    const currentRowIndex = checkedRows
      .map((el) => el.dialogId)
      .indexOf(dialogId)
    const newCheckedRows = [...checkedRows]

    //if current row is not selected
    if (currentRowIndex === -1) {
      const currentRow = data.getDialogs.dialogs.filter(
        (el) => el.dialogId === dialogId
      )[0]
      //add it to selected rows
      newCheckedRows.push(currentRow)
    } else {
      //else remove it from selected rows
      newCheckedRows.splice(currentRowIndex, 1)
    }

    setCheckedRows(newCheckedRows)
    if (!headerChecked) setHeaderChecked(true)
  }

  const toggleHeader = () => {
    if (headerChecked) {
      setCheckedRows([])
      setHeaderChecked(false)
      return
    }

    if (!dataIsValid()) return

    const checkedDialogs = []
    data.getDialogs.dialogs.forEach((item) => {
      checkedDialogs.push(item)
    })
    setCheckedRows(checkedDialogs)
    setHeaderChecked(true)
  }

  //load initial dialog data at page loads
  useEffect(() => {
    handleFetch(0)
  }, [handleFetch])

  //update numRows and page after data is updated
  useEffect(() => {
    if (dataIsValid()) {
      setNumRows(data.getDialogs.totalCount)

      if (navigation.current == 'forward') {
        navigation.current = ''
        setPage(page + 1)
      }
      if (navigation.current == 'backward') {
        navigation.current = ''
        setPage(Math.max(page - 1, 0))
      }
      return
    }

    if (data && data.getDialogs && data.getDialogs.totalCount) {
      setNumRows(0)
      handleFetch(Math.max(page - 1, 0))
    }
  }, [data, page, handleFetch])

  useEffect(() => {
    if (headerChecked && checkedRows.length < 1) setHeaderChecked(false)
  }, [checkedRows, headerChecked])

  useEffect(() => {
    handleFetch(0)
  }, [pageSize, handleFetch])

  useEffect(() => {
    if (prevDialogId.current && !router.query.dialogId) {
      refetch()
    }
    prevDialogId.current = router.query.dialogId
  }, [router.query.dialogId, refetch])

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
          handleToggle={toggleHeader}
          handleDelete={deleteDialogs}
        />
        <DialogsList
          messages={messages}
          checkedRows={checkedRows}
          handleRowToggle={toggleRow}
        />
        <DialogsFooter
          page={page}
          pageSize={pageSize}
          numRows={numRows}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          handleNextPageButtonClick={getNextDialogs}
          handlePreviousPageButtonClick={getPreviousDialogs}
        />
      </>
    )
  }

  if (router.query.dialogId) {
    return <ChatPage dialogId={router.query.dialogId[0]} />
  } else {
    let content = null

    if (loading) content = <PageLoadingCircle />
    if (error) content = <ErrorOverlay />
    if (!error && !loading && !dataIsValid()) {
      content = <NoDataOverlay />
    }
    if (dataIsValid()) {
      content = <Data messages={data.getDialogs.dialogs} />
    }

    return (
      <StyledRedirectUnathenticatedUser>
        <Layout title="Мои сообщения | Recycl">
          <Grid className={classes.root} container direction="column">
            {content}
          </Grid>
        </Layout>
      </StyledRedirectUnathenticatedUser>
    )
  }
}
