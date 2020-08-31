from datetime import datetime

from modules.holiday import what_day_is, get_holidays_in_this_month, get_next_holiday
from modules.utils import key_to_date

if __name__ == "__main__":
  print(get_next_holiday(datetime.now()))
