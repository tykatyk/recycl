const getPrefix = (val: number) => {
  const remain = val % 10
  if (remain === 1) {
    return 'символ'
  } else if ([2, 3, 4].includes(remain)) {
    return 'символа'
  }
  return 'символов'
}

export const validationMessages = {
  required: 'Обязательное поле',
  positive: 'Поле должно содержать число больше 0',
  onlyDigits: 'Только цифры',
  onlyIntegers: 'Только целые числа',
  email: 'Недействительный email',
  phone: 'Недействительный номер телефона',
  notOnlySpaces: 'Строка не может состоять только из пробелов',
  wrongType: 'Значение имеет не верный тип данных',
  dateIsSameOrAfter: 'Дата/время меньше текущих',
  dateIsOneYearAfterNow: 'Нелязя выбирать даты в далеком будущем',
  atLeastOne: 'Выберите хотя бы 1 значение',
  maxLength: ({ max }: { max: number }) => {
    const prefix = getPrefix(max)
    return `Максимум ${max} ${prefix}`
  },
  minLength: ({ min }: { min: number }) => {
    const prefix = getPrefix(min)
    return `Минимум ${min} ${prefix}`
  },
  maxNumber: ({ max }: { max: number }) =>
    `Значение не должно быть больше ${max}`,
  minNumber: ({ min }: { min: number }) =>
    `Значение не должно быть меньше ${min}`,
}
