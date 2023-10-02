import React from 'react'

export default function Wrapper(props) {
  return (
    <div
      css={(theme) => ({
        display: 'flex',
        boxSizing: 'border-box',
        flexWrap: 'wrap',
        minHeight: '100vh',
        backgroundColor: `${theme.palette.background.default}`,
      })}
    >
      {props.children}
    </div>
  )
}
