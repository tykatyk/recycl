import React, { useState } from 'react'
import { Button, TablePagination, makeStyles } from '@material-ui/core'

import { useGridSlotComponentProps } from '@mui/x-data-grid'
const handleChangePage = (event, newPage) => {
  setPage(newPage)
}

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10))
  setPage(0)
}

export default function DataGridFooter(props) {
  const { deleting, deleteMutation } = props
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const {
    state: { selection },
  } = useGridSlotComponentProps()

  const handleRemove = () => {}
  const handleClick = (event) => {
    deleteMutation({ variables: { ids: selection } })
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0.5em',
      }}
    >
      <Button
        color="secondary"
        disabled={deleting}
        onClick={(event) => {
          handleClick(event)
        }}
      >
        Удалить отмеченные
      </Button>
      <TablePagination
        component="div"
        count={100}
        page={page}
        onChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  )
}
