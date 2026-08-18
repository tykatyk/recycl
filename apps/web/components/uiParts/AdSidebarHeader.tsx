import { Box, Typography } from '@mui/material'

export default function AdSidebarHeader({ headerText = '' }) {
  return (
    <Box sx={{ p: 1 }}>
      <Typography
        component="h1"
        variant="body1"
        sx={{ fontWeight: 'bold' }}
        align="center"
        color="#91d608"
      >
        {headerText}
      </Typography>
    </Box>
  )
}
