import isMobile from '../helpers/detectMobile'

export const setSplashMinHeight = (isLoaded, stateHandler) => {
  const headerHeight = document.getElementById('mainHeader').offsetHeight
  const windowHeight = window.innerHeight
  let minHeight = windowHeight - headerHeight

  if (!isLoaded) return
  if (isMobile()) {
    const portraitMode = window.innerHeight > window.innerWidth
    if (state.splashMinHeight === 0 || state.portraitMode != portraitMode) {
      minHeight = portraitMode
        ? state.portraitHeight - headerHeight
        : state.landscapeHeight - headerHeight

      stateHandler(() => ({
        splashMinHeight: minHeight,
        portraitMode: portraitMode,
      }))
    }
  } else {
    stateHandler(() => ({ splashMinHeight: minHeight }))
  }
}

let timeout

export const handleResize = (isLoaded, stateHandler) => {
  // throttling resize event
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    setSplashMinHeight(isLoaded, stateHandler)
  }, 400)
}
