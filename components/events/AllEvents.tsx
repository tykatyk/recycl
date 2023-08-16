import React, { useEffect, useState } from 'react'
import {
  Grid,
  Typography,
  Badge,
  makeStyles,
  TablePagination,
  TableContainer,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@material-ui/core'
import Link from '../uiParts/Link'
import MailIcon from '@material-ui/icons/Mail'
import Layout from '../layouts/Layout'
import Snackbar from '../uiParts/Snackbars'
import Tabs from '../uiParts/Tabs'
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
} from '../../lib/graphql/queries/removalApplication.js'
import Router from 'next/router'
import { active, inactive } from './data'
import Events from './Events'

const useStyles = makeStyles((theme) => ({
  root: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
  },
  noBorder: {
    borderBottom: 'none',
  },
  row: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}))

const columns = [
  {
    field: 'date',
    headerName: 'Дата',
    width: 150,
  },
  {
    field: 'location',
    headerName: 'Место',
    width: 232,
  },
  {
    field: 'time',
    headerName: 'Время',
    width: 150,
    headerAlign: 'center',
    align: 'center',
  },
  {
    field: 'wasteType',
    headerName: 'Тип отходов',
    width: 260,
    headerAlign: 'center',
    align: 'center',
  },
]

export default function AllEvents() {
  const classes = useStyles()
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(1)
  const [backendError, setBackendError] = useState(null)
  const { status } = useSession()
  const [value, setValue] = React.useState(0)
  const [data, setData] = React.useState(active)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    console.log('value is')
    console.log(value)
    value === 0 ? setData(active) : setData(inactive)
  }, [value])

  /*const { loading, error, data } = useQuery(
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
  }*/

  const handlePageChange = (_, newPage) => setPage(newPage)
  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
  }
  const handleClick = (params) => {
    if (params.field === 'messages') {
      Router.push(`/messages`)
      return
    }
    if (params.field !== '__check__') Router.push(`/applications/${params.id}`)
  }

  // let rows = []
  const getRoows = (data) => {
    return data.map((item) => {
      const rowSpan = item.location.length
    })
  }

  // if (loading) return <PageLoadingCircle />

  if (status === 'unauthenticated') {
    Router.push({
      pathname: '/auth/login',
      query: {
        //change it to route from router
        from: '/my/events',
      },
    })
  }

  if (status === 'authenticated') {
    // if (!error) {
    // }

    return (
      <>
        <Layout title="Мои предложения о вывозе отходов | Recycl">
          <Grid
            container
            direction="column"
            style={{
              margin: '0 auto',
              padding: '16px',
            }}
          >
            <Typography gutterBottom variant="h4">
              Предложения о вывозе отходов
            </Typography>
            <Tabs value={value} handleChange={handleChange}>
              <Events rows={data} />
            </Tabs>
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
  return null
}
