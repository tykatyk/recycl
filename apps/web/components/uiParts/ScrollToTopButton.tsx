import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Box, Fab, Fade, useScrollTrigger } from '@mui/material'

function ScrollTopButton() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 200,
  })

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Fade in={trigger}>
      <Box
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: (theme) => theme.zIndex.tooltip,
        }}
      >
        <Fab
          color="secondary"
          size="medium"
          onClick={handleClick}
          aria-label="scroll back to top"
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Fade>
  )
}

export default ScrollTopButton
