import React, { useEffect, useState, ReactElement } from 'react'
import PaginationItem from '@mui/material/PaginationItem'
import { useRouter } from 'next/router'
import { Grid, Typography, PaginationRenderItemParams } from '@mui/material'
import Layout from '../layouts/Layout'
import Tabs from '../uiParts/Tabs'
import DataGridFooter from '../uiParts/DataGridFooter'
import NoRows from '../uiParts/NoRows'
import Error from '../uiParts/Error'
import Link from '../uiParts/Link'
import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'

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
const updatedAt = 'updatedAt'
const desc = 'desc'

export default function MyEvents(props: { variant: Variant }) {
  const router = useRouter()
  const query = router.query
  const { variant: initialVariant } = props
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(rowsPerPageOptions[0])
  const [total, setTotal] = useState(0)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [backendError, setBackendError] = useState('')
  const [data, setData] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(desc)
  const [sortProperty, setSortProperty] = React.useState<OrderBy>(updatedAt)
  const [changedRows, setChangedRows] = useState<string[]>([])
  const [rowAction, setRowAction] = useState<keyof EventActions | ''>('')
  const [shouldReload, setShouldReload] = useState(false)

  const renderItem = (item: PaginationRenderItemParams) => {
    const href = getHref({ page: item.page || 1 })

    return <PaginationItem component={Link} href={href} {...item} />
  }

  const getHref = (options) => {
    const {
      page: qPage = page,
      pageSize: qPageSize = pageSize,
      sortProperty: qSortProperty = sortProperty,
      sortOrder: qSortOrder = sortOrder,
    } = options
    const activity = variant === active ? '' : '/inactive'
    let hrefQuery = ''
    if (qPage !== 1 || qPageSize !== rowsPerPageOptions[0]) {
      hrefQuery = `${hrefQuery}&page=${qPage}&pageSize=${qPageSize}`
    }
    // console.log(qSortOrder)

    if (qSortProperty !== updatedAt) {
      // const isAsc = sortProperty === property && sortOrder === 'asc'
      // setSortOrder(isAsc ? 'desc' : 'asc')

      // hrefQuery = `${hrefQuery}&orderBy=${qSortProperty}`
      hrefQuery = `${hrefQuery}&orderBy=${qSortProperty}&sortOrder=${qSortOrder}`
      // } else {
      //    hrefQuery = `${hrefQuery}&sortOrder=${qSortOrder}`
      // }
      // if (qSortOrder === desc) {
      //   hrefQuery = `${hrefQuery}&sortOrder=asc`
      // } else {
      //   hrefQuery = `${hrefQuery}&sortOrder=${desc}`
    }
    if (hrefQuery.length > 0) hrefQuery = `?${hrefQuery.substring(1)}`

    return `/my/events${activity}${hrefQuery}`
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
      router.push(activeEventsRoute)
    } else {
      router.push(inactiveEventsRoute)
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
          setShouldReload(true)
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
    // setSortOrder(isAsc ? 'desc' : 'asc')
    // setSortProperty(property)
    // setPage(1)
    const href = getHref({
      page: 1,
      sortProperty: property,
      sortOrder: isAsc ? 'desc' : 'asc',
    })
    // console.log(href)
    router.push(href)
  }

  const fetchTotal = async (options): Promise<number> => {
    return await fetch(`${apiGetTotal}?${new URLSearchParams(options)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
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

  const fetchEvents = async (options): Promise<Event[]> => {
    return await fetch(`${apiPrefix}?${new URLSearchParams(options)}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
    const prc = async () => {
      const {
        page: initialPage,
        pageSize: initialPageSize,
        orderBy: initialOrderBy,
        sortOrder: initialSortOrder,
      } = query
      const validSortOrder: SortOrder[] = ['asc', 'desc']
      // console.log(
      //   validSortOrder[validSortOrder.indexOf(initialSortOrder as SortOrder)],
      // )

      const validatedSortOrder =
        typeof initialSortOrder === 'string' &&
        validSortOrder.indexOf(initialSortOrder as SortOrder) >= 0
          ? validSortOrder[
              validSortOrder.indexOf(initialSortOrder as SortOrder)
            ]
          : 'desc'
      // console.log(initialSortOrder)
      // console.log(validSortOrder.indexOf('asc' as SortOrder) > 0)
      const validOrderBy: OrderBy[] = ['date', 'location', 'updatedAt', 'waste']

      const validatedOrderBy =
        typeof initialOrderBy === 'string' &&
        validOrderBy.indexOf(initialOrderBy as OrderBy) >= 0
          ? validOrderBy[validOrderBy.indexOf(initialOrderBy as OrderBy)]
          : 'updatedAt'

      const validatedPage =
        typeof initialPage === 'string' &&
        !Number.isNaN(parseInt(initialPage, 10))
          ? Math.max(parseInt(initialPage, 10), 1)
          : 1

      const validatedPageSize =
        typeof initialPageSize === 'string' &&
        !Number.isNaN(parseInt(initialPageSize, 10)) &&
        rowsPerPageOptions.indexOf(parseInt(initialPageSize, 10)) >= 0
          ? rowsPerPageOptions[
              rowsPerPageOptions.indexOf(parseInt(initialPageSize, 10))
            ]
          : rowsPerPageOptions[0]

      setSortOrder(validatedSortOrder)
      setSortProperty(validatedOrderBy)
      setPage(validatedPage)
      setPageSize(validatedPageSize)

      setLoading(true)
      const data = await fetchEvents({
        variant,
        page: String(validatedPage - 1),
        pageSize: String(validatedPageSize),
        orderBy: validatedOrderBy, //ToDo: change orderBy to sortProperty
        sortOrder: validatedSortOrder,
      })
      const total = await fetchTotal({
        variant,
      })
      setLoading(false)

      if (shouldReload) {
        const lastPage = Math.ceil(total / validatedPageSize)
        if (
          total > 0 &&
          validatedPage != lastPage &&
          data.length < validatedPageSize
        ) {
          const href = getHref({ page: lastPage })
          router.push(href)
          // return
        }
        setShouldReload(false)
      }

      setSelectedRows([])
      setChangedRows([])

      setData(data)
      setTotal(total)
    }
    prc()
  }, [query, shouldReload])

  const handlePageChange = (_: unknown, newPage: number) => {
    const href = getHref({ page: newPage })
    router.push(href)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const href = getHref({
      page: 1,
      pageSize: parseInt(event.target.value, 10),
    })
    router.push(href)
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
          // fetcher={fetchEvents}
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
