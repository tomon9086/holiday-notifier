from jose import jws
from datetime import datetime
from pathlib import Path
import os
import json
import urllib.request
from urllib.error import URLError

url = 'https://api.line.me/oauth2/v2.1/token'

def get_cat() -> str:
  with open(str(Path("/key/" + os.environ["PRIVATE_KEY_FILE"]))) as f:
    key = f.read()
    key_dic = json.loads(key)
    payload = {
      "iss": os.environ["CHANNEL_ID"],
      "sub": os.environ["CHANNEL_ID"],
      "aud": "https://api.line.me/",
      "exp": int(datetime.utcnow().timestamp()) + 60 * 30,
      "token_exp": 60 * 60 * 24 * 30
    }
    header = {
      "alg": "RS256",
      "typ": "JWT",
      "kid": key_dic["kid"]
    }

    print(payload, key_dic, header)
    signed = jws.sign(payload, key, headers=header)
    token = fetch_token(signed)
    print(token)


def fetch_token(jwt: str) -> dict:
  method = "POST"
  headers = {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  body = {
    "grant_type": "client_credentials",
    "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    "client_assertion": jwt
  }
  data = json.dumps(body).encode("utf-8")
  req = urllib.request.Request(url, data=data, headers=headers, method=method)

  try:
    with urllib.request.urlopen(req) as res:
      body = json.load(res)
      return body
  except URLError as err:
    print("could not fetch token")
    print(err.read())
    return None
