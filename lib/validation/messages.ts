const validationMessages = {
  required: '*Обязательное поле',
  type: 'Поле имеет неверный тип данных',
  positive: 'Поле должно содержать число больше 0',
  onlyDigits: 'Только цифры',
  onlyIntegers: 'Только целые числа',
  maxLength: ({ max }: { max: number }) => `Максимум ${max} симоволов`,
  minLength: ({ min }: { min: number }) => `Минимум ${min} симоволов`,
  email: 'Недействительный адрес электронной почты',
  phone: 'Недействительный номер телефона',
  notOnlySpaces: 'Строка не может состоять только из пробелов',
  incorrectValue: 'Значение указано не верно',
  dateIsSameOrAfter: 'Нельзя выбирать прошедшие даты',
  dateIsOneYearAfterNow: 'Нелязя выбирать даты в далеком будущем',
  timeisNotOverdue: 'Это время уже прошло',
  endTimeIsGreaterThanStartTime: 'Значение не может быть меньше времени начала',
}
export default validationMessages
