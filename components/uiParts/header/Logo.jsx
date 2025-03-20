import Link from '../Link'
import { colors } from '../../../lib/helpers/themeStub'

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
        color: colors.brand,
      }}
    >
      recycl
    </Link>
  )
}
