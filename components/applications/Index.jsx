import React, { useState } from 'react'
import {
  Grid,
  Typography,
  makeStyles,
  TablePagination,
} from '@material-ui/core'
import Layout from '../layouts/Layout.jsx'
import Snackbar from '../uiParts/Snackbars.jsx'
import PageLoadingCircle from '../uiParts/PageLoadingCircle.jsx'
import DataGridFooter from '../uiParts/DataGridFooter.jsx'
import DataGridNoRowsOverlay from '../uiParts/DataGridNoRowsOverlay.jsx'
import DataGridErrorOverlay from '../uiParts/DataGridErrorOverlay.jsx'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATIONS } from '../../lib/graphql/queries/removalApplication'
import Router from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
  },
  row: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

const columns = [
  {
    field: 'wasteType',
    headerName: 'Тип',
    width: 150,
  },
  {
    field: 'wasteLocation',
    headerName: 'Местоположение',
    width: 232,
  },
  {
    field: 'quantity',
    headerName: 'Количество',
    width: 150,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'expires',
    headerName: 'До',
    width: 110,
  },
]

export default function Index(props) {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [backendError, setBackendError] = useState(null)
  const { loading, error, data } = useQuery(GET_REMOVAL_APPLICATIONS)

  const handlePageChange = (_, newPage) => setPage(newPage)
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }
  let rows = []

  if (loading) return <PageLoadingCircle />

  if (!error && data.getRemovalApplications) {
    //ToDo: Refactor returned data, so that data contain objects in needed form
    //so that to avoid mapping
    rows = data.getRemovalApplications.map((item) => {
      const newItem = {}
      newItem.id = item.document['_id']
      newItem.wasteType = item.document.wasteType.name
      newItem.wasteLocation = item.document.wasteLocation.description
      newItem.quantity = item.document.quantity
      newItem.messageCount = item.messageCount
      const expires = new Date()
      newItem.expires = expires.toLocaleString('ru-RU', {
        day: '2-digit',
        month: 'short',
      })
      return newItem
    })
  }

  return (
    <>
      <Layout title="Заявки на вывоз | Recycl">
        <Grid
          container
          direction="column"
          style={{
            margin: '0 auto',
            padding: '16px',
          }}
        >
          <Typography gutterBottom variant="h4">
            Заявки на вывоз отходов
          </Typography>
          <div style={{ width: '100%' }}>
            <DataGrid
              classes={{ root: classes.root, row: classes.row }}
              autoHeight
              error={error}
              rows={rows}
              columns={columns}
              pagination
              page={page}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onCellClick={(params, event) => {
                Router.push(`/applications/${params.id}`)
              }}
              components={{
                Footer: (props) => {
                  return <DataGridFooter {...props} />
                },
                Pagination: TablePagination,
                NoRowsOverlay: DataGridNoRowsOverlay,
                ErrorOverlay: DataGridErrorOverlay,
              }}
              componentsProps={{
                footer: {
                  numRows: rows.length,
                  handlePageChange,
                  handlePageSizeChange,
                  pageSize,
                  page,
                },
              }}
            />
          </div>
        </Grid>
      </Layout>
      <Snackbar
        severity="error"
        open={!!backendError}
        message={backendError}
        handleClose={() => {
          setBackendError(null)
        }}
      />
    </>
  )
}
