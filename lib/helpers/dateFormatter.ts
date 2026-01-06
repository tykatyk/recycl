export function formatDate(dateObjOrString: string | Date) {
  let date: Date
  if (typeof dateObjOrString === 'string') {
    date = new Date(dateObjOrString)
  } else {
    date = new Date()
  }

  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}`
}
