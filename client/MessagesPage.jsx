import React, { useState } from 'react'
import {
  Grid,
  Button,
  Typography,
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
import { GET_MESSAGES_BY_APPLICATION } from '../lib/graphql/queries'

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
    field: 'from',
    headerName: 'От',
    width: 150,
  },
  {
    field: 'message',
    headerName: 'Сообщение',
    width: 332,
  },
  {
    field: 'isRead',
    headerName: '',
    width: 150,
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => {
      if (params.row.messageCount > 0) {
        return <MailIcon />
      }
      return ''
    },
  },
]

export default function Messages() {
  const classes = useStyles()
  const [selected, setSelected] = useState([])
  const { loading, error, data } = useQuery(GET_MESSAGES_BY_APPLICATION)

  /*const [
    deleteMutation,
    { loading: deleting, error: deleteError, data: deleteData },
  ] = useMutation(DELETE_MESSAGES)*/

  const clickHandler = function (event) {
    if (selected.length < 1) return
    deleteMutation({
      variables: { ids: selected },
      refetchQueries: [{ query: GET_MESSAGES_BY_APPLICATION }],
    })
  }

  if (loading) return <Typography>Идет загрузка данных</Typography>

  if (error) {
    return <Typography>Возникла ошибка при загрузке данных</Typography>
  }

  const rows = data.getRemovalApplications.map((item) => {
    const newItem = {}
    newItem.id = item['_id']
    newItem.from = item.wasteType.name
    newItem.message = {
      wasteType: item.wasteType.name,
      text: item.text,
    }
    newItem.isRead = item.isRead
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
          Сообщения
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
            onCellClick={(params, event) => {}}
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
