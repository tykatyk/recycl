import showErrorMessages from './showErrorMessages'
export default async function submitWithCaptcha(options) {
  const {
    recaptcha,
    recaptchaRef,
    showRecaptcha,
    values,
    endpointUrl,
    method = 'POST',
    setRecaptcha,
    setShowRecaptcha,
    setSubmitting,
    setNotification,
    setErrors,
    setSeverity,
    resetForm,
  } = options

  if (!endpointUrl) return

  setSubmitting(true)
  if (!showRecaptcha) {
    setShowRecaptcha(true)
    setSubmitting(false)
    return
  }

  if (!recaptcha) {
    setSubmitting(false)
    return
  }

  const merged = { ...values, ...{ recaptcha: recaptcha } }

  fetch(endpointUrl, {
    method,
    body: JSON.stringify(merged),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      if (data.error) {
        showErrorMessages(data.error, setErrors, setNotification)
        setSeverity('error')
        return
      }
      setSeverity('success')
      setNotification(data.message)
      resetForm()
    })
    .catch((error) => {
      setSeverity('error')
      setNotification('Неизвестная ошибка')
    })
    .finally(() => {
      if (recaptchaRef && recaptchaRef.current) {
        recaptchaRef.current.reset()
        setShowRecaptcha(false)
        setRecaptcha(null)
        setSubmitting(false)
      }
    })
}
