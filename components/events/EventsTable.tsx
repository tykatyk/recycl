import React, {
  useState,
  useRef,
  useCallback,
  ReactNode,
  useEffect,
  useLayoutEffect,
  ReactElement,
} from 'react'
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
  Typography,
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
} from '../../lib/types/event'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import {
  getColumns,
  eventActions,
  eventVariants,
  getEventTableStyles,
} from '../../lib/helpers/eventHelpers'
import { date } from '../../lib/validation/atomicValidators'

const isInactive: IsInactive = {
  isInactive: '1',
}

const Root = styled(Box)(({ theme }) => {
  return getEventTableStyles(theme)
})

const Spacer = () => {
  return (
    <TableRow>
      <TableCell className="spacer" sx={{ p: 2 }} colSpan={5}></TableCell>
    </TableRow>
  )
}

const Overlay = ({ rowsToDisableButtons, rowRefs, overlayRefs }) => {
  let elements: ReactElement[] = []

  for (const _id in rowsToDisableButtons) {
    let actionText =
      rowsToDisableButtons[_id] === activate
        ? 'Объявление активировано'
        : rowsToDisableButtons[_id] === deactivate
        ? 'Объявление деактивировано'
        : 'Объявление удалено'

    const item: ReactElement = (
      <Box
        key={_id}
        className="shim"
        //ToDo: how to say to assistant technology that this is just overlay
        ref={(el: HTMLDivElement | null) =>
          el && (overlayRefs.current[_id] = el)
        }
        sx={{
          position: 'absolute',
          width: '100%',
          left: rowRefs.current[_id].offsetLeft,
          top: rowRefs.current[_id].offsetTop,
          height: 0,
          visibility: 'hidden',
          opacity: 0,
          overflow: 'hidden',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          transition: 'opacity 1s',
        }}
      >
        <Typography component="span" sx={{ color: 'red' }}>
          {actionText}
        </Typography>
      </Box>
    )

    elements.push(item)
  }

  // rowsToDisableButtons.forEach((_id) => {

  // })

  // for (const _id in rowRefs.current) {
  // }

  return elements
}

const ErrorComponent = ({ id }) => {
  return (
    <TableRow className={'noBorder'} data-id={id}>
      <TableCell colSpan={4}>
        <Typography
          component="div"
          variant="body2"
          sx={{ color: 'error.main' }}
        >
          {validationErrorMsg}
        </Typography>
      </TableCell>
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
    action: keyof EventActions,
  ) => Promise<void>
}

const { activate, deactivate, remove } = eventActions
const { active, inactive } = eventVariants
const validationErrorMsg = 'Дата и время в объявлении меньше текущих'
const deleteBtnText = 'Удалить'
const deactivateBtnText = 'Деактивировать'
const selectAllBtnText = 'Выбрать все'
const editBtnText = 'Редактировать'
const activateBtnText = 'Активировать'
const editRoute = '/my/events/edit/'
let timeout: ReturnType<typeof setTimeout>

const overlayResizeHandler = (options) => {
  //debounce recalculating overlay styles when resize window to prevent perfomance issues
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    adjustOverlay(options)
  }, 200)
}

function adjustOverlay(options) {
  const {
    rowRefs,
    overlayRefs,
    // showOverlay,
    rowsToDisableButtons,
    // selectedRows,
  } = options

  for (const _id in overlayRefs.current) {
    let source = rowRefs.current[_id]
    let target = overlayRefs.current[_id]

    //prevent memory leak of increasing rowRefs and overlayRefs size when the user changes variant, deletes or paginates through events
    //we basically remove refs for rows which are not visible
    if (!source) delete rowRefs.current[_id]
    if (!target) delete overlayRefs.current[_id]

    if (!target || !source) continue

    // if (showOverlay && rowsToDisableButtons[_id]) {
    //   setOverlayStylesVisible(target, source)
    // } else if (showOverlay && selectedRows.includes(_id)) {
    //   setOverlayStylesVisible(target, source)
    // } else if (!showOverlay || (showOverlay && !rowsToDisableButtons[_id])) {
    //   setOverlayStylesHidden(target)
    // }
    if (rowsToDisableButtons[_id]) {
      setOverlayStylesVisible(target, source)
    } else {
      setOverlayStylesHidden(target)
    }
  }
}

const setOverlayStylesVisible = (
  target: HTMLDivElement,
  source: HTMLTableRowElement,
) => {
  let height = 0
  const _id = source.getAttribute('data-id')
  const elements = document.querySelectorAll<HTMLTableRowElement>(
    `[data-id="${_id}"]`,
  )

  elements.forEach((element) => {
    height += element.offsetHeight
  })

  target.style.left = `${source.offsetLeft}px`
  target.style.top = `${source.offsetTop}px`
  target.style.height = `${height}px`
  target.style.visibility = 'visible'
  target.style.opacity = '1'
}

const setOverlayStylesHidden = (target: HTMLDivElement) => {
  target.style.opacity = '0'
  target.style.height = '0'
  target.style.visibility = 'hidden'
}

