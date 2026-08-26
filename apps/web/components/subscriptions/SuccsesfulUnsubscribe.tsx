import { Typography, Box, Button } from '@mui/material'
import { useTranslations } from 'next-intl'

export default function SuccessfullUnsubscribe() {
  const t = useTranslations('SuccessfullUnsubscribe')

  return (
    <>
      <Typography gutterBottom variant="h4" component="h1" sx={{ mb: 8 }}>
        {t('successMessage')}
      </Typography>

      <Box>
        <Button variant="contained" color="secondary" href="/">
          {t('resubscribe')}
        </Button>
      </Box>
    </>
  )
}
