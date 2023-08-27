import React, { useState, useEffect, forwardRef, useCallback } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Image from 'next/image'

const PREFIX = 'Listbox'

const classes = {
  googleLogo: `${PREFIX}-googleLogo`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.googleLogo}`]: {
    maxWidth: '100%',
    overflow: 'hidden',
    padding: theme.spacing(2),
    textAlign: 'right',
  },
}))

const googleLogoOnWhite =
  '/images/poweredByGoogle/powered_by_google_on_white.png'
const googleLogoOnWhiteHDPI =
  '/images/poweredByGoogle/powered_by_google_on_white_hdpi.png'
const googleLogoOnNonWhite =
  '/images/poweredByGoogle/powered_by_google_on_non_white.png'
const googleLogoOnNonWhiteHDPI =
  '/images/poweredByGoogle/powered_by_google_on_non_white_hdpi.png'

const Listbox = forwardRef((props, ref) => {
  const { children, ...other } = props
  const theme = useTheme()

  const getSources = useCallback(() => {
    theme.palette.mode === 'light'
      ? `${googleLogoOnWhite} 144w, ${googleLogoOnWhiteHDPI} 288w`
      : `${googleLogoOnNonWhite} 144w, ${googleLogoOnNonWhiteHDPI} 288w`
  }, [theme])

  const initialSources = getSources()

  const [imageSources, setImageSources] = useState(initialSources)

  useEffect(() => {
    const sources = getSources()

    setImageSources(sources)
  }, [theme.palette.mode, getSources])

  return (
    <Root ref={ref}>
      <ul {...other}>{children}</ul>
      <Divider />
      <div className={classes.googleLogo}>
        <Image
          layout="responsive"
          width={144}
          height={18}
          srcSet={imageSources}
          sizes="(min-resolution: 2dppx) 288px, 144px"
          src={
            theme.palette.mode === 'light'
              ? `${googleLogoOnWhite}`
              : `${googleLogoOnNonWhite}`
          }
          alt="Google logo"
        />
      </div>
    </Root>
  )
})
Listbox.displayName = 'Listbox'
export default Listbox
