import React from 'react'
import { Grid, Button, Typography } from '@material-ui/core'

import Link from './Link.jsx'
import Layout from './Layout.jsx'
import RemovalForm from './removalApplication/RemovalForm.jsx'

import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATIONS } from '../server/graphqlQueries'

const columns = [
  {
    field: 'wasteType',
    headerName: 'Тип отходов',
    width: 150,
    renderCell: (params) => <Link href="#">{params.value}</Link>,
  },
]

export default function removalApplications() {
  const { loading, error, data } = useQuery(GET_REMOVAL_APPLICATIONS)
  if (loading) return <Typography>Идет загрузка данных</Typography>
  if (error) return <Typography>Возникла ошибка при загрузке данных</Typography>

  const rows = data.getRemovalApplications.map((item) => {
    const newItem = {}
    newItem.id = item['_id']
    newItem.wasteType = item.wasteType
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
            autoHeight
            rows={rows}
            columns={columns}
            autoPageSize
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      </Grid>
    </Layout>
  )
}
