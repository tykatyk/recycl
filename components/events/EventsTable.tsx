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
  EventPaginationData,
  IsInactive,
  EventActions,
  SortOrder,
} from '../../lib/types/event'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import {
  getColumns,
  eventActions,
  eventVariants,
  adjustOverlay,
  overlayResizeHandler,
  makeNewRowsToDisableButtons,
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
  handleActivationDeactivationAndDeletion: (
    eventIds: string[] | undefined,
    action: keyof EventActions,
  ) => Promise<void>
  handleSort: (event: React.MouseEvent<unknown>, property: any) => void
  fetcher: () => Promise<EventPaginationData>
  setParams: (data: EventPaginationData) => void
  orderBy: string
  sortOrder: SortOrder
}

const { activate, deactivate, remove } = eventActions
const { inactive } = eventVariants
const validationErrorMsg = 'Дата и время в объявлении меньше текущих'
const deleteBtnText = 'Удалить'
const deactivateBtnText = 'Деактивировать'
const selectAllBtnText = 'Выбрать все'
const editBtnText = 'Редактировать'
const activateBtnText = 'Активировать'
const dateText = 'Дата'
const editRoute = '/my/events/edit/'

export default function EventsTable({
  variant,
  rows,
  selectedRows,
  handleSelect,
  handleSelectAll,
  handleSort,
  handleActivationDeactivationAndDeletion,
  fetcher,
  setParams,
  orderBy,
  sortOrder,
}: EventsTableProps) {
  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1
  const [validationError, setValidationError] = useState('')
  const [staleAd, setStaleAd] = useState('')
  const rowRefs = useRef<ConfigOptions['rowRefs']>({})
  const overlayRefs = useRef<ConfigOptions['overlayRefs']>({})
  const [rowsToDisableButtons, setRowsToDisableButtons] = useState<
    ConfigOptions['rowsToDisableButtons']
  >({})

  const options: Options = {
    rowRefs,
    overlayRefs,
    rowsToDisableButtons,
  }

  useEffect(() => {
    adjustOverlay(options)
  }, [rowsToDisableButtons])

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
  }, [rowsToDisableButtons])

  const handleRowAction = async (row: Event, action: keyof EventActions) => {
    await handleActivationDeactivationAndDeletion([row._id!], action)
      .then(() => {
        return fetcher()
      })
      .then((data: EventPaginationData) => {
        makeNewRowsToDisableButtons(setRowsToDisableButtons, row._id!)
        setParams(data)
      })
      .catch(() => {
        makeNewRowsToDisableButtons(setRowsToDisableButtons, row._id!)
      })
  }

  const getHeader = (): ReactNode | typeof dateText => {
    if (selectedRows.length > 0) {
      const action = variant === inactive ? remove : deactivate
      const buttonText =
        variant === inactive ? deleteBtnText : deactivateBtnText

      return (
        <Button
          color="secondary"
          disabled={Object.keys(rowsToDisableButtons).length > 0}
          onClick={async () => {
            const newRowsToDisableButtons: typeof rowsToDisableButtons = {}
            selectedRows.forEach((item) => {
              newRowsToDisableButtons[item] = action
            })
            setRowsToDisableButtons(newRowsToDisableButtons)

            await handleActivationDeactivationAndDeletion(selectedRows, action)
              .then(() => {
                return fetcher()
              })
              .then((data) => {
                setRowsToDisableButtons({})
                setParams(data)
              })
              .catch(() => {
                setRowsToDisableButtons({})
              })
          }}
        >
          {buttonText}
        </Button>
      )
    }
    return dateText
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

              {getColumns(getHeader).map((column) => (
                <TableCell
                  key={column.id}
                  sx={{ minWidth: column.width }}
                  sortDirection={orderBy === column.id ? sortOrder : false}
                >
                  {column.id === 'time' ? (
                    column.headerName
                  ) : (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? sortOrder : 'asc'}
                      onClick={(event) => {
                        handleSort(event, column.id)
                      }}
                    >
                      {column.headerName}
                      {orderBy === column.id ? (
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
              if (row._id === undefined) return
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
                        //Though we know that the type of row.waste is object here,
                        //we use type narrowing to prevent Typescript error
                        typeof row.waste !== 'string'
                          ? row.waste.name
                          : row.waste
                      }
                    </TableCell>
                  </TableRow>
                  <TableRow className={'noBorder'} data-id={row._id}>
                    <TableCell colSpan={3}>
                      <Box className={'actions'}>
                        <Button
                          color="secondary"
                          href={
                            variant === inactive
                              ? `${editRoute}${row._id}?${new URLSearchParams(
                                  isInactive,
                                )}`
                              : `${editRoute}${row._id}`
                          }
                          disabled={!!rowsToDisableButtons[row._id]}
                          className="button"
                          startIcon={<EditIcon />}
                        >
                          {editBtnText}
                        </Button>
                        <Button
                          color="secondary"
                          className="button"
                          disabled={!!rowsToDisableButtons[row._id]}
                          onClick={async () => {
                            //Just another check to prevent Typescript error
                            if (!row._id) return

                            const action =
                              variant === inactive ? remove : deactivate

                            if (!rowsToDisableButtons[row._id]) {
                              setRowsToDisableButtons(
                                (prevRowsToDisableButtons) => {
                                  return {
                                    ...prevRowsToDisableButtons,
                                    [row._id!]: action,
                                  }
                                },
                              )
                            } else {
                              return
                            }

                            await handleRowAction(row, action)
                          }}
                          startIcon={<DeleteIcon />}
                        >
                          {variant === inactive
                            ? deleteBtnText
                            : deactivateBtnText}
                        </Button>
                        {variant === inactive && (
                          <Button
                            color="secondary"
                            className="button"
                            disabled={!!rowsToDisableButtons[row._id]}
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

                              if (!rowsToDisableButtons[row._id]) {
                                setRowsToDisableButtons({
                                  ...rowsToDisableButtons,
                                  [row._id]: activate,
                                })
                              } else {
                                return
                              }

                              await handleRowAction(row, activate)
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
        {Object.keys(rowsToDisableButtons).length > 0 && (
          <Overlay
            rowsToDisableButtons={rowsToDisableButtons}
            rowRefs={rowRefs}
            overlayRefs={overlayRefs}
          />
        )}
      </TableContainer>
    </Root>
  )
}
