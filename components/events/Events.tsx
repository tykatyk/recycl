import React, { useEffect, useCallback, useState } from 'react'
import { Grid, Typography } from '@mui/material'
import Layout from '../layouts/Layout'
import Tabs from '../uiParts/Tabs'
import DataGridFooter from '../uiParts/DataGridFooter'
import NoRows from '../uiParts/NoRows'
import Error from '../uiParts/Error'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import EventsTable from './EventsTable'
import { EventProps, Variant } from '../../lib/types/event'

export default function Events(props: EventProps) {
  const FORWARD = 'forward'
  const BACKWARD = 'backward'
  const { variant: initialVariant } = props
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [offset, setOffset] = useState('')
  const [pageSize, setPageSize] = useState(1)
  const [numRows, setNumRows] = useState(0)
  const [variant, setVariant] = useState<Variant>(initialVariant)
  const [direction, setDirection] = useState(FORWARD)
  const [backendError, setBackendError] = useState('')
  const { status } = useSession()
  const [data, setData] = useState([])

  const titleHeading = 'Мои предложения о вывозе отходов'

  const handleChange = (event: React.SyntheticEvent, newValue: Variant) => {
    setVariant(newValue)
    setSelected([])
    if (newValue === 'active') {
      window.history.pushState(null, '', '/my/events')
    } else {
      window.history.pushState(null, '', `/my/events/${newValue}`)
    }
  }

  const handleDisable = (row) => {
    handleMassDeactivationDeletion([row._id], 'inactivate')
  }

  const handleMassDeactivationDeletion = async (
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

    fetch(`/api/events/${route}`, {
      method: 'POST',
      body: JSON.stringify({ eventIds }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(response.status)
        if (response.status === 200) {
          console.log('Events deactivated successfully')
          // refetch events
          fetcher()
        }
      })
      .catch((error) => {
        console.log(error)
        setBackendError('Ошибка при сохранении')
      })
  }

  const handleCheckboxClick = (row) => {
    const selectedIndex = selected.indexOf(row._id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row._id)
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

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row._id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const fetcher = useCallback(() => {
    fetch(
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
        console.log('error is')
        console.log(error)
        setBackendError('Неизвестная ошибка')
      })
  }, [variant, offset, pageSize])

  useEffect(() => {
    fetcher()
  }, [variant, offset, pageSize])

  const handlePageChange = (_, newPage) => {
    if (numRows > 0) {
      if (newPage - page > 0) {
        setDirection(BACKWARD)
        setOffset(data[data.length - 1]._id)
      } else {
        setDirection(FORWARD)
        setOffset(data[0]._id)
      }
    }
    setPage(newPage)
  }

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10))
    setPage(0)
    setOffset('')
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
    let content = null

    //ToDo: Add loading overlay
    if (data && data.length === 0) {
      content = <NoRows />
    }
    if (backendError) content = <Error />
    if (data && data.length > 0) {
      content = (
        <>
          <EventsTable
            variant={variant}
            rows={data}
            handleCheckboxClick={handleCheckboxClick}
            handleDisable={handleDisable}
            handleMassDeactivationDeletion={handleMassDeactivationDeletion}
            selectedRows={selected}
            handleSelectAllClick={handleSelectAllClick}
          />
          <DataGridFooter
            numRows={numRows}
            page={page}
            pageSize={pageSize}
            selected={selected}
            handlePageChange={handlePageChange}
            handlePageSizeChange={handlePageSizeChange}
          />
        </>
      )
    }

    return (
      <>
        <Layout title={`${titleHeading} | Recycl`}>
          <Grid
            container
            direction="column"
            sx={{
              margin: '0 auto',
            }}
          >
            <>
              <Typography gutterBottom variant="h4" sx={{ mb: 4 }}>
                {titleHeading}
              </Typography>
              <Tabs value={variant} handleChange={handleChange}>
                {content}
              </Tabs>
            </>
          </Grid>
        </Layout>
      </>
    )
  }
  return null
}
