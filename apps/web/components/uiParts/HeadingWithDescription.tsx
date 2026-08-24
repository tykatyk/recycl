import { Box, Typography, Tooltip, IconButton } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

export const HeadingDetails = (props: { details: string }) => {
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
  const t = useTranslations('HeadingWithDescription')

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

        <Tooltip title={t('title')}>
          <IconButton
            onClick={() => {
              setShowDetails(!showDetails)
            }}
          >
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {showDetails ? detailedDescription : null}
    </Box>
  )
}

export default HeadingWithDescription
