# server.py
# 토큰 생성코드 
# .env 파일에 각자 livekit API key, livekit API secret 넣는 것 주의!!! 
# cmd 에서 python server.py 로 실행 
import os
from livekit import api
from flask import Flask
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

@app.route('/getToken')
def getToken():
  token = api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET')) \
    .with_identity("identity") \
    .with_name("my name") \
    .with_grants(api.VideoGrants(
        room_join=True,
        room="my-room",
    ))
  return token.to_jwt()

if __name__ == '__main__':
    app.run(debug=True)
