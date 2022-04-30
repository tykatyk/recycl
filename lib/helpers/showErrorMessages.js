export default function showErrorMessages(error, setErrors, setNotification) {
  if (!error) return
  if (error.type === 'perField') {
    setErrors(error.message)
    return
  }
  if (error.type === 'perForm') {
    setNotification(error.message)
    return
  }

  setNotification('Неизвестная ошибка при обработке ответа сервера')
  return
}