const makeNewRowsToDisableButtons = (
  rowsToDisableButtons,
  setRowsToDisableButtons,
  rowToRestore,
) => {
  if (!rowToRestore) return

  const newRows = { ...rowsToDisableButtons }
  delete newRows[rowToRestore]

  setRowsToDisableButtons(newRows)
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
  const [dropAllDisabled, setDropAllDisabled] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [staleAd, setStaleAd] = useState('')
  const [showOverlay, setShowOverlay] = useState(false)
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({})
  const overlayRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [rowsToDisableButtons, setRowsToDisableButtons] = useState<
    Record<string, keyof EventActions>
  >({})
  // const [rowToRestore, setRowToRestore] = useState<string>('')

  const options = {
    rowRefs,
    overlayRefs,
    // showOverlay,
    rowsToDisableButtons,
    // selectedRows,
  }

  useEffect(() => {
    adjustOverlay(options)
  }, [/*showOverlay,*/ rowsToDisableButtons, selectedRows])

  /*useEffect(() => {
    if (!rowToRestore) return
    // const newRows = rowsToDisableButtons.filter(
    //   (item) => item._id !== rowToRestore,
    // )
    const newRows = { ...rowsToDisableButtons }
    delete newRows[rowToRestore]
    setRowsToDisableButtons(newRows)
    if (Object.keys(newRows).length === 0) {
      setRowToRestore('')
      // setShowOverlay(false)
    }
  }, [rowToRestore])*/

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
  }, [
    /*rowRefs, overlayRefs, showOverlay,*/
    rowsToDisableButtons,
    selectedRows,
  ])

  const getHeader = useCallback<() => ReactNode | 'Дата'>(() => {
    if (selectedRows.length > 0) {
      const action = variant === inactive ? remove : deactivate
      const buttonText =
        variant === inactive ? deleteBtnText : deactivateBtnText

      return (
        <Button
          color="secondary"
          disabled={
            dropAllDisabled || Object.keys(rowsToDisableButtons).length > 0
          }
          onClick={async () => {
            // if (rowsToDisableButtons) setRowsToDisableButtons('')
            setShowOverlay(true)
            setDropAllDisabled(true)
            //ToDo: correct code
            await handleDeactivationAndDeletion(selectedRows, action)
            setDropAllDisabled(false)
            setShowOverlay(false)
          }}
        >
          {buttonText}
        </Button>
      )
    }
    return 'Дата'
  }, [variant, rows, selectedRows, dropAllDisabled])

  return (
    <Root>
      <TableContainer sx={{ position: 'relative' }}>
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
                        'aria-label': selectAllBtnText,
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
              if (!row._id) return
              const labelId = `enhanced-table-checkbox-${index}`
              const isItemSelected = isSelected(row._id)
              if (row._id === undefined) return
              return (
                <React.Fragment key={index}>
                  <TableRow
                    ref={(el) => el && (rowRefs.current[row._id!] = el)}
                    //ToDo: check css for no border
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
                        //though we know that the type of row.waste is object here,
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
                              setRowsToDisableButtons({
                                ...rowsToDisableButtons,
                                [row._id]: action,
                              })
                            } else {
                              return
                            }

                            // if (!showOverlay) setShowOverlay(true)

                            setTimeout(() => {
                              // const newRows = rowsToDisableButtons.filter(
                              //   (item) => item !== rowToRestore,
                              // )
                              // setRowsToDisableButtons(newRows)
                              // setRowToRestore(row._id!)
                              makeNewRowsToDisableButtons(
                                rowsToDisableButtons,
                                setRowsToDisableButtons,
                                row._id,
                              )
                            }, 3000)

                            return
                            await handleDeactivationAndDeletion(
                              [row._id],
                              action,
                            )

                            // if (showOverlay) setShowOverlay(false)
                            // setRowToRestore(row._id)
                            makeNewRowsToDisableButtons(
                              rowsToDisableButtons,
                              setRowsToDisableButtons,
                              row._id,
                            )
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
                              // if (showOverlay) setShowOverlay(false)

                              //ToDo: check these errors
                              if (validationError) setValidationError('')
                              if (staleAd) setStaleAd('')

                              try {
                                await date.validate(row.date)

                                if (!rowsToDisableButtons[row._id]) {
                                  setRowsToDisableButtons({
                                    ...rowsToDisableButtons,
                                    [row._id]: activate,
                                  })
                                } else {
                                  return
                                }
                                //ToDo: separately catch errors for deactivationAndDeletion
                                await handleDeactivationAndDeletion(
                                  [row._id],
                                  activate,
                                )
                              } catch (e) {
                                setStaleAd(row._id)
                                setValidationError(validationErrorMsg)
                              }
                              //ToDo: Add if statement
                              // setRowToRestore(row._id)
                              makeNewRowsToDisableButtons(
                                rowsToDisableButtons,
                                setRowsToDisableButtons,
                                row._id,
                              )
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
                  {row._id === staleAd ? <ErrorComponent id={row._id} /> : null}
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
