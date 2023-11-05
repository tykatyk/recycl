import React, { useState } from 'react'
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
import RefreshIcon from '@mui/icons-material/Refresh'
import PageLoadingCircle from '../uiParts/PageLoadingCircle'
import clsx from 'clsx'
import { Variant } from '../../lib/types/event'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import { EmotionJSX } from '@emotion/react/types/jsx-namespace'

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

type ColumnProps = {
  id: string
  headerName: string | EmotionJSX.Element
  width: number
  headerAlign?: 'left' | ' right' | 'center'
}

const getHeader = (
  selectedRows,
  variant,
  handleMassDeactivationDeletion,
  buttonDisabled,
  setButtonDisabled,
) => {
  return selectedRows.length > 0 ? (
    // variant === 'inactive' ? (
    //   'Удалить'
    // ) : (
    <Button
      color="secondary"
      disabled={buttonDisabled}
      onClick={async () => {
        setButtonDisabled(true)
        await handleMassDeactivationDeletion(selectedRows, 'inactivate')
        setButtonDisabled(false)
      }}
    >
      Деактивировать
    </Button>
  ) : (
    //)
    'Дата'
  )
}

const getColumns = (
  selectedRows,
  variant,
  handleMassDeactivationDeletion,
  buttonDisabled,
  setButtonDisabled,
): ColumnProps[] => {
  return [
    {
      id: 'checkbox',
      headerName: 'Выбрать',
      width: 70,
    },
    {
      id: 'date',
      headerName: getHeader(
        selectedRows,
        variant,
        handleMassDeactivationDeletion,
        buttonDisabled,
        setButtonDisabled,
      ),
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
}

const Spacer = () => {
  return (
    <TableRow>
      <TableCell className="spacer" sx={{ p: 2 }} colSpan={5}></TableCell>
    </TableRow>
  )
}

/*type EventsTableProps = {
  rows: EventsData[]
  variant: Variant
}*/
export default function EventsTable(
  {
    rows,
    variant,
    selectedRows,
    handleCheckboxClick,
    handleSelectAllClick,
    handleDisable,
    handleMassDeactivationDeletion,
  } /*: EventsTableProps*/,
) {
  const isSelected = (id: string) => selectedRows.indexOf(id) !== -1
  const [buttonDisabled, setButtonDisabled] = useState(false)

  return (
    <Root>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow className="header">
              {getColumns(
                selectedRows,
                variant,
                handleMassDeactivationDeletion,
                buttonDisabled,
                setButtonDisabled,
              ).map((column) => (
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
                        handleSelectAllClick(e)
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
              const isItemSelected = isSelected(row._id)

              return (
                <React.Fragment key={index}>
                  <TableRow className={clsx('noBorder', 'dataRow')}>
                    <TableCell
                      rowSpan={2}
                      onClick={() => {
                        handleCheckboxClick(row)
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
                      {row.location.structured_formatting.main_text}
                    </TableCell>
                    <TableCell>{row.waste.name}</TableCell>
                  </TableRow>
                  <TableRow className={'actionsRow'}>
                    <TableCell colSpan={3}>
                      <Box className={'actions'}>
                        <Button
                          color="secondary"
                          href={`/my/events/edit/${row._id}`}
                          className="button"
                          startIcon={
                            !row.isActive ? <RefreshIcon /> : <EditIcon />
                          }
                        >
                          {!row.isActive ? 'Активировать' : 'Редактировать'}
                        </Button>
                        <Button
                          color="secondary"
                          className="button"
                          onClick={() => {
                            handleDisable({
                              ...row,
                              waste: row.waste._id,
                              isActive: false,
                            })
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
