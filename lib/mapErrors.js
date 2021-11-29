export default (errors) => {
  let mappedErrors = null

  if (errors.inner && errors.inner.length > 0) {
    errors.inner.forEach((item, i) => {
      if (!mappedErrors[item.path]) mappedErrors[item.path] = item.message
    })
  }

  return mappedErrors
}
