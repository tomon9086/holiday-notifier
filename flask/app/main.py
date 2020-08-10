from flask import Flask
from datetime import datetime
import json

from .modules.holiday import what_day_is, get_holidays_in_this_month
from .modules.utils import key_to_date

app = Flask(__name__)

@app.route('/')
def today():
  return json.dumps(what_day_is(datetime.now()), ensure_ascii=False)

if __name__ == '__main__':
  app.run()
