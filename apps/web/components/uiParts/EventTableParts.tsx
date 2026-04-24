import { MutableRefObject, ReactElement } from 'react'
import { TableRow, TableCell, Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  eventActions,
  getEventTableStyles,
} from '../../lib/helpers/eventHelpers'
import { AdActions } from '../../lib/types/event'

const { activate, deactivate } = eventActions
const adActivated = 'Объявление активировано'
const adDeactivated = 'Объявление деактивировано'
const adDeleted = 'Объявление удалено'

export const Root = styled(Box)(({ theme }) => {
  return getEventTableStyles(theme)
})

export const Spacer = () => {
  return (
    <TableRow className="noBorder">
      <TableCell className="spacer" sx={{ p: 2 }} colSpan={5}></TableCell>
    </TableRow>
  )
}

type OverlayProps = {
  rowsToDisableButtons: string[]
  rowRefs: MutableRefObject<Record<string, HTMLTableRowElement | null>>
  overlayRefs: MutableRefObject<Record<string, HTMLDivElement | null>>
  action: '' | keyof AdActions
}

export const Overlay = ({
  rowsToDisableButtons,
  rowRefs,
  overlayRefs,
  action,
}: OverlayProps) => {
  let elements: ReactElement[] = []

  rowsToDisableButtons.forEach((_id) => {
    let actionText =
      action === activate
        ? adActivated
        : action === deactivate
          ? adDeactivated
          : adDeleted

    const item: ReactElement = (
      <Box
        key={_id}
        className="shim"
        //ToDo: how to say to assistive technology that this is just overlay
        ref={(el: HTMLDivElement | null) =>
          el && (overlayRefs.current[_id] = el)
        }
        tabIndex={-1}
        role={'status'}
        aria-live={'assertive'}
        aria-atomic={true}
        sx={{
          position: 'absolute',
          width: '100%',
          left: rowRefs?.current[_id]?.offsetLeft,
          top: rowRefs?.current[_id]?.offsetTop,
          height: 0,
          visibility: 'hidden',
          opacity: 0,
          overflow: 'hidden',
          background: (theme) => theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '18px',
          transition: 'opacity 200ms',
        }}
      >
        <Typography component="span" sx={{ color: '#fff' }}>
          {actionText}
        </Typography>
      </Box>
    )

    elements.push(item)
  })

  return elements
}

export const Error = ({ id, message }) => {
  return (
    <TableRow className={'noBorder'} data-id={id}>
      <TableCell colSpan={4}>
        <Typography
          component="div"
          variant="body2"
          sx={{ color: 'error.main' }}
        >
          {message}
        </Typography>
      </TableCell>
    </TableRow>
  )
}
