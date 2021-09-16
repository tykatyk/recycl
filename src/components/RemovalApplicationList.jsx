import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Layout from './Layout.jsx'
import RemovalForm from './RemovalForm.jsx'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@material-ui/core/Typography'
import Link from './Link'
import { useQuery } from '@apollo/client'
import { GET_ALL_REMOVAL_APPLICATIONS } from '../server/graphqlQueries'

const columns = [
  {
    field: 'wasteType',
    headerName: 'Тип отходов',
    width: 150,
    renderCell: (params) => <Link href="#">{params.value}</Link>,
  },
]

export default function removalRequests() {
  const { loading, error, data } = useQuery(GET_ALL_REMOVAL_APPLICATIONS)
  console.log(data)
  const rows = data.getAllRemovalApplications.map((item) => {
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
