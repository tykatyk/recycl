import React, { useState } from 'react'
import {
  Grid,
  Typography,
  Badge,
  makeStyles,
  TablePagination,
  TableContainer,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from '@material-ui/core'
import Link from '../uiParts/Link'
import Tabs from '../uiParts/Tabs'
import VisibilityIcon from '@material-ui/icons/Visibility'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import { useQuery, useMutation } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { inactive } from './data'

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
    id: 'checkbox',
    headerName: 'Выбрать',
    width: 70,
  },

  {
    id: 'location',
    headerName: 'Место',
    width: 170,
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
    id: 'wasteType',
    headerName: 'Тип отходов',
    width: 260,
    headerAlign: 'center',
  },
]

export default function EventsTable({ rows, variant }) {
  const classes = useStyles()

  return (
    <div style={{ width: '100%' }}>
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
                    <TableCell rowSpan={2}>
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
                      {row.locations}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.time}
                    </TableCell>
                    <TableCell className={classes.noBorder}>
                      {row.wasteTypes}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Link
                        color="secondary"
                        href={`/my/events/edit/${row.id}`}
                      >
                        Редактировать
                      </Link>
                    </TableCell>
                    <TableCell colSpan={2}>
                      <Button
                        color="secondary"
                        style={{ textTransform: 'none' }}
                      >
                        {variant === 'inactive'
                          ? 'Активировать'
                          : 'Деактивировать'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div
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
                      </div>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
