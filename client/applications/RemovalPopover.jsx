import React from 'react'
import { Popover, makeStyles, useTheme } from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}))

export default function RemovalPopover(props) {
  const theme = useTheme()
  const classes = useStyles()
  const [anchor, setAnchor] = React.useState(null)

  const handlePopoverOpen = (event) => {
    setAnchor(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchor(null)
  }
  const open = Boolean(anchor)

  return (
    <>
      <InfoOutlinedIcon
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        id={props.id}
      />
      <Popover
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {props.children}
      </Popover>
    </>
  )
}
