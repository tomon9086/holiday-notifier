import { DateTime } from 'luxon'
import axios from '@/request'
import { compareDate, dateInMonth } from '@/utils'

const url = 'https://holidays-jp.github.io/api/v1/date.json'

type Holiday = {
  date: Date
  text: string
}

export const getHolidays = async (): Promise<Holiday[]> => {
  return await fetchHolidays()
}

export const fetchHolidays = async (): Promise<Holiday[]> => {
  return await axios.get<{[key: string]: string}>(url)
    .then((res) => res.data)
    .then((json) => {
      const holidays: Holiday[] = []
      for (const key in json) {
        const dt = DateTime.fromFormat(key, 'yyyy-MM-dd')
          .setZone('Asia/Tokyo')
        if (!dt.isValid) {
          continue
        }
        holidays.push({
          date: dt.toJSDate(),
          text: json[key]
        })
      }
      return holidays.sort((a, b) => +a.date - +b.date)
    })
}

export const whatDayIs = async (date: Date): Promise<string | undefined> => {
  const holidays = await getHolidays()
  const futureHolidays = holidays.filter((holiday) => compareDate(holiday.date, date))
  return futureHolidays.length ? futureHolidays[0].text : undefined
}

export const getHolidaysInThisMonth = async (date: Date): Promise<Holiday[]> => {
  const holidays = await getHolidays()
  return holidays.filter((holiday) => dateInMonth(holiday.date, date))
}

export const getNextHoliday = async (date: Date): Promise<Holiday | undefined> => {
  const holidays = await getHolidays()
  const futureHolidays = holidays.filter((holiday) => +holiday.date > +date)
  return futureHolidays.length ? futureHolidays[0] : undefined
}
