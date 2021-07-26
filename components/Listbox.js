import React, { useState, useEffect } from 'react'
import Divider from '@material-ui/core/Divider'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import googleLogoOnWhite from '../build/public/images/powered_by_google_on_white.png'
import googleLogoOnWhiteHDPI from '../build/public/images/powered_by_google_on_white_hdpi.png'
import googleLogoOnNonWhite from '../build/public/images/powered_by_google_on_non_white.png'
import googleLogoOnNonWhiteHDPI from '../build/public/images/powered_by_google_on_non_white_hdpi.png'

const useStyles = makeStyles((theme) => ({
  googleLogo: {
    overflow: 'hidden',
    padding: theme.spacing(2),
    textAlign: 'right'
  }
}))

export default function Listbox(props) {
  const theme = useTheme()

  const classes = useStyles()
  const initialSources =
    theme.palette.type == 'light'
      ? `${googleLogoOnWhite} 144w, ${googleLogoOnWhiteHDPI} 288w`
      : `${googleLogoOnNonWhite} 144w, ${googleLogoOnNonWhiteHDPI} 288w`

  const [imageSources, setImageSources] = useState(initialSources)

  useEffect(() => {
    const sources =
      theme.palette.type == 'light'
        ? `${googleLogoOnWhite} 144w, ${googleLogoOnWhiteHDPI} 288w`
        : `${googleLogoOnNonWhite} 144w, ${googleLogoOnNonWhiteHDPI} 288w`
    setImageSources(sources)
  }, [])

  return (
    <>
      <ul
        className="MuiAutocomplete-listbox"
        id="google-map-demo-popup"
        aria-labelledby="google-map-demo-label"
        role="listbox"
      >
        {props.children}
      </ul>
      <Divider />
      <div className={classes.googleLogo}>
        <img
          srcSet={imageSources}
          sizes="(min-resolution: 2dppx) 288px, 144px"
          src={`"${googleLogoOnWhite}"`}
          alt="Google logo"
        />
      </div>
    </>
  )
}
