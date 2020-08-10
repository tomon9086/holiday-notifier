import urllib.request
import json
from datetime import datetime

from ..utils import format_date, compare_date, key_in_month, key_to_date

url = 'https://holidays-jp.github.io/api/v1/date.json'

storage = {
  "updated": None,
  "holidays": None
}

def get_holidays() -> dict:
  if storage["updated"] is None or storage["holidays"] is None:
    fetch_holidays()
  elif (datetime.now() - storage["updated"]).days > 30:
    fetch_holidays()
  print("using:", format_date(storage["updated"]))
  return storage["holidays"] or {}

def fetch_holidays() -> dict:
  print("fetch!")
  req = urllib.request.Request(url)
  try:
    with urllib.request.urlopen(req) as res:
      body = json.load(res)
      storage["updated"] = datetime.now()
      storage["holidays"] = body
      return body
  except:
    print("could not fetch data")
    return None

def what_day_is(date: datetime):
  for key, name in get_holidays().items():
    if compare_date(key, date):
      return name
  return None

def get_holidays_in_this_month(date: datetime):
  ret = []
  for key, name in get_holidays().items():
    if key_in_month(key, date):
      ret.append((
        key_to_date(key),
        name
      ))
  return ret
