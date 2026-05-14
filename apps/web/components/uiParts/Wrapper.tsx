import { Box } from '@mui/material'

export default function Wrapper(props) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {props.children}
    </Box>
  )
}
