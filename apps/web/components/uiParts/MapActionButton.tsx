import { Fab, Tooltip } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useTranslations } from 'next-intl'

export default function MapActionButton(props) {
  const { onClick = () => {}, open } = props
  const t = useTranslations('MapActionButton')
  return (
    <Fab
      aria-label="show panel"
      sx={(theme) => ({
        position: 'fixed',
        top: '50%',
        left: open ? 260 : 5,
        zIndex: 1201,

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
      <Tooltip title={open ? t('hidePanel') : t('showPanel')}>
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </Tooltip>
    </Fab>
  )
}
