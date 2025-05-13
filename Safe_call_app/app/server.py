# server.py
# 토큰 생성코드 
# .env 파일에 각자 livekit API key, livekit API secret 넣는 것 주의!!! 
# cmd 에서 python server.py 로 실행 
import os
from livekit import api
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from db import db
from models import AddedContact

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv('LIVEKIT_API_KEY')
API_SECRET = os.getenv('LIVEKIT_API_SECRET')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/added_contacts', methods=['POST'])
def createAddedContact(): 
  data = request.get_json()
  if not data.get('user_uid') or not data.get('contact_uid') or not data.get('name') or not data.get('contact'):
    return jsonify({"error":"missing field"}), 400
  
  new = AddedContact(
    user_uid = data['user_uid'],
    contact_uid = data['contact_uid'],
    name = data['name'],
    contact = data['contact']
  )
  db.session.add(new)
  db.session.commit()
  return jsonify(new.to.dict()), 201

@app.route('/getToken')
def getToken():
  # 클라이언트에서 보낸 룸 네임, 아이덴티티 받아오기
  roomName = request.args.get("room")
  identity = request.args.get("identity")
  
  token = api.AccessToken(API_KEY, API_KEY_SECRET) \
    .with_identity(identity) \
    .with_name("my name") \
    .with_grants(api.VideoGrants(
        room_join=True,
        room=roomName,
    ))
  # token을 json 형태로 반환
  return jsonify({"token": token.to_jwt()})

if __name__ == '__main__':
  app.run(debug=True)
