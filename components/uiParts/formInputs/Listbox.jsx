import React, { useState, useEffect, forwardRef, useCallback } from 'react'
import Divider from '@material-ui/core/Divider'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Image from 'next/image'

const googleLogoOnWhite =
  '/images/poweredByGoogle/powered_by_google_on_white.png'
const googleLogoOnWhiteHDPI =
  '/images/poweredByGoogle/powered_by_google_on_white_hdpi.png'
const googleLogoOnNonWhite =
  '/images/poweredByGoogle/powered_by_google_on_non_white.png'
const googleLogoOnNonWhiteHDPI =
  '/images/poweredByGoogle/powered_by_google_on_non_white_hdpi.png'

const useStyles = makeStyles((theme) => ({
  googleLogo: {
    maxWidth: '100%',
    overflow: 'hidden',
    padding: theme.spacing(2),
    textAlign: 'right',
  },
}))

const Listbox = forwardRef((props, ref) => {
  const { children, ...other } = props
  const theme = useTheme()

  const classes = useStyles()

  const getSources = useCallback(() => {
    theme.palette.type === 'light'
      ? `${googleLogoOnWhite} 144w, ${googleLogoOnWhiteHDPI} 288w`
      : `${googleLogoOnNonWhite} 144w, ${googleLogoOnNonWhiteHDPI} 288w`
  }, [theme])

  const initialSources = getSources()

  const [imageSources, setImageSources] = useState(initialSources)

  useEffect(() => {
    const sources = getSources()

    setImageSources(sources)
  }, [theme.palette.type, getSources])

  return (
    <div ref={ref}>
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
            theme.palette.type === 'light'
              ? `${googleLogoOnWhite}`
              : `${googleLogoOnNonWhite}`
          }
          alt="Google logo"
        />
      </div>
    </div>
  )
})
Listbox.displayName = 'Listbox'
export default Listbox
