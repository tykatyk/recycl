import { time } from 'console'

export default function formatDate(
  dateObjOrString: string | Date,
  dateTimeDelimiter?: string,
  timeDelimiter?: string,
) {
  let date: Date
  if (typeof dateObjOrString === 'string') {
    date = new Date(dateObjOrString)
  } else {
    date = new Date()
  }
  const dateTimeseparator = dateTimeDelimiter ? dateTimeDelimiter : ', '
  const timeSeparator = timeDelimiter ? timeDelimiter : ':'
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}${dateTimeseparator}${pad(date.getHours())}${timeSeparator}${pad(date.getMinutes())}`
}
