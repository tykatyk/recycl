import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import {
  Grid,
  Typography,
  Badge,
  TableContainer,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
  Box,
} from '@mui/material'
import Link from '../uiParts/Link'
import Tabs from '../uiParts/Tabs'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { useQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { inactive, EventsData } from './data'
import clsx from 'clsx'
import { Variant } from '../../lib/types/frontend/removalEventTypes'

const Root = styled('div')(({ theme }) => ({
  width: '100%',

  '& .noBorder>td:not(:first-child), & .spacer': {
    borderBottom: 'none',
    borderTop: 'none',
  },
  '& .dataRow td': {
    ...theme.typography.body1,
  },

  '& .actionsRow': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&>*:not(:last-child)': {
      marginRight: '24px',
    },
  },

  '& .header>th': {
    textTransform: 'uppercase',
    borderBottom: 'none',
    background: theme.palette.primary.main,
  },

  '& tbody td:not(.spacer)': {
    background: theme.palette.background.paper,
  },

  '& .button': {
    fontWeight: theme.typography.fontWeightLight,
    textTransform: 'none',
    color: '#fff',
  },
}))
type ColumnProps = {
  id: string
  headerName: string
  width: number
  headerAlign?: 'left' | ' right' | 'center'
}
const columns: ColumnProps[] = [
  {
    id: 'checkbox',
    headerName: 'Выбрать',
    width: 70,
  },
  {
    id: 'date',
    headerName: 'Дата',
    width: 150,
  },
  {
    id: 'time',
    headerName: 'Время',
    width: 150,
    headerAlign: 'center',
  },
  {
    id: 'location',
    headerName: 'Место',
    width: 170,
  },
  {
    id: 'wasteType',
    headerName: 'Тип отходов',
    width: 200,
    headerAlign: 'center',
  },
]

const Spacer = () => {
  return (
    <TableRow>
      <TableCell className="spacer" sx={{ p: 1 }} colSpan={5}></TableCell>
    </TableRow>
  )
}

type EventsTableProps = {
  rows: EventsData[]
  variant: Variant
}
export default function EventsTable({ rows, variant }: EventsTableProps) {
  return (
    <Root>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="header">
              {columns.map((column) => (
                <TableCell key={column.id} sx={{ minWidth: column.width }}>
                  {column.id !== 'checkbox' ? (
                    column.headerName
                  ) : (
                    <Checkbox
                      color="secondary"
                      checked={false}
                      inputProps={{
                        'aria-label': 'Выбрать все',
                      }}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
            <Spacer />
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <React.Fragment key={index}>
                  <TableRow className={clsx('noBorder', 'dataRow')}>
                    <TableCell rowSpan={2}>
                      <Checkbox
                        color="secondary"
                        checked={false}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.locations}</TableCell>
                    <TableCell>{row.wasteTypes}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Box className={'actionsRow'}>
                        <Button
                          color="secondary"
                          href={`/my/events/edit/${row.id}`}
                          className="button"
                          startIcon={<EditIcon />}
                        >
                          Редактировать
                        </Button>
                        <Button
                          color="secondary"
                          className="button"
                          startIcon={
                            variant === 'inactive' ? (
                              <RestartAltIcon />
                            ) : (
                              <DeleteIcon />
                            )
                          }
                        >
                          {variant === 'inactive'
                            ? 'Активировать'
                            : 'Деактивировать'}
                        </Button>
                        <Box
                          component="span"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            fontWeight: 'fontWeightLight',
                          }}
                        >
                          <VisibilityIcon sx={{ fontSize: '1.25rem' }} />
                          <Box component="span" sx={{ p: '4px 8px' }}>
                            {Math.floor(Math.random() * 50)}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {index !== rows.length - 1 && <Spacer />}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  )
}
