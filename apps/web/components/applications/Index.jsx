import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Grid, Typography, TablePagination } from '@mui/material'
import Layout from '../layouts/Layout'
import Snackbar from '../uiParts/Snackbars'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import DataGridFooter from '../uiParts/DataGridFooter'
import NoRows from '../uiParts/NoRows'
import Error from '../uiParts/Error'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import { DataGrid } from '@mui/x-data-grid'
import { useQuery } from '@apollo/client'
import { GET_REMOVAL_APPLICATIONS } from '../../lib/graphql/queries/removalApplication'
import Router from 'next/router'

const PREFIX = 'Index'

const classes = {
  root: `${PREFIX}-root`,
  row: `${PREFIX}-row`,
}

const StyledRedirectUnathenticatedUser = styled(RedirectUnathenticatedUser)(
  ({ theme }) => ({
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
  }),
)

const columns = [
  {
    field: 'wasteType',
    headerName: 'Тип',
    width: 200,
  },
  {
    field: 'wasteLocation',
    headerName: 'Местоположение',
    width: 332,
  },
  {
    field: 'quantity',
    headerName: 'Количество, кг',
    width: 150,
    headerAlign: 'center',
    align: 'center',
  },
]

export default function Index(props) {
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [backendError, setBackendError] = useState(null)
  const { city, wasteType } = props
  const { loading, error, data } = useQuery(GET_REMOVAL_APPLICATIONS, {
    variables: {
      queryParams: {
        city,
        wasteType,
      },
    },
  })

  const handlePageChange = (_, newPage) => setPage(newPage)
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }
  let rows = []
  let title = 'Заявки на вывоз'
  let titleCity = ''
  let titleWasteType = ''
  let header = `${title} отходов`
  if (loading) return <PageLoadingCircle />

  //ToDo: Add no data overlay
  if (
    data &&
    data.getRemovalApplications &&
    data.getRemovalApplications.length > 0
  ) {
    titleCity = data.getRemovalApplications[0].wasteLocation.description
    const parts = titleCity.split(',')
    titleCity = parts[0] || titleCity

    titleWasteType = data.getRemovalApplications[0].wasteType.name

    if (titleCity && titleWasteType) {
      title = `${titleWasteType} в городе ${titleCity}`
      header = title
    }

    titleWasteType = data.getRemovalApplications[0].wasteType

    //ToDo: Refactor returned data, so that data contain objects in needed form
    //to avoid mapping
    rows = data.getRemovalApplications.map((item) => {
      const newItem = {}
      newItem.id = item['_id']
      newItem.wasteType = item.wasteType
      newItem.wasteLocation = item.wasteLocation.description
      newItem.quantity = item.quantity

      return newItem
    })
  }

  return (
    <StyledRedirectUnathenticatedUser>
      <Layout title={`${title} | Recycl`}>
        <Grid
          container
          direction="column"
          style={{
            margin: '0 auto',
            padding: '16px',
          }}
        >
          <Typography gutterBottom variant="h4">
            {header}
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
              slots={{
                footer: function Footer(props) {
                  return <DataGridFooter {...props} />
                },
                pagination: TablePagination,
                noRowsOverlay: NoRows,
                errorOverlay: Error,
              }}
              slotProps={{
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
    </StyledRedirectUnathenticatedUser>
  )
}
