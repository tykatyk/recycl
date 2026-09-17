export const getDesktopBreakpoints = (drawerOpen: boolean) => {
  return drawerOpen ? { xs: 'none', lg: 'flex' } : { xs: 'none', md: 'flex' }
}
export const getMobileViewport = (drawerOpen: boolean) => {
  return drawerOpen ? { show: 'xs', hide: 'lg' } : { show: 'xs', hide: 'md' }
}
