import * as functions from 'firebase-functions'

export const ping = functions.https.onRequest((_, res) => {
  res.send('pong')
})

// export const pubsub = functions.pubsub
//   .schedule('34 3 * * *')
//   .timeZone('Asia/Tokyo')
//   .onRun(async (_context) => {
//   })
