import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Grid, Typography, Badge, TablePagination } from '@mui/material'
import Link from '../uiParts/Link'
import MailIcon from '@mui/icons-material/Mail'
import CreateIcon from '@mui/icons-material/Create'
import Layout from '../layouts/Layout'
import Snackbar from '../uiParts/Snackbars'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import DataGridFooter from '../uiParts/DataGridFooter'
import DataGridNoRowsOverlay from '../uiParts/DataGridNoRowsOverlay'
import DataGridErrorOverlay from '../uiParts/DataGridErrorOverlay'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import {
  GET_REMOVAL_APPLICATIONS_WITH_MESSAGE_COUNT,
  DELETE_REMOVAL_APPLICATIONS,
} from '../../lib/graphql/queries/removalApplication'
import Router from 'next/router'

const PREFIX = 'IndexOwner'

const classes = {
  root: `${PREFIX}-root`,
  row: `${PREFIX}-row`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
  },

  [`& .${classes.row}`]: {
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
    width: 150,
  },
  {
    field: 'quantity',
    headerName: 'Количество',
    width: 152,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'messageCount',
    headerName: 'Сообщения',
    width: 120,
    headerAlign: 'center',
    align: 'center',
    renderCell: function MessageCountCell(params) {
      if (params.row.messageCount > 0) {
        return (
          <Badge badgeContent={params.row.messageCount} color="secondary">
            <MailIcon />
          </Badge>
        )
      }
      return ''
    },
  },
  {
    field: 'expires',
    headerName: 'До',
    width: 110,
  },
  {
    field: 'edit',
    headerName: 'Редактировать',
    width: 140,
    headerAlign: 'center',
    align: 'center',
    renderCell: function EditCell(params) {
      return (
        <Link href={params.row.edit}>
          <CreateIcon color="secondary" />
        </Link>
      )
    },
  },
]

export default function RemovalApplications(props) {
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [backendError, setBackendError] = useState(null)
  const { status } = useSession()
  const { loading, error, data } = useQuery(
    GET_REMOVAL_APPLICATIONS_WITH_MESSAGE_COUNT
  )
  const [deleteMutation, { loading: deleting, error: deletionError }] =
    useMutation(DELETE_REMOVAL_APPLICATIONS)
  const deleteHandler = (event) => {
    if (selected.length < 1) return
    deleteMutation({
      variables: { ids: selected },
      refetchQueries: [{ query: GET_REMOVAL_APPLICATIONS_WITH_MESSAGE_COUNT }],
    })
  }
  const handlePageChange = (_, newPage) => setPage(newPage)
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }
  let rows = []

  if (loading) return <PageLoadingCircle />
  // ToDo: Add error overlay and no data overlay
  if (status === 'unauthenticated') {
    Router.push({
      pathname: '/auth/login',
      query: {
        from: '/removal/application',
      },
    })
  }

  if (status === 'authenticated') {
    if (!error) {
      //ToDo: Refactor returned data, so that data contain objects in needed form
      //so that to avoid mapping
      rows = data.getRemovalApplicationsWithMessageCount.map((item) => {
        const newItem = {}
        newItem.id = item.document['_id']
        newItem.wasteType = item.document.wasteType.name
        newItem.wasteLocation = item.document.wasteLocation.description
        newItem.quantity = item.document.quantity
        newItem.messageCount = item.messageCount
        const expires = new Date(item.document.expires)
        newItem.expires = expires.toLocaleString('ru-RU', {
          day: '2-digit',
          month: 'short',
        })
        newItem.edit = `/my/applications/edit/${item.document['_id']}`
        return newItem
      })
    }

    return (
      <Root>
        <Layout title="Мои заявки на вывоз | Recycl">
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
                checkboxSelection
                disableSelectionOnClick
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onCellClick={(params, event) => {
                  if (params.field === 'messages') {
                    Router.push(`/messages`)
                    return
                  }
                  if (params.field !== '__check__')
                    Router.push(`/applications/${params.id}`)
                }}
                onSelectionModelChange={(params) => {
                  setSelected(params)
                }}
                components={{
                  Footer: function Footer(props) {
                    return <DataGridFooter showDeleteButton={true} {...props} />
                  },
                  Pagination: TablePagination,
                  NoRowsOverlay: DataGridNoRowsOverlay,
                  ErrorOverlay: DataGridErrorOverlay,
                }}
                componentsProps={{
                  footer: {
                    deleteHandler,
                    deleting,
                    selected,
                    numRows: rows && rows.length ? rows.length : 0,
                    handlePageChange,
                    handlePageSizeChange,
                    pageSize,
                    page,
                  },
                  checkbox: { color: 'secondary' },
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
      </Root>
    )
  }
  return ''
}
