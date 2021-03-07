import { DateTime } from 'luxon'

export const formatDate = (date: Date): string => {
  return DateTime.fromJSDate(date)
    .setZone('Asia/Tokyo')
    .toFormat('yyyy/MM/dd')
}

export const compareDate = (a: Date, b: Date):boolean => {
  const format = (date: Date) => DateTime.fromJSDate(date)
    .setZone('Asia/Tokyo')
    .toFormat('yyyy-MM-dd')
  const ads = format(a)
  const bds = format(b)
  return ads === bds
}

export const dateInMonth = (date: Date, month: Date):boolean => {
  const d = DateTime.fromJSDate(date).setZone('Asia/Tokyo')
  const m = DateTime.fromJSDate(month).setZone('Asia/Tokyo')
  return d.year === m.year && d.month === m.month
}
