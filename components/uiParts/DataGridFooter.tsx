import Box from '@mui/material/Box'
import Pagination, { PaginationProps } from '@mui/material/Pagination'
import Select, { SelectProps } from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import PaginationItem from '@mui/material/PaginationItem'
import { rowsPerPageOptions } from '../../lib/helpers/eventHelpers'

const labelText = 'Показывать по'

interface DataGridFooterProps {
  numRows: number
  handlePageChange: NonNullable<PaginationProps['onChange']>
  handlePageSizeChange: NonNullable<SelectProps['onChange']>
  pageSize: number
  page: number
  renderItem: PaginationProps['renderItem']
}

export default function DataGridFooter(props: DataGridFooterProps) {
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
          <InputLabel id="rowsPerPageLabel">{labelText}</InputLabel>
          <Select
            labelId="rowsPerPageLabel"
            id="rowsPerPage"
            label={labelText}
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
