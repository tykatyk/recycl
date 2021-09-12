import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Layout from './Layout.jsx'
import RemovalForm from './RemovalForm.jsx'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@material-ui/core/Typography'
import Link from './Link'
import { useQuery } from '@apollo/client'
import { GET_ALL_REMOVAL_APPLICATIONS } from '../graphqlQueries'

const columns = [
  {
    field: 'wasteType',
    headerName: 'Тип отходов',
    width: 150,
    renderCell: (params) => <Link href="#">{params.value}</Link>,
  },
]

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
]

export default function removalRequests() {
  const { loading, error, data } = useQuery(GET_ALL_REMOVAL_APPLICATIONS)
  console.log(data.getAllRemovalApplications)
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
            rows={data.getAllRemovalApplications}
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
