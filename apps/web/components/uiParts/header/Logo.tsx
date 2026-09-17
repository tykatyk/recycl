import Image from 'next/image'
import Link from '../Link'
import { colors } from '../../../lib/helpers/themeStub'
import { Box } from '@mui/material'

export default function Logo() {
  return (
    <Link
      underline="none"
      href="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        color: colors.brand,
      }}
    >
      <Image src="/images/logo.png" alt="recycl" width={32} height={32} />

      <Box
        component="span"
        sx={{
          display: { xs: 'none', md: 'inline' },
          fontSize: '1.5rem',
          fontFamily: 'inherit',
          fontWeight: 'bold',
          lineHeight: '1.334',
          letterSpacing: 0,
        }}
      >
        {process.env.NEXT_PUBLIC_BRAND || ''}
      </Box>
    </Link>
  )
}
