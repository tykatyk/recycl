import isMobile from '../../lib/detectMobile'

export const setSplashMinHeight = (isLoaded, options, stateHandler) => {
  if (!isLoaded) return

  const headerHeight = document.getElementById('mainHeader').offsetHeight
  const windowHeight = window.innerHeight
  let minHeight = windowHeight - headerHeight

  if (isMobile()) {
    const portraitMode = window.innerHeight > window.innerWidth
    // console.log(window.innerHeight)
    if (options.minHeight === 0 || options.portraitMode != portraitMode) {
      // minHeight = windowHeight - headerHeight
      // alert(state.splashMinHeight === 0)
      options.minHeight = minHeight
      options.portraitMode = portraitMode
      stateHandler(minHeight)
    }
  } else {
    stateHandler(minHeight)
  }
}

let timeout
export const handleResize = (isLoaded, options, stateHandler) => {
  // throttling resize event
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    setSplashMinHeight(isLoaded, options, stateHandler)
  }, 400)
}
