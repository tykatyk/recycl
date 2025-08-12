import React, {
  useState,
  useRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
} from 'react'

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
  TableSortLabel,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import clsx from 'clsx'
import type {
  Variant,
  Event,
  IsInactive,
  EventActions,
  SortOrder,
} from '../../lib/types/event'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import {
  columns,
  eventActions,
  eventVariants,
  adjustOverlay,
  overlayResizeHandler,
} from '../../lib/helpers/eventHelpers'
import type { Options, ConfigOptions } from '../../lib/helpers/eventHelpers'
import { date } from '../../lib/validation/atomicValidators'
import { Root, Spacer, Overlay, Error } from '../uiParts/EventTableParts'
import { visuallyHidden } from '@mui/utils'

const isInactive: IsInactive = {
  isInactive: '1',
}

type EventsTableProps = {
  variant: Variant
  rows: Event[]
  selectedRows: string[]
  handleSelect: (row: Event) => void
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleAction: (ids: string[], action: keyof EventActions) => Promise<void>
  handleSort: (event: React.MouseEvent<unknown>, property: any) => void
  sortProperty: string
  sortOrder: SortOrder
  changedRows: string[]
  rowAction: keyof EventActions | ''
}

const { activate, deactivate, remove } = eventActions
const { inactive } = eventVariants
const validationErrorMsg = 'Дата и время в объявлении меньше текущих'
const deleteBtnText = 'Удалить'
const deactivateBtnText = 'Деактивировать'
const selectAllBtnText = 'Выбрать все'
const editBtnText = 'Редактировать'
const activateBtnText = 'Активировать'
const wasteTypeText = 'Тип отходов'
const editRoute = '/my/events/edit/'
const actionBtnStyles = {
  color: '#fff',
  '&:hover': {
    color: '#f8bc45',
  },
}

export default function EventsTable({
  variant,
  rows,
  selectedRows,
  handleSelect,
  handleSelectAll,
  handleSort,
  handleAction,
  sortProperty,
  sortOrder,
  changedRows,
  rowAction,
}: EventsTableProps) {
  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1
  const [validationError, setValidationError] = useState('')
  const [staleAd, setStaleAd] = useState('')
  const rowRefs = useRef<ConfigOptions['rowRefs']>({})
  const overlayRefs = useRef<ConfigOptions['overlayRefs']>({})

  const options: Options = {
    rowRefs,
    overlayRefs,
    rowsToDisableButtons: changedRows,
  }

  useEffect(() => {
    adjustOverlay(options)
  }, [changedRows])

  useLayoutEffect(() => {
    window.addEventListener('resize', () => {
      overlayResizeHandler(options)
    })

    overlayResizeHandler(options)

    return () => {
      window.removeEventListener('resize', () => {
        overlayResizeHandler(options)
      })
    }
  }, [changedRows])

  const getHeader = (): ReactNode | string => {
    const action = variant === inactive ? remove : deactivate
    const buttonText = variant === inactive ? deleteBtnText : deactivateBtnText

    return (
      <Button
        color="secondary"
        disabled={changedRows.length > 0}
        onClick={async () => {
          await handleAction(selectedRows, action)
        }}
      >
        {buttonText}
      </Button>
    )
  }

  return (
    <Root>
      <TableContainer sx={{ position: 'relative' }}>
        <Table>
          <TableHead>
            <TableRow className={'noBorder'}>
              <TableCell>
                <Checkbox
                  color="secondary"
                  checked={rows && selectedRows.length > 0}
                  inputProps={{
                    'aria-label': selectAllBtnText,
                  }}
                  onChange={(e) => {
                    handleSelectAll(e)
                  }}
                />
              </TableCell>

              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ minWidth: column.width }}
                  sortDirection={sortProperty === column.id ? sortOrder : false}
                >
                  {column.id === 'waste' && selectedRows.length > 0 ? (
                    getHeader()
                  ) : (
                    <TableSortLabel
                      active={sortProperty === column.id}
                      direction={sortProperty === column.id ? sortOrder : 'asc'}
                      onClick={(event) => {
                        handleSort(event, column.id)
                      }}
                    >
                      {column.headerName}
                      {sortProperty === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
            </TableRow>
            <Spacer />
          </TableHead>
          <TableBody>
            {rows.map((row: Event, index: number) => {
              if (!row._id) return
              const labelId = `enhanced-table-checkbox-${index}`
              const isItemSelected = isSelected(row._id)

              return (
                <React.Fragment key={index}>
                  <TableRow
                    ref={(el) => el && (rowRefs.current[row._id!] = el)}
                    className={clsx('noBorder', 'dataRow')}
                    data-id={row._id}
                  >
                    <TableCell
                      rowSpan={validationError && row._id === staleAd ? 3 : 2}
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
                      {
                        //Though we know that the type of row.waste is object here,
                        //we use type narrowing to prevent Typescript error
                        typeof row.waste !== 'string'
                          ? row.waste.name
                          : row.waste
                      }
                    </TableCell>

                    <TableCell>
                      {row.location?.structured_formatting.main_text}
                    </TableCell>

                    <TableCell>
                      {dayjs(row.date).locale('ru').format('D MMMM, HH:mm')}
                    </TableCell>
                  </TableRow>
                  <TableRow className={'noBorder'} data-id={row._id}>
                    <TableCell colSpan={2}>
                      <Box className={'actions'}>
                        <Button
                          sx={actionBtnStyles}
                          href={
                            variant === inactive
                              ? `${editRoute}${row._id}?${new URLSearchParams(
                                  isInactive,
                                )}`
                              : `${editRoute}${row._id}`
                          }
                          disabled={!!changedRows[row._id]}
                          className="button"
                          startIcon={<EditIcon />}
                        >
                          {editBtnText}
                        </Button>
                        <Button
                          sx={actionBtnStyles}
                          className="button"
                          disabled={!!changedRows[row._id]}
                          onClick={async () => {
                            //Just another check to prevent Typescript error
                            if (!row._id) return

                            const action =
                              variant === inactive ? remove : deactivate

                            await handleAction([row._id], action)
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          {variant === inactive
                            ? deleteBtnText
                            : deactivateBtnText}
                        </Button>
                        {variant === inactive && (
                          <Button
                            sx={actionBtnStyles}
                            className="button"
                            disabled={!!changedRows[row._id]}
                            onClick={async () => {
                              //Just another check to prevent Typescript error
                              if (!row._id) return

                              if (validationError) setValidationError('')
                              if (staleAd) setStaleAd('')

                              try {
                                await date.validate(row.date)
                              } catch (e) {
                                setStaleAd(row._id)
                                setValidationError(validationErrorMsg)
                                return
                              }

                              const ids = rows.map((row) => {
                                return row._id
                              })
                              await handleAction(ids as string[], activate)
                            }}
                            startIcon={<DeleteIcon />}
                          >
                            {activateBtnText}
                          </Button>
                        )}
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
                  {row._id === staleAd ? (
                    <Error id={row._id} message={validationErrorMsg} />
                  ) : null}
                  {/*No spacer after the last row*/}
                  {index !== rows.length - 1 && <Spacer />}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
        {changedRows.length > 0 && (
          <Overlay
            action={rowAction}
            rowsToDisableButtons={changedRows}
            rowRefs={rowRefs}
            overlayRefs={overlayRefs}
          />
        )}
      </TableContainer>
    </Root>
  )
}
