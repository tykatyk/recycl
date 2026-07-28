import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import { Popover } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

const PREFIX = 'RemovalPopover'

const classes = {
  popover: `${PREFIX}-popover`,
  paper: `${PREFIX}-paper`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  [`& .${classes.popover}`]: {
    pointerEvents: 'none',
  },

  [`& .${classes.paper}`]: {
    padding: theme.spacing(1),
  },
}))

export default function RemovalPopover(props) {
  const theme = useTheme()

  const [anchor, setAnchor] = React.useState(null)

  const handlePopoverOpen = (event) => {
    setAnchor(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchor(null)
  }
  const open = Boolean(anchor)

  return (
    <Root>
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
    </Root>
  )
}
