export default (errors) => {
  let mappedErrors = {}

  if (errors.inner && errors.inner.length > 0) {
    errors.inner.forEach((item, i) => {
      if (!mappedErrors[item.path]) mappedErrors[item.path] = item.message
    })
    return mappedErrors
  }

  return null
}
