import { Box, CircularProgress } from '@mui/material'

export default function PageLoadingCircle(props) {
  const { size = 40, sx = [] } = props

  return (
    <Box
      sx={[
        {
          position: 'absolute',
          top: ' 50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <CircularProgress size={size} color="secondary" />
    </Box>
  )
}
