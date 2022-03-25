export default (error) => {
  if (Array.isArray(error)) return null

  let mappedErrors = {}

  if (error.inner && error.inner.length > 0) {
    error.inner.forEach((item, i) => {
      if (!mappedErrors[item.path]) mappedErrors[item.path] = item.message
    })
    return mappedErrors
  }

  return null
}
