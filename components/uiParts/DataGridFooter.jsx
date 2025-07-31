import { Button, Pagination, Typography, Box } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'

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

      {/*<TablePagination
        component="div"
        count={numRows}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[1, 2, 3]}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handlePageSizeChange}
      />*/}
      <Box sx={{ display: 'flex' }}>
        <Typography sx={{ mr: 1 }}>Строк на странице</Typography>
        <Box sx={{ minWidth: 120, mr: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              label="Age"
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Pagination
          count={Math.ceil(numRows / pageSize)}
          page={page}
          onChange={handlePageChange}
        ></Pagination>
      </Box>
    </div>
  )
}
