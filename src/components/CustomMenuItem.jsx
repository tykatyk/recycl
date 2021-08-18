import React, { forwardRef, useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'

export default forwardRef((props, ref) => {
  const [maxWidth, setMaxWidth] = useState('100%')
  console.log(props)

  useEffect(() => {
    setMaxWidth(props.refs.current ? props.refs.current.offsetWidth : '100%')
  }, [maxWidth])

  return (
    <MenuItem {...props} value={props.value} style={{ maxWidth }}>
      {props.children}
    </MenuItem>
  )
})
