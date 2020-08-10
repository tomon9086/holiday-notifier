import datetime

def format_date(d: datetime) -> str:
  if d is None:
    return ""
  return d.strftime("%Y/%m/%d")

def compare_date(key: str, date: datetime) -> bool:
  if date is None:
    return False
  date_str = date.strftime("%Y-%m-%d")
  return key == date_str

def key_in_month(key: str, date: datetime) -> bool:
  key_date = key_to_date(key)
  return key_date.year == date.year and key_date.month == date.month

def key_to_date(key: str) -> datetime:
  l = list(map(int, list(key.split("-"))))
  return datetime.date(l[0], l[1], l[2])
