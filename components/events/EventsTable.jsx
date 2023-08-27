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
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { useQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { inactive } from './data'

const PREFIX = 'EventsTable'

const classes = {
  root: `${PREFIX}-root`,
  noBorder: `${PREFIX}-noBorder`,
  row: `${PREFIX}-row`,
  actionsRow: `${PREFIX}-actionsRow`,
  cell: `${PREFIX}-cell`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus': {
      outline: 'none',
    },
  },

  [`& .${classes.noBorder}`]: {
    borderBottom: 'none',
  },

  [`& .${classes.row}`]: {
    '&:hover': {
      cursor: 'pointer',
    },
  },

  [`& .${classes.actionsRow}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&>*:not(:last-child)': {
      marginRight: '24px',
    },
  },

  [`& .${classes.cell}`]: {
    background: theme.palette.background.paper,
  },
}))

const columns = [
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
    width: 260,
    headerAlign: 'center',
  },
]

export default function EventsTable({ rows, variant }) {
  return (
    <Root style={{ width: '100%' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.width }}
                >
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell className={classes.cell} rowSpan={2}>
                      <Checkbox
                        color="primary"
                        checked={false}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    <TableCell className={classes.noBorder}>
                      {row.date}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.time}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.locations}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.wasteTypes}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.cell} colSpan={5}>
                      <Box className={classes.actionsRow}>
                        <Button
                          color="secondary"
                          // variant="body2"
                          href={`/my/events/edit/${row.id}`}
                          // component="button"
                          style={{
                            textTransform: 'none',
                          }}
                        >
                          Редактировать
                        </Button>
                        <Button
                          color="secondary"
                          style={{ textTransform: 'none' }}
                        >
                          {variant === 'inactive'
                            ? 'Активировать'
                            : 'Деактивировать'}
                        </Button>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <VisibilityIcon />
                          <span style={{ padding: '4px 8px' }}>
                            {Math.floor(Math.random() * 50)}
                          </span>
                        </span>
                      </Box>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Root>
  )
}
