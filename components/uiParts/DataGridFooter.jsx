import React from 'react'
import { Button, TablePagination } from '@mui/material'

export default function DataGridFooter(props) {
  const {
    showDeleteButton = false,
    deleting = false,
    numSelected = 0,
    deleteHandler = () => {},
    numRows,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
    page,
  } = props

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0.5em',
      }}
    >
      {showDeleteButton && (
        <Button
          color="secondary"
          disabled={deleting || numSelected < 1}
          onClick={(event) => deleteHandler(event)}
        >
          Удалить отмеченные
        </Button>
      )}

      <TablePagination
        component="div"
        count={numRows}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[1, 2, 3]}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />
    </div>
  )
}
