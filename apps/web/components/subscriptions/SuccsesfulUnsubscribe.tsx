import { Typography, Box, Button } from '@mui/material'

export default function SuccessfullUnsubscribe() {
  return (
    <>
      <Typography gutterBottom variant="h4" component="h1" sx={{ mb: 8 }}>
        Вы успешно отписались от рассылки
      </Typography>

      <Box>
        <Button variant="contained" color="secondary" href="/">
          Подписаться снова
        </Button>
      </Box>
    </>
  )
}
