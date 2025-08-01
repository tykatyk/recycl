import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Link from './Link'

export default function DataGridFooter(props) {
  const { numRows, handlePageChange, handlePageSizeChange, pageSize, page } =
    props

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2, pb: 2 }}>
      <Box sx={{ minWidth: 120, mr: 1 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="rowsPerPageLabel">Показывать по</InputLabel>
          <Select
            labelId="rowsPerPageLabel"
            id="rowsPerPage"
            label="Показывать по"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Pagination
        count={Math.ceil(numRows / pageSize)}
        page={page}
        onChange={handlePageChange}
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            href={`/my/events${item.page === 1 ? '' : `?page=${item.page}&limit=${pageSize}`}`}
            {...item}
          />
        )}
      ></Pagination>
    </Box>
  )
}
