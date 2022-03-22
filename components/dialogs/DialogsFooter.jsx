import React from 'react'
import { TablePagination } from '@material-ui/core'

export default function DialogsFooter(props) {
  const {
    numRows = 0,
    page = 0,
    pageSize = 25,
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
      rowsPerPageOptions={[1, 2, 3]}
    />
  )
}
