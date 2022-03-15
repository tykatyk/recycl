import React from 'react'
import { TablePagination } from '@material-ui/core'

export default function DialogsFooter(props) {
  const {
    numRows = 0,
    page = 0,
    pageSize = 25,
    handlePageChange = () => {},
    handlePageSizeChange = () => {},
  } = props
  return (
    <TablePagination
      component="div"
      count={numRows}
      page={page}
      rowsPerPage={pageSize}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePageSizeChange}
    />
  )
}
