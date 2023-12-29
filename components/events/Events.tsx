import React, { useEffect, useCallback, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import Layout from '../layouts/Layout'
import Tabs from '../uiParts/Tabs'
import DataGridFooter from '../uiParts/DataGridFooter'
import NoRows from '../uiParts/NoRows'
import Error from '../uiParts/Error'
import EventsTable from './EventsTable'
import { Event, Variant } from '../../lib/types/event'
import { _id } from '@next-auth/mongodb-adapter'
import RedirectUnathenticatedUser from '../uiParts/RedirectUnathenticatedUser'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'

export default function Events(props: { variant: Variant }) {
  const forward = 'forward'
  const backward = 'backward'
  const titleHeading = 'Мои предложения о вывозе отходов'
  const errorMessage = 'Неизвестная ошибка'

  const { variant: initialVariant } = props

  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [offset, setOffset] = useState('')
  const [pageSize, setPageSize] = useState(1)
  const [numRows, setNumRows] = useState(0)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [direction, setDirection] = useState(forward)
  const [backendError, setBackendError] = useState('')
  const [data, setData] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)

  const handleVariantChange = (
    event: React.SyntheticEvent,
    newValue: Variant,
  ) => {
    setVariant(newValue)
    setSelected([])

    if (newValue === 'active') {
      window.history.pushState(null, '', '/my/events')
    } else {
      window.history.pushState(null, '', `/my/events/${newValue}`)
    }
  }

  const handleDisable = (row: Event) => {
    handleMassDeactivationAndDeletion([row._id as string], 'inactivate')
  }

  const handleMassDeactivationAndDeletion = async (
    eventIds: string[] = [],
    action: 'inactivate' | 'delete',
  ) => {
    if (
      (action !== 'inactivate' && action !== 'delete') ||
      eventIds.length === 0
    )
      return

    let route = ''

    switch (action) {
      case 'inactivate':
        route = 'mass-deactivation'
        break
      case 'delete':
        route = 'mass-deletion'
        break
      default:
        return
    }
    setLoading(true)
    await fetch(`/api/events/${route}`, {
      method: 'POST',
      body: JSON.stringify({ eventIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.status === 200) {
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
    let newSelected: readonly string[] = []

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
      `/api/events?${new URLSearchParams({
        variant,
        offset,
        direction,
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
      .then((data) => {
        setData(data.events)
        setNumRows(data.total)
      })
      .catch((error) => {
        setBackendError(errorMessage)
      })
    setLoading(false)
  }, [variant, offset, pageSize])

  useEffect(() => {
    fetcher()
  }, [variant, offset, pageSize])

  const handlePageChange = (_: unknown, newPage: number) => {
    if (numRows > 0) {
      if (newPage - page > 0) {
        setDirection(backward)
        setOffset(data[data.length - 1]._id as string)
      } else {
        setDirection(forward)
        setOffset(data[0]._id as string)
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
          handleCheckboxClick={handleSelect}
          handleDisable={handleDisable}
          handleMassDeactivationDeletion={handleMassDeactivationAndDeletion}
          selectedRows={selected}
          handleSelectAll={handleSelectAll}
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
