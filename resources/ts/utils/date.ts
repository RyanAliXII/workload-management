import { format } from 'date-fns'
export const toReadableDatetime = (date: Date) => {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

export const toReadableDate = (date: Date) => {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const toISO8601DateString = (date: Date) => {
  if (!isValidDatetime(date)) return ''
  try {
    return format(date, 'yyyy-MM-dd')
  } catch (error) {
    return ''
  }
}
export const toISO8601DatetimeString = (date: Date) => {
  if (!isValidDatetime(date)) return ''
  try {
    return format(date, 'yyyy-MM-dd HH:mm:ss')
  } catch (error) {
    return ''
  }
}

export const isValidDatetime = (date: Date) => {
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return true
  }
  return false
}
