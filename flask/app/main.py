from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage
from datetime import datetime, timedelta
import os
import json

from modules.holiday import what_day_is, get_holidays_in_this_month
from modules.utils import key_to_date

app = Flask(__name__)
line_bot_api = LineBotApi(os.environ["CHANNEL_ACCESS_TOKEN"])
handler = WebhookHandler(os.environ["CHANNEL_SECRET"])

@app.route('/')
def today():
  return json.dumps(what_day_is(datetime.now()), ensure_ascii=False).encode("utf-8")


@app.route('/_everyday')
def everyday():
  today = datetime.now()

  if today.day == 1:
    holidays = get_holidays_in_this_month(today)
    text = str(today.month) + "月の祝日は"
    if len(holidays) > 0:
      for date, name in holidays:
        text += "\n" + date.strftime("%m月%d日") + " の " + name
      text += "\nです"
    else:
      text += "ありません"
    line_bot_api.broadcast(TextSendMessage(text=text))
    
    holiday_name = what_day_is(today + timedelta(1))
    text = "明日は"
    if holiday_name is not None:
      text += holiday_name + "です"
      line_bot_api.broadcast(TextSendMessage(text=text))
      
  return "done"


@app.route("/callback", methods=['POST'])
def callback():
  signature = request.headers['X-Line-Signature']

  body = request.get_data(as_text=True)
  # app.logger.info("Request body: " + body)

  try:
    handler.handle(body, signature)
  except InvalidSignatureError:
    print("Invalid signature. Please check your channel access token/channel secret.")
    abort(400)

  return 'OK'


@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
  if event.reply_token == "00000000000000000000000000000000":
    return
  
  recieved_text = event.message.text
  reply_text = "🙂"

  if "今日" in recieved_text and "祝日" in recieved_text:
    holiday_name = what_day_is(datetime.now())
    reply_text = "今日は"
    if holiday_name is not None:
      reply_text += holiday_name + "です"
    else:
      reply_text += "祝日ではありません"
      
  elif "明日" in recieved_text and "祝日" in recieved_text:
    holiday_name = what_day_is(datetime.now() + timedelta(1))
    reply_text = "明日は"
    if holiday_name is not None:
      reply_text += holiday_name + "です"
    else:
      reply_text += "祝日ではありません"
      
  elif "今月" in recieved_text and "祝日" in recieved_text:
    holidays = get_holidays_in_this_month(datetime.now())
    reply_text = "今月の祝日は"
    if len(holidays) > 0:
      for date, name in holidays:
        reply_text += "\n" + date.strftime("%m月%d日") + " の " + name
      reply_text += "\nです"
    else:
      reply_text += "ありません"

  else:
    return

  line_bot_api.reply_message(
    event.reply_token,
    TextSendMessage(text=reply_text))


if __name__ == '__main__':
  app.run()
