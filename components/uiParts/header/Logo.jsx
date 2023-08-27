import React from 'react'
import Link from '../Link'

export default function Logo() {
  return (
    <Link
      underline="none"
      href="/"
      sx={{
        fontSize: '1.5rem',
        fontFamily: 'inherit',
        fontWeight: 'bold',
        lineHeight: '1.334',
        letterSpacing: 0,
        color: '#adce5d',
      }}
    >
      recycl
    </Link>
  )
}
