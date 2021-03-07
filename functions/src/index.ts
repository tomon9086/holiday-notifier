import * as functions from 'firebase-functions'
import { Client, TextMessage } from '@line/bot-sdk'
import { DateTime } from 'luxon'

import { getHolidaysInThisMonth, whatDayIs } from '@/holiday'
import { line } from '@/config'

const client = new Client({
  channelAccessToken: line.channelAccessToken,
  channelSecret: line.channelSecret
})

export const ping = functions.https.onRequest((_, res) => {
  res.send('pong')
})

export const everyday = functions.pubsub
  .schedule('0 9 * * *')
  .timeZone('Asia/Tokyo')
  .onRun(async (_context) => {
    const now = DateTime.now()
      .setZone('Asia/Tokyo')

    const textMessage: TextMessage = {
      type: 'text',
      text: `${now.month}月の祝日は`
    }
    if (now.day === 1) {
      const holidaysInThisMonth = await getHolidaysInThisMonth(now.toJSDate())
      if (holidaysInThisMonth.length) {
        textMessage.text += `\n${holidaysInThisMonth.map((holiday) => `${DateTime.fromJSDate(holiday.date).setZone('Asia/Tokyo').toFormat('M月d日')} の ${holiday.text}`).join('\n')}\nです`
      } else {
        textMessage.text += 'ありません'
      }
      client.broadcast(textMessage)
    } else {
      const holidayNameToday = await whatDayIs(now.setZone('Asia/Tokyo').plus({ days: 1 }).toJSDate())
      if (holidayNameToday) {
        client.broadcast({
          type: 'text',
          text: `明日は${holidayNameToday}です`
        })
      }
    }
  })
