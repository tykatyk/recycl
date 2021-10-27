import React, { useState } from 'react'
import { Button, TablePagination, makeStyles } from '@material-ui/core'

const handleChangePage = (event, newPage) => {
  setPage(newPage)
}

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10))
  setPage(0)
}

export default function DataGridFooter(props) {
  const { deleting, selected, clickHandler } = props
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

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
        disabled={deleting || selected.length < 1}
        onClick={(event) => {
          clickHandler(event)
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
