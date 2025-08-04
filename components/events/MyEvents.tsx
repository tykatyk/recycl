import React, { useEffect, useState, ReactElement } from 'react'
import PaginationItem from '@mui/material/PaginationItem'

import { Grid, Typography, PaginationRenderItemParams } from '@mui/material'
import Layout from '../layouts/Layout'
import Tabs from '../uiParts/Tabs'
import DataGridFooter from '../uiParts/DataGridFooter'
import NoRows from '../uiParts/NoRows'
import Error from '../uiParts/Error'
import Link from '../uiParts/Link'
// import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'

import EventsTable from './EventsTable'
import type {
  Event,
  Variant,
  EventActions,
  SortOrder,
  OrderBy,
} from '../../lib/types/event'
import { eventActions } from '../../lib/helpers/eventHelpers'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'

const { activate, deactivate, remove } = eventActions
const active: Variant = 'active'
const titleHeading = 'Мои объявления о вывозе отходов'
const errorMessage = 'Неизвестная ошибка'
const changeActivityRoute = 'changeActivity'
const deletionRoute = 'delete'
const apiPrefix = '/api/events/'
const apiGetTotal = `${apiPrefix}total/`
const activeEventsRoute = '/my/events'
const inactiveEventsRoute = '/my/events/inactive'

export default function MyEvents(props: {
  variant: Variant
  initialPage: number
  initialPageSize: number
}) {
  const { variant: initialVariant, initialPage, initialPageSize } = props

  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [total, setTotal] = useState(0)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [backendError, setBackendError] = useState('')
  const [data, setData] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('desc')
  const [sortProperty, setSortProperty] = React.useState<OrderBy>('updatedAt')
  const [changedRows, setChangedRows] = useState<string[]>([])
  const [rowAction, setRowAction] = useState<keyof EventActions | ''>('')
  const [shouldReload, setShouldReload] = useState(Date.now())
  console.log(page)
  const renderItem = (item: PaginationRenderItemParams) => {
    const activity = variant === active ? '' : '/inactive'
    const href = `/my/events${activity}${item.page === 1 ? '' : `?page=${item.page}&pageSize=${pageSize}`}`

    return <PaginationItem component={Link} href={href} {...item} />
  }

  const handleVariantChange = (
    event: React.SyntheticEvent,
    newVariant: Variant,
  ) => {
    setChangedRows([])
    setSelectedRows([])
    setPage(1)
    setVariant(newVariant)

    if (newVariant === active) {
      window.history.pushState(null, '', activeEventsRoute)
    } else {
      window.history.pushState(null, '', inactiveEventsRoute)
    }
  }

  const handleActivationDeactivationAndDeletion = async (
    ids: string[],
    action: keyof EventActions,
  ) => {
    if (!ids || ids.length === 0) return

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

    await fetch(`${apiPrefix}${actionRoute}`, {
      method: 'POST',
      body:
        action === activate || action === deactivate
          ? JSON.stringify({ eventIds: ids, action })
          : JSON.stringify({ ids }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const handleAction = async (ids: string[], action: keyof EventActions) => {
    setRowAction(action)
    await handleActivationDeactivationAndDeletion(ids, action)
      .then(() => {
        setChangedRows(ids)
        setTimeout(() => {
          setSelectedRows((prevSelected) => {
            return prevSelected.filter((element) => {
              return ids.indexOf(element) >= 0
            })
          })
          setChangedRows([])
          setShouldReload(Date.now())
        }, 500)
      })
      .catch(() => {
        setBackendError(errorMessage)
        setChangedRows([])
      })
      .finally(() => {
        setRowAction('')
      })
  }

  const handleSelect = (row: Event) => {
    const selectedIndex = selectedRows.indexOf(row._id as string)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, row._id as string)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1))
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      )
    }

    setSelectedRows(newSelected)
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row._id as string)
      setSelectedRows(newSelected)
      return
    }
    setSelectedRows([])
  }

  const handleSort = (event: React.MouseEvent<unknown>, property: OrderBy) => {
    const isAsc = sortProperty === property && sortOrder === 'asc'
    setSortOrder(isAsc ? 'desc' : 'asc')
    setSortProperty(property)
    setPage(1)
  }

  const fetchTotal = async (): Promise<number> => {
    return await fetch(
      `${apiGetTotal}?${new URLSearchParams({
        variant,
      })}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => {
        return response.json()
      })
      .then((total) => {
        return total
      })
      .catch((error) => {
        setBackendError(errorMessage)
        return 0
      })
  }

  const fetchEvents = async (): Promise<Event[]> => {
    return await fetch(
      `${apiPrefix}?${new URLSearchParams({
        variant,
        page: String(page - 1),
        pageSize: String(pageSize),
        orderBy: sortProperty, //ToDo: change orderBy to sortProperty
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
      .then((newData: Event[]) => {
        return newData
      })
      .catch((_) => {
        setBackendError(errorMessage)
        return []
      })
  }

  useEffect(() => {
    setSelectedRows([])
    setChangedRows([])
    setLoading(true)

    fetchTotal().then((total) => {
      setTotal(total)
    })
    fetchEvents()
      .then((data) => {
        if (!data) return

        const lastPage = Math.ceil(total / pageSize)

        if (total > 0 && page != lastPage && data.length < pageSize) {
          setPage(lastPage)
          return
        }
        setData(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [variant, page, pageSize, sortProperty, sortOrder, shouldReload])

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(1)
  }

  let content: ReactElement = <NoRows />

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
          selectedRows={selectedRows}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          handleAction={handleAction}
          handleSort={handleSort}
          fetcher={fetchEvents}
          sortProperty={sortProperty}
          sortOrder={sortOrder}
          changedRows={changedRows}
          rowAction={rowAction}
        />
        <DataGridFooter
          numRows={total}
          page={page}
          pageSize={pageSize}
          numSelected={selectedRows.length}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          renderItem={renderItem}
        />
      </>
    )
  }

  return (
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
  )
}
