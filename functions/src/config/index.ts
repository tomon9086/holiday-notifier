import * as functions from 'firebase-functions'

const config = functions.config()

const channelAccessToken = config.line?.channel_access_token
const channelSecret = config.line?.channel_secret
if (!channelAccessToken || !channelSecret) {
  throw new Error('insufficient line config')
}

export const line = {
  channelAccessToken,
  channelSecret
}
