import {
  useState,
  useRef,
  ReactNode,
  useEffect,
  useLayoutEffect,
  Fragment,
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
  Popper,
  Paper,
} from '@mui/material'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import clsx from 'clsx'
import type {
  Variant,
  Event,
  IsInactive,
  AdActions,
  SortOrder,
  OrderBy,
} from '../../lib/types/event'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import {
  columns,
  eventActions,
  eventVariants,
  adjustOverlay,
  overlayResizeHandler,
  validSortOrder,
} from '../../lib/helpers/eventHelpers'
import type { Options, ConfigOptions } from '../../lib/helpers/eventHelpers'
import { date } from '../../lib/validation/atomicValidators'
import {
  Root,
  Spacer,
  Overlay,
  Error as ErrorComponent,
} from '../uiParts/EventTableParts'

import { visuallyHidden } from '@mui/utils'

const isInactive: IsInactive = {
  isInactive: '1',
}

type TableProps<T> = {
  variant: Variant
  rows: T[]
  selectedRows: string[]
  handleSelect: (row: T) => void
  handleSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleAction: (ids: string[], action: keyof AdActions) => Promise<void>
  handleSort: (event: React.MouseEvent<unknown>, property: any) => void
  handleResetViewCount: (id: string) => Promise<void>
  popperRow: T | null
  setPopperRow: React.Dispatch<React.SetStateAction<T | null>>
  fetching: boolean
  sortProperty: OrderBy
  sortOrder: SortOrder
  changedRows: string[]
  rowAction: keyof AdActions | ''
}

const { activate, deactivate, remove } = eventActions
const { inactive } = eventVariants
const validationErrorMsg = 'Дата и время в объявлении меньше текущих'
const deleteBtnText = 'Удалить'
const deactivateBtnText = 'Деактивировать'
const selectAllBtnText = 'Выбрать все'
const editBtnText = 'Редактировать'
const activateBtnText = 'Активировать'
const reset = 'Сбросить'
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
  handleResetViewCount,
  setPopperRow,
  popperRow,
  fetching,
  sortProperty,
  sortOrder,
  changedRows,
  rowAction,
}: TableProps<Event>) {
  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1
  const [validationError, setValidationError] = useState('')
  const [staleAd, setStaleAd] = useState('')
  const rowRefs = useRef<ConfigOptions['rowRefs']>({})
  const overlayRefs = useRef<ConfigOptions['overlayRefs']>({})
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const popperRef = useRef<HTMLDivElement>(null)
  const coordsRef = useRef({ x: 0, y: 0 })
  const open = Boolean(anchorEl)
  const id = open ? 'cleanViewCount' : undefined
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

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      coordsRef.current.x = e.clientX
      coordsRef.current.y = e.clientY
    }

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>, row) => {
    setPopperRow(row)
    setAnchorEl(event.currentTarget)
  }

  const handleMouseLeave = () => {
    const popper = popperRef.current
    if (!popper) return

    const popperCoords = popper?.getBoundingClientRect()
    const mouseCoords = coordsRef.current

    if (popperCoords.top >= mouseCoords.y) {
      if (mouseCoords.y + 5 < popperCoords.top) {
        setAnchorEl(null)
      }
    } else {
      if (mouseCoords.y - 5 > popperCoords.bottom) {
        setAnchorEl(null)
      }
    }
  }

  const handlePopperLeave = () => {
    setAnchorEl(null)
  }

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
                      direction={
                        sortProperty === column.id
                          ? sortOrder
                          : validSortOrder.asc
                      }
                      onClick={(event) => {
                        handleSort(event, column.id)
                      }}
                    >
                      {column.headerName}
                      {sortProperty === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === validSortOrder.desc
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
              const labelId = `checkbox-${index}`
              const isItemSelected = isSelected(row._id)

              return (
                <Fragment key={index}>
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
                              await handleAction([row._id], activate)
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
                        component="div"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          fontWeight: 'fontWeightLight',
                          '&:hover': {
                            cursor: 'pointer',
                          },
                        }}
                        onMouseEnter={(e) => handleMouseEnter(e, row)}
                        onMouseLeave={handleMouseLeave}
                        aria-expanded={!!open}
                        aria-controls={id}
                      >
                        <VisibilityIcon sx={{ fontSize: '1.25rem' }} />
                        <Box component="span" sx={{ p: '4px 8px' }}>
                          {row.viewCount}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                  {row._id === staleAd ? (
                    <ErrorComponent id={row._id} message={validationErrorMsg} />
                  ) : null}
                  {/*No spacer after the last row*/}
                  {index !== rows.length - 1 && <Spacer />}
                </Fragment>
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
        {open && popperRow && (
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            ref={popperRef}
            onMouseLeave={handlePopperLeave}
            sx={{
              zIndex: 1000,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Button
                variant="text"
                color="secondary"
                size="small"
                disableElevation
                onClick={() => handleResetViewCount(popperRow._id as string)}
                disabled={fetching || popperRow.viewCount === 0}
                endIcon={<RestartAltIcon />}
              >
                <span>{reset}</span>
              </Button>
            </Paper>
          </Popper>
        )}
      </TableContainer>
    </Root>
  )
}
