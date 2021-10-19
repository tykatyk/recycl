import React, { useState } from 'react'
import {
  Grid,
  Button,
  Typography,
  Badge,
  TablePagination,
  makeStyles,
} from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail'

import Link from './Link.jsx'
import Layout from './Layout.jsx'
import RemovalForm from './removalApplication/RemovalForm.jsx'
import DataGridFooter from './DataGridFooter.jsx'

import { DataGrid } from '@mui/x-data-grid'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_REMOVAL_APPLICATIONS,
  DELETE_REMOVAL_APPLICATIONS,
} from '../server/graphqlQueries'

import Router from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
    '& .MuiDataGrid-columnSeparator': {
      visibility: 'hidden',
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
    headerName: 'Тип отходов',
    width: 150,
  },
  {
    field: 'wasteLocation',
    headerName: 'Местоположение',
    width: 332,
  },
  {
    field: 'quantity',
    headerName: 'Количество',
    width: 150,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'messageCount',
    width: 50,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      console.log(params)
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
]

export default function removalApplications() {
  const classes = useStyles()
  const [selected, setSelected] = useState([])
  const { loading, error, data } = useQuery(GET_REMOVAL_APPLICATIONS)

  const [
    deleteMutation,
    { loading: deleting, error: deleteError, data: deleteData },
  ] = useMutation(DELETE_REMOVAL_APPLICATIONS)

  const clickHandler = function (event) {
    if (selected.length < 1) return
    deleteMutation({
      variables: { ids: selected },
      refetchQueries: [{ query: GET_REMOVAL_APPLICATIONS }],
    })
  }

  if (loading) return <Typography>Идет загрузка данных</Typography>

  if (error) {
    return <Typography>Возникла ошибка при загрузке данных</Typography>
  }

  const rows = data.getRemovalApplications.map((item) => {
    const newItem = {}
    newItem.id = item['_id']
    newItem.wasteType = item.wasteType.name
    newItem.wasteLocation = item.wasteLocation.description
    newItem.quantity = item.quantity
    newItem.messageCount = item.messageCount
    return newItem
  })

  return (
    <Layout>
      <Grid
        container
        direction="column"
        style={{
          maxWidth: '800px',
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
            rows={rows}
            columns={columns}
            autoPageSize
            checkboxSelection
            disableSelectionOnClick
            onCellClick={(params, event) => {
              if (params.field === 'messages') {
                Router.push(`/messages`)
                return
              }
              if (params.field !== '__check__')
                Router.push(`/removal/${params.id}`)
            }}
            onSelectionModelChange={(params) => {
              setSelected(params)
            }}
            components={{
              Footer: DataGridFooter,
              Pagination: TablePagination,
            }}
            componentsProps={{ footer: { clickHandler, deleting, selected } }}
          />
        </div>
      </Grid>
    </Layout>
  )
}
