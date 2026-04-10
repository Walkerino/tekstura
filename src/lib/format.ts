const fullDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function formatNewsDate(value: string) {
  const date = new Date(value)
  const formatted = fullDateFormatter.format(date)

  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function toDateInputValue(value: string) {
  const date = new Date(value)
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')

  return `${date.getUTCFullYear()}-${month}-${day}`
}

export function formatAdminDate(value: string) {
  return shortDateFormatter.format(new Date(value))
}
