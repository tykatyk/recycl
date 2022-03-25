export default function showErrorMessages(error, setErrors, setBackendError) {
  if (!error) return
  if (error.type === 'perField') {
    setErrors(error.message)
    return
  }
  if (error.type === 'perForm') {
    setBackendError(error.message)
    return
  }

  setBackendError('Неизвестная ошибка при обработке ответа сервера')
  return
}
