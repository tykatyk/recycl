import React, { useEffect, useCallback, useState, ReactElement } from 'react'
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
} from '../../lib/types/event'
import { eventActions } from '../../lib/helpers/eventHelpers'
import { _id } from '@next-auth/mongodb-adapter'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'

const { activate, deactivate, remove } = eventActions
const active: Variant = 'active'
const prev: Direction = 'prev'
const next: Direction = 'next'
const titleHeading = 'Мои предложения о вывозе отходов'
const errorMessage = 'Неизвестная ошибка'
const changeActivityRoute = 'changeActivity'
const deletionRoute = 'delete'
const api = '/api/events/'
const activeEventsRoute = '/my/events'
const inactiveEventsRoute = '/my/events/inactive'
const initialData: EventPaginationData = {
  total: 0,
  events: [],
  currentPage: 0,
}

export default function Events(props: { variant: Variant }) {
  const { variant: initialVariant } = props

  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(1)
  const [numRows, setNumRows] = useState(0)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [direction, setDirection] = useState('')
  const [backendError, setBackendError] = useState('')
  const [data, setData] = useState<EventPaginationData>(initialData)
  const [loading, setLoading] = useState(false)

  const handleVariantChange = (
    event: React.SyntheticEvent,
    newVariant: Variant,
  ) => {
    setDirection('')
    setPage(0)
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

  const fetcher = useCallback(async (): Promise<EventPaginationData> => {
    const data = await fetch(
      `${api}?${new URLSearchParams({
        variant,
        direction,
        page: String(page),
        pageSize: String(pageSize),
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
  }, [variant, page, pageSize])

  const setParams = useCallback(
    (data: EventPaginationData) => {
      setData(data)
      setNumRows(data.total)
      setPage(data.currentPage)
    },
    [data],
  )

  useEffect(() => {
    setLoading(true)
    setData(initialData)
    fetcher()
      .then((data) => {
        setParams(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [variant, page, pageSize])

  const handlePageChange = (_: unknown, newPage: number) => {
    if (numRows === 0) return

    if (newPage - page > 0) {
      setDirection(next)
    } else {
      setDirection(prev)
    }
    setPage(newPage)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
    setDirection('')
  }

  let content: ReactElement | null = null

  if (loading) {
    content = <PageLoadingCircle />
  } else if (backendError) {
    content = <Error />
  } else if (data && data.events.length > 0) {
    content = (
      <>
        <EventsTable
          variant={variant}
          rows={data.events}
          selectedRows={selected}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          handleActivationDeactivationAndDeletion={
            handleActivationDeactivationAndDeletion
          }
          fetcher={fetcher}
          setParams={setParams}
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
