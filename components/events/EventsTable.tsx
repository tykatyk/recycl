import React, { useState, useCallback, ReactNode } from 'react'
import { styled } from '@mui/material/styles'
import {
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
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import clsx from 'clsx'
import { Variant, Event } from '../../lib/types/event'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { getColumns } from '../../lib/helpers/eventHelpers'

const Root = styled('div')(({ theme }) => ({
  width: '100%',

  '& .noBorder>td, & .spacer': {
    borderBottom: 'none',
    borderTop: 'none',
  },
  '& .dataRow td': {
    ...theme.typography.body1,
  },

  '& .actions': {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '&>*:not(:last-child)': {
      marginRight: '32px',
    },
  },

  '& .actionsRow td': {
    border: 'none',
  },

  '& .header>th': {
    textTransform: 'uppercase',
    borderBottom: 'none',
  },

  '& tbody td:not(.spacer)': {
    background: '#1d303a',
  },

  '& .button': {
    fontWeight: theme.typography.fontWeightLight,
    textTransform: 'none',
  },
}))

const Spacer = () => {
  return (
    <TableRow>
      <TableCell className="spacer" sx={{ p: 2 }} colSpan={5}></TableCell>
    </TableRow>
  )
}

type EventsTableProps = {
  variant: Variant
  rows: Event[]
  selectedRows: string[]
  handleSelect: (row: Event) => void
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDeactivationAndDeletion: (
    eventIds: string[] | undefined,
    action: 'inactivate' | 'delete',
  ) => Promise<void>
}

export default function EventsTable({
  variant,
  rows,
  selectedRows,
  handleSelect,
  handleSelectAll,
  handleDeactivationAndDeletion,
}: EventsTableProps) {
  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const getHeader = useCallback<() => ReactNode | 'Дата'>(() => {
    if (selectedRows.length > 0) {
      const action = variant === 'inactive' ? 'delete' : 'inactivate'
      const buttonText = variant === 'inactive' ? 'Удалить' : 'Деактивировать'

      return (
        <Button
          color="secondary"
          disabled={buttonDisabled}
          onClick={async () => {
            setButtonDisabled(true)
            await handleDeactivationAndDeletion(selectedRows, action)
            setButtonDisabled(false)
          }}
        >
          {buttonText}
        </Button>
      )
    }
    return 'Дата'
  }, [variant, selectedRows])

  return (
    <Root>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="header">
              {getColumns(getHeader).map((column) => (
                <TableCell key={column.id} sx={{ minWidth: column.width }}>
                  {column.id !== 'checkbox' ? (
                    column.headerName
                  ) : (
                    <Checkbox
                      color="secondary"
                      checked={rows && selectedRows.length > 0}
                      inputProps={{
                        'aria-label': 'Выбрать все',
                      }}
                      onChange={(e) => {
                        handleSelectAll(e)
                      }}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
            <Spacer />
          </TableHead>
          <TableBody>
            {rows.map((row: Event, index: number) => {
              const labelId = `enhanced-table-checkbox-${index}`
              const isItemSelected = isSelected(row._id as string)

              return (
                <React.Fragment key={index}>
                  <TableRow className={clsx('noBorder', 'dataRow')}>
                    <TableCell
                      rowSpan={2}
                      onClick={() => {
                        handleSelect(row)
                      }}
                    >
                      <Checkbox
                        color="secondary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {dayjs(row.date).locale('ru').format('D MMMM')}
                    </TableCell>
                    <TableCell>
                      {dayjs(row.date).locale('ru').format('HH:mm')}
                    </TableCell>
                    <TableCell>
                      {row.location?.structured_formatting.main_text}
                    </TableCell>
                    <TableCell>
                      {
                        //though we know that the type of row.waste is object here,
                        //we use type narrowing to prevent Typescript error
                        typeof row.waste !== 'string'
                          ? row.waste.name
                          : row.waste
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow className={'actionsRow'}>
                    <TableCell colSpan={3}>
                      <Box className={'actions'}>
                        <Button
                          color="secondary"
                          href={`/my/events/edit/${row._id}`}
                          className="button"
                          startIcon={<EditIcon />}
                        >
                          {'Редактировать'}
                        </Button>
                        <Button
                          color="secondary"
                          className="button"
                          disabled={buttonDisabled}
                          onClick={async () => {
                            setButtonDisabled(true)

                            //Just another check to prevent Typescript error
                            if (!row._id) return

                            if (variant === 'inactive') {
                              await handleDeactivationAndDeletion(
                                [row._id],
                                'delete',
                              )
                            }
                            if (variant === 'active') {
                              await handleDeactivationAndDeletion(
                                [row._id],
                                'inactivate',
                              )
                            }
                            setButtonDisabled(false)
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          {variant === 'inactive'
                            ? 'Удалить'
                            : 'Деактивировать'}
                        </Button>
                      </Box>
                    </TableCell>
                    <TableCell>
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
                          {row.viewCount}
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
