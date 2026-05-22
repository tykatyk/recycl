import { Box, Typography, Tooltip, IconButton } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'

import { useState } from 'react'

const SubscriptionDetails = (props: { details: string }) => {
  const { details } = props

  return (
    <Box
      bgcolor="secondary.main"
      sx={{
        p: 2,
        border: '1px dashed #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography
        sx={{
          fontWeight: 300,
          fontSize: '0.875rem',
          color: 'secondary.contrastText',
        }}
      >
        {details}
      </Typography>
    </Box>
  )
}

const HeadingWithDescription = ({ children, detailedDescription }) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {children}

        <Tooltip title="Подробнее об этой подписке">
          <IconButton
            onClick={() => {
              setShowDetails(!showDetails)
            }}
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {showDetails ? (
        <SubscriptionDetails details={detailedDescription} />
      ) : null}
    </Box>
  )
}

export default HeadingWithDescription
