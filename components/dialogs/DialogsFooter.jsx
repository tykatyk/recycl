import React from 'react'
import { TablePagination } from '@mui/material'

export default function DialogsFooter(props) {
  const {
    numRows = 0,
    page = 0,
    pageSize = parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGINATION_SIZE, 10),
    handlePageChange = () => {},
    handlePageSizeChange = () => {},
    handleNextPageButtonClick = () => {},
    handlePreviousPageButtonClick = () => {},
  } = props
  return (
    <TablePagination
      component="div"
      count={numRows}
      page={page}
      rowsPerPage={pageSize}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handlePageSizeChange}
      nextIconButtonProps={{ onClick: handleNextPageButtonClick }}
      backIconButtonProps={{ onClick: handlePreviousPageButtonClick }}
    />
  )
}
