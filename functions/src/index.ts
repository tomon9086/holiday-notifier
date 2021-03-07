import * as functions from 'firebase-functions'
import { Client, TextMessage, WebhookRequestBody } from '@line/bot-sdk'
import { DateTime } from 'luxon'

import { getHolidaysInThisMonth, getNextHoliday, whatDayIs } from '@/holiday'
import { line } from '@/config'

const client = new Client({
  channelAccessToken: line.channelAccessToken,
  channelSecret: line.channelSecret
})

export const ping = functions.https.onRequest((_, res) => {
  res.send('pong')
})

export const callback = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405)
    res.send('method not allowed')
    return
  }

  const signature = req.get('X-Line-Signature')
  if (!signature) {
    res.status(400)
    res.send('signature is not set')
    return
  }

  const body = req.body as WebhookRequestBody
  const events = body.events
  await Promise.all(events.map(async (event) => {
    if (event.type !== 'message' ||
      event.message.type !== 'text' ||
      event.replyToken === '00000000000000000000000000000000') {
      return
    }
    const recievedText = event.message.text
    const now = DateTime.now().setZone('Asia/Tokyo')
    const textMessage: TextMessage = {
      type: 'text',
      text: '🙂'
    }
    if (recievedText.includes('今日') && recievedText.includes('祝日')) {
      const holidayName = await whatDayIs(now.toJSDate())
      textMessage.text = '今日は'
      if (holidayName) {
        textMessage.text += `${holidayName}です`
      } else {
        textMessage.text += '祝日ではありません'
      }
    } else if (recievedText.includes('明日') && recievedText.includes('祝日')) {
      const holidayName = await whatDayIs(now.plus({ days: 1 }).toJSDate())
      textMessage.text = '明日は'
      if (holidayName) {
        textMessage.text += `${holidayName}です`
      } else {
        textMessage.text += '祝日ではありません'
      }
    } else if (recievedText.includes('今月') && recievedText.includes('祝日')) {
      const holidays = await getHolidaysInThisMonth(now.toJSDate())
      textMessage.text = '今月の祝日は'
      if (holidays.length) {
        textMessage.text += `\n${holidays.map((holiday) => `${DateTime.fromJSDate(holiday.date).setZone('Asia/Tokyo').toFormat('M月d日')} の ${holiday.text}`).join('\n')}\nです`
      } else {
        textMessage.text += 'ありません'
      }
    } else if (recievedText.includes('次の祝日')) {
      const holiday = await getNextHoliday(now.toJSDate())
      if (holiday) {
        textMessage.text = `次の祝日は\n${DateTime.fromJSDate(holiday.date).setZone('Asia/Tokyo').toFormat('M月d日')} の ${holiday.text}\nです`
      } else {
        textMessage.text = '⚠️次の祝日を取得できませんでした'
      }
    } else {
      return
    }
    return client.replyMessage(event.replyToken, textMessage)
  }))
    .then(() => {
      res.send('success')
    })
    .catch((_: Error) => {
      res.status(500)
      res.send('failed to reply')
    })
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
