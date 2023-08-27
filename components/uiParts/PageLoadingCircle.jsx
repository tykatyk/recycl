import React from 'react'
import { CircularProgress } from '@mui/material'
import { css } from '@emotion/react'

const wrapperCss = css({
  position: 'fixed',
  top: ' 50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
})

export default function PageLoadingCircle(props) {
  const { size = 40, className = undefined } = props
  const css = className ? {} : wrapperCss

  return (
    <div css={css} className={className}>
      <CircularProgress size={size} color="secondary" />
    </div>
  )
}
