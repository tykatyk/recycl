export const setSplashMinHeight = (isLoaded, options, stateHandler) => {
  if (!isLoaded) return

  const headerHeight = document.getElementById('mainHeader').offsetHeight
  const windowHeight = window.innerHeight
  let minHeight = windowHeight - headerHeight

  stateHandler(minHeight)
}

let timeout
export const handleResize = (isLoaded, options, stateHandler) => {
  // throttling resize event
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    setSplashMinHeight(isLoaded, options, stateHandler)
  }, 400)
}
