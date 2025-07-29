import React, { useEffect, useState, ReactElement } from 'react'
import { Grid, Typography } from '@mui/material'
import Layout from '../layouts/Layout'
import Tabs from '../uiParts/Tabs'
import DataGridFooter from '../uiParts/DataGridFooter'
import NoRows from '../uiParts/NoRows'
import Error from '../uiParts/Error'
import EventsTable from './EventsTable'
import type {
  Event,
  EventPaginationData,
  Variant,
  Direction,
  EventActions,
  SortOrder,
  OrderBy,
} from '../../lib/types/event'
import { eventActions } from '../../lib/helpers/eventHelpers'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'

const { activate, deactivate, remove } = eventActions
const active: Variant = 'active'
const titleHeading = 'Мои объявления о вывозе отходов'
const errorMessage = 'Неизвестная ошибка'
const changeActivityRoute = 'changeActivity'
const deletionRoute = 'delete'
const api = '/api/events/'
const activeEventsRoute = '/my/events'
const inactiveEventsRoute = '/my/events/inactive'
const initialData: EventPaginationData = {
  total: 0,
  events: [],
  // currentPage: 0,
}

export default function Events(props: { variant: Variant }) {
  const { variant: initialVariant } = props

  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(1)
  const [numRows, setNumRows] = useState(0)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [backendError, setBackendError] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc')
  const [sortProperty, setSortProperty] = React.useState<OrderBy>('updatedAt')

  const handleVariantChange = (
    event: React.SyntheticEvent,
    newVariant: Variant,
  ) => {
    setPage(1)
    setVariant(newVariant)
    setSelected([])

    if (newVariant === active) {
      window.history.pushState(null, '', activeEventsRoute)
    } else {
      window.history.pushState(null, '', inactiveEventsRoute)
    }
  }

  const handleActivationDeactivationAndDeletion = async (
    eventIds: string[],
    action: keyof EventActions,
  ) => {
    if (!eventIds || eventIds.length === 0) return

    let actionRoute = ''

    switch (action) {
      case deactivate:
        actionRoute = changeActivityRoute
        break
      case activate:
        actionRoute = changeActivityRoute
        break
      case remove:
        actionRoute = deletionRoute
        break
      default:
        return
    }

    await fetch(`${api}${actionRoute}`, {
      method: 'POST',
      body:
        action === activate || action === deactivate
          ? JSON.stringify({ eventIds, action })
          : JSON.stringify({ eventIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setSelected([])
        }
      })
      .catch((error) => {
        setBackendError(errorMessage)
      })
  }

  const handleSelect = (row: Event) => {
    const selectedIndex = selected.indexOf(row._id as string)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row._id as string)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.events.map((row) => row._id as string)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleSort = (event: React.MouseEvent<unknown>, property) => {
    const isAsc = sortProperty === property && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortProperty(property)
    setPage(1)
  }

  const fetcher = async (): Promise<EventPaginationData> => {
    const data = await fetch(
      `${api}?${new URLSearchParams({
        variant,
        page: String(page - 1),
        pageSize: String(pageSize),
        orderBy: sortProperty,
        sortOrder,
      })}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json()
      })
      .then((newData) => {
        return newData
      })
      .catch((error) => {
        setBackendError(errorMessage)
      })

    return data
  }

  const setParams = (data: EventPaginationData) => {
    if (!data) return
    // if (page !== data.currentPage) {
    //   setPage(data.currentPage + 1)
    //   return
    // }
    const lastPage = Math.ceil(data.total / pageSize)

    if (data.total > 0 && page < lastPage && data.events.length < pageSize) {
      setPage(lastPage)
      return
    }
    setData(data.events)
    setNumRows(data.total)
  }

  useEffect(() => {
    setLoading(true)
    // setData(initialData)
    fetcher()
      .then((data) => {
        setParams(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [variant, page, pageSize, sortProperty, sortOrder])

  const handlePageChange = (_: unknown, newPage: number) => {
    if (numRows === 0) return

    setPage(newPage)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(1)
  }

  let content: ReactElement | null = null

  if (loading) {
    content = <PageLoadingCircle />
  } else if (backendError) {
    content = <Error />
  } else if (data.length > 0) {
    content = (
      <>
        <EventsTable
          variant={variant}
          rows={data}
          selectedRows={selected}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          handleActivationDeactivationAndDeletion={
            handleActivationDeactivationAndDeletion
          }
          handleSort={handleSort}
          fetcher={fetcher}
          setParams={setParams}
          sortProperty={sortProperty}
          sortOrder={sortOrder}
        />
        <DataGridFooter
          numRows={numRows}
          page={page}
          pageSize={pageSize}
          numSelected={selected.length}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
        />
      </>
    )
  } else {
    content = <NoRows />
  }

  return (
    <RedirectUnathenticatedUser>
      <Layout title={`${titleHeading} | Recycl`}>
        <Grid
          container
          direction="column"
          sx={{
            margin: '0 auto',
          }}
        >
          <Typography gutterBottom variant="h4" sx={{ mb: 4 }}>
            {titleHeading}
          </Typography>
          <Tabs value={variant} handleChange={handleVariantChange}>
            {content}
          </Tabs>
        </Grid>
      </Layout>
    </RedirectUnathenticatedUser>
  )
}
