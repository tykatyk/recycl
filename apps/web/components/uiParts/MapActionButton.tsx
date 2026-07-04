import { Fab, Tooltip } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

export default function MapActionButton(props) {
  const { onClick = () => {}, open } = props

  return (
    <Fab
      aria-label="show panel"
      sx={(theme) => ({
        position: 'fixed',
        top: '50%',
        left: open ? 290 : 5,
        zIndex: 1,

        transition: theme.transitions.create('left', {
          easing: theme.transitions.easing.sharp,
          duration: open
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
      })}
      onClick={onClick}
      size="small"
    >
      <Tooltip title={open ? 'Скрыть панель' : 'Показать панель'}>
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Tooltip>
    </Fab>
  )
}
