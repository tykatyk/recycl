import Box from '@mui/material/Box'
import Pagination from '@mui/material/Pagination'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import PaginationItem from '@mui/material/PaginationItem'
import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'

export default function DataGridFooter(props) {
  const {
    numRows,
    handlePageChange,
    handlePageSizeChange,
    pageSize,
    page,
    renderItem = (item) => <PaginationItem {...item} />,
  } = props

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
            {rowsPerPageOptions.map((element) => {
              return (
                <MenuItem key={element} value={element}>
                  {element}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Box>

      <Pagination
        count={Math.ceil(numRows / pageSize)}
        page={page}
        onChange={handlePageChange}
        renderItem={renderItem}
      ></Pagination>
    </Box>
  )
}
