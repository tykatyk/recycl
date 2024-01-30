import React, {
  useState,
  useRef,
  useCallback,
  ReactNode,
  useEffect,
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
import { element } from 'prop-types'
import { forEach } from 'lodash'

const isInactive: IsInactive = {
  isInactive: '1',
}

const Root = styled('div')(({ theme }) => {
  return getEventTableStyles(theme)
})

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

const setStyles = (target, el) => {
  // const elHeight = `${el.offsetHeight}px`
  let height = 0
  const _id = el.getAttribute('data-id')
  const elements = document.querySelectorAll(`[data-id="${_id}"]`)
  console.log(elements)
  elements.forEach((element) => {
    console.log(element.offsetHeight)
    height += element.offsetHeight
  })

  target.style.height = `${height}px`
  target.style.visibility = 'visible'
  target.style.opacity = 1
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
  const rowRefs: any = useRef({})
  const overlayRefs: any = useRef({})
  const [rowToDisableButtons, setRowToDisableButtons] = useState('')

  useEffect(() => {
    let el
    let target
    // console.log('here3')
    if (
      showOverlay &&
      rowToDisableButtons &&
      rowRefs.current[rowToDisableButtons] &&
      overlayRefs.current[rowToDisableButtons]
    ) {
      let el = rowRefs.current[rowToDisableButtons]
      let target = overlayRefs.current[rowToDisableButtons]
      setStyles(target, el)
      return
    }

    for (const _id in overlayRefs.current) {
      el = rowRefs.current[_id]
      target = overlayRefs.current[_id]
      //prevent memory leak (increasing overlayRefs size) when the user changes variant, deletes or paginates through events
      //here we basically remove refs for rows which are not visible
      if (!target) {
        delete overlayRefs.current[_id]
        continue
      }

      if (showOverlay && selectedRows.includes(_id)) {
        setStyles(target, el)
      }
      if (!showOverlay) {
        target.style.opacity = 0
        target.style.height = 0
        target.style.visibility = 'hidden'
      }
    }
  }, [showOverlay, rowToDisableButtons, selectedRows])

  const Overlay = () => {
    let elements = []
    //prevent memory leak (increasing rowRefs size) when the user changes variant, deletes or paginates through events
    //here we basically remove refs for rows which are not visible
    for (const _id in rowRefs.current) {
      if (!rowRefs.current[_id]) {
        delete rowRefs.current[_id]
        continue
      }

      const item = (
        <Box
          key={_id}
          className="shim"
          ref={(el) => (overlayRefs.current[_id] = el)}
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
            Row deleted
          </Typography>
        </Box>
      )

      elements.push(item)
    }

    return elements
  }

  const getHeader = useCallback<() => ReactNode | 'Дата'>(() => {
    if (selectedRows.length > 0) {
      const action = variant === inactive ? remove : deactivate
      const buttonText =
        variant === inactive ? deleteBtnText : deactivateBtnText

      return (
        <Button
          color="secondary"
          disabled={dropAllDisabled}
          onClick={async () => {
            if (rowToDisableButtons) setRowToDisableButtons('')
            setShowOverlay(true)
            setDropAllDisabled(true)
            setTimeout(() => {
              setDropAllDisabled(false)
              setShowOverlay(false)
            }, 1000)
            // await handleDeactivationAndDeletion(selectedRows, action)
          }}
        >
          {buttonText}
        </Button>
      )
    }
    return 'Дата'
  }, [variant, rows, selectedRows, dropAllDisabled])

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

              return (
                <React.Fragment key={index}>
                  <TableRow
                    ref={(el) => (rowRefs.current[row._id] = el)}
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
                          disabled={row._id === rowToDisableButtons}
                          className="button"
                          startIcon={<EditIcon />}
                        >
                          {editBtnText}
                        </Button>
                        <Button
                          color="secondary"
                          className="button"
                          // disabled={
                          //   row._id === rowToDisableButtons
                          // }
                          onClick={async () => {
                            //Just another check to prevent Typescript error
                            if (!row._id) return
                            // console.log('row id ' + row._id)
                            setRowToDisableButtons(row._id)
                            setShowOverlay(true)

                            return
                            if (variant === inactive) {
                              await handleDeactivationAndDeletion(
                                [row._id],
                                remove,
                              )
                            }
                            if (variant === active) {
                              await handleDeactivationAndDeletion(
                                [row._id],
                                deactivate,
                              )
                            }
                            setRowToDisableButtons('')
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
                            disabled={row._id === rowToDisableButtons}
                            onClick={async () => {
                              //Just another check to prevent Typescript error
                              if (!row._id) return
                              if (showOverlay) setShowOverlay(false)
                              setRowToDisableButtons(row._id)

                              if (validationError) setValidationError('')
                              if (staleAd) setStaleAd('')

                              try {
                                await date.validate(row.date)
                              } catch (e) {
                                setStaleAd(row._id)
                                setValidationError(validationErrorMsg)
                                return
                              }

                              await handleDeactivationAndDeletion(
                                [row._id],
                                activate,
                              )

                              setRowToDisableButtons('')
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
        <Overlay />
      </TableContainer>
    </Root>
  )
}
