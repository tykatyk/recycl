import React, { useEffect, useCallback, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import Layout from '../layouts/Layout'
import Tabs from '../uiParts/Tabs'
import DataGridFooter from '../uiParts/DataGridFooter'
import NoRows from '../uiParts/NoRows'
import Error from '../uiParts/Error'
import EventsTable from './EventsTable'
import type {
  Event,
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
let dateTimeBound = new Date()

export default function Events(props: { variant: Variant }) {
  const { variant: initialVariant } = props

  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [offset, setOffset] = useState('')
  const [offsetDate, setOffsetDate] = useState('')
  const [pageSize, setPageSize] = useState(1)
  const [numRows, setNumRows] = useState(0)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [direction, setDirection] = useState('')
  const [backendError, setBackendError] = useState('')
  const [data, setData] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  const handleVariantChange = (
    event: React.SyntheticEvent,
    newVariant: Variant,
  ) => {
    setDirection('')
    setOffset('')
    setOffsetDate('')
    setPage(0)
    setVariant(newVariant)
    setSelected([])

    if (newVariant === active) {
      window.history.pushState(null, '', activeEventsRoute)
    } else {
      window.history.pushState(null, '', inactiveEventsRoute)
    }
  }

  const handleDeactivationAndDeletion = async (
    eventIds: string[] = [],
    action: keyof EventActions,
  ) => {
    if (eventIds.length === 0) return

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
    setLoading(true)
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
          setDirection('next')
          setOffset(data[0]._id)
          setOffsetDate(data[0].date)
          // refetch events
          fetcher()
        }
      })
      .catch((error) => {
        setBackendError(errorMessage)
      })
    setLoading(false)
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
      const newSelected = data.map((row) => row._id as string)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const fetcher = useCallback(async () => {
    setLoading(true)
    await fetch(
      `${api}?${new URLSearchParams({
        variant,
        offset,
        offsetDate,
        direction,
        pageSize: String(pageSize),
        dateTimeBound: dateTimeBound.toISOString(),
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
      .then((data) => {
        setData(data.events)
        setNumRows(data.total)
      })
      .catch((error) => {
        setBackendError(errorMessage)
      })
    setLoading(false)
  }, [variant, offset, offsetDate, pageSize])

  useEffect(() => {
    fetcher()
  }, [variant, offset, offsetDate, pageSize])

  const handlePageChange = (_: unknown, newPage: number) => {
    if (newPage === 0) dateTimeBound = new Date()
    if (numRows > 0) {
      if (newPage - page > 0) {
        setDirection(next)
        setOffset(data[data.length - 1]._id as string)
        setOffsetDate(data[data.length - 1].date)
      } else {
        setDirection(prev)
        setOffset(data[0]._id as string)
        setOffsetDate(data[0].date)
      }
    }
    setPage(newPage)
  }

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
    setOffset('')
    setOffsetDate('')
    setDirection('')
  }

  let content = <NoRows />

  if (loading) content = <PageLoadingCircle />

  if (backendError) content = <Error />

  if (data && data.length > 0) {
    content = (
      <>
        <EventsTable
          variant={variant}
          rows={data}
          selectedRows={selected}
          handleSelect={handleSelect}
          handleSelectAll={handleSelectAll}
          handleDeactivationAndDeletion={handleDeactivationAndDeletion}
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
