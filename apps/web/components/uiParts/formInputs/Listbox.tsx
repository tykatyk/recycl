import { forwardRef, HTMLAttributes } from 'react'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Image from 'next/image'
import { Box } from '@mui/material'

const googleLogoOnWhiteHDPI =
  '/images/poweredByGoogle/powered_by_google_on_white_hdpi.png'
const googleLogoOnDarkHDPI =
  '/images/poweredByGoogle/powered_by_google_on_non_white_hdpi.png'

const Listbox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { children, ...other } = props
    const theme = useTheme()

    return (
      <Box ref={ref} role="listbox">
        <ul {...other}>{children}</ul>
        <Divider />
        <Box
          sx={{
            maxWidth: '100%',
            overflow: 'hidden',
            padding: theme.spacing(2),
            textAlign: 'right',
          }}
        >
          <Image
            width={144}
            height={18}
            sizes="(min-resolution: 2dppx) 288px, 144px"
            src={
              theme.palette.mode === 'light'
                ? `${googleLogoOnWhiteHDPI}`
                : `${googleLogoOnDarkHDPI}`
            }
            alt="Google logo"
          />
        </Box>
      </Box>
    )
  },
)
Listbox.displayName = 'Listbox'
export default Listbox
