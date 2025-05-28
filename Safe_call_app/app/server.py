# # server.py
# # 토큰 생성코드 
# # .env 파일에 각자 livekit API key, livekit API secret 넣는 것 주의!!! 
# # cmd 에서 python server.py 로 실행 
# import os
# import json
# import requests
# import time
# from livekit import api
# from dotenv import load_dotenv
# from flask import Flask, request, jsonify

# with open("clever-cyclist-460617-c3-3a755b13d012.json") as f:
#     gcp_credentials = json.load(f)

# # Load environment variables from .env file
# load_dotenv()

# app = Flask(__name__)

# LIVEKIT_EGRESS_URL = "https://cloud.lke.rs/v1/egress/participant"  # LiveKit 서버 REST endpoint
# token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJpZGVudGl0eTU1IiwiaXNzIjoiQVBJV1JVenJCcktYRUY0IiwibmJmIjoxNzQ3OTExNTI5LCJleHAiOjE3NDc5MzMxMjl9.0RE8wJ6MrnULu-DVW10PMLsD7dfsYQg5rgCvWjYJwjQ"
# # 프로젝트 기준 경로에서 record 디렉토리를 절대 경로로 생성
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# RECORD_DIR = os.path.join(BASE_DIR, "../record")  # 상위 폴더의 'record'

# # Generate the LiveKit token
# def generate_token():
#     token = api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET')) \
#         .with_identity("tester") \
#         .with_name("my name") \
#         .with_grants(api.VideoGrants(
#             room_join=True,
#             room="my-room",
#             can_subscribe=True,
#             can_publish=True,
#             can_publish_data=True,
#             # can_publish_audio=True,
#             # can_publish_video=True
#         ))
#     return token.to_jwt()

# # Save the token to a JSON file
# def save_token_to_file():
#     token = generate_token()
#     token_data = {"token": token}

#     # Save the token as a JSON file
#     with open("livekit_token.json", "w") as file:
#         json.dump(token_data, file, indent=4)

#     print("Token saved to livekit_token.json")
    
# @app.route('/start_egress', methods=['POST'])
# def start_egress():
#     print("이그레스 시작 함수 호출")
#     data = request.get_json()
#     room_name = data["room_name"]
#     identity = data["identity"]

#     # 파일 경로를 고유하게 생성
#     timestamp = int(time.time())
#     out_file = os.path.join(RECORD_DIR, f"{room_name}_{identity}_{timestamp}.mp3")

#     headers = {
#         "Authorization": f"Bearer {token}",
#         "Content-Type": "application/json"
#     }
#     body = {
#         "room_name": room_name,
#         "identity": identity,
#         "audio_only": True,
#         "gcp_outputs": [
#             {
#             "bucket": "safecall-record",
#             "filepath": f"{room_name}/{identity}/{timestamp}.mp3",
#             "credentials_json": json.dumps(gcp_credentials)
#             }
#         ]
#     }
#     resp = requests.post(LIVEKIT_EGRESS_URL, headers=headers, json=body)
#     return resp.json()

# @app.route('/stop_egress', methods=['POST'])
# def stop_egress():
#     data = request.get_json()
#     egress_id = data["egress_id"]

#     stop_url = f"https://cloud.lke.rs/v1/egress/{egress_id}/stop"
#     headers = {
#         "Authorization": f"Bearer {token}"
#     }
#     resp = requests.post(stop_url, headers=headers)
#     return resp.json()

# # 필요에 따라 상태 확인 endpoint도 구현 가능

# # Call the function to generate and save the token
# if __name__ == "__main__":
#     # save_token_to_file()
#     app.run(debug=True)

import os
import json
import time
import logging
import requests
import datetime
from livekit import api
from dotenv import load_dotenv
from flask import Flask, request, jsonify

logging.basicConfig(level=logging.DEBUG, force=True)

load_dotenv()

app = Flask(__name__)

LIVEKIT_EGRESS_URL = "https://cloud.lke.rs/v1/egress/participant"
token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoibXkgbmFtZSIsInZpZGVvIjp7InJvb21Kb2luIjp0cnVlLCJyb29tIjoibXktcm9vbSIsImNhblB1Ymxpc2giOnRydWUsImNhblN1YnNjcmliZSI6dHJ1ZSwiY2FuUHVibGlzaERhdGEiOnRydWV9LCJzdWIiOiJtaiIsImlzcyI6IkFQSVdSVXpyQnJLWEVGNCIsIm5iZiI6MTc0Nzk3NDQxOSwiZXhwIjoxNzQ3OTk2MDE5fQ.ANKGqbNw4SU7BqtedbD1QBewMj9GPTVt_RL-b19Q7uI"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RECORD_DIR = os.path.join(BASE_DIR, "../record")

def generate_token():
    token = api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET')) \
        .with_identity("mj") \
        .with_name("my name") \
        .with_grants(api.VideoGrants(
            room_join=True,
            room_record=True,
            recorder=True,
            room="my-room",
            can_subscribe=True,
            can_publish=True,
            can_publish_data=True
        ))

    return token.to_jwt()

def generate_egress_token():
    api_key    = os.getenv('LIVEKIT_API_KEY')
    api_secret = os.getenv('LIVEKIT_API_SECRET')
    if not api_key or not api_secret:
        raise RuntimeError("LIVEKIT_API_KEY/API_SECRET 환경변수를 설정하세요")

    # AccessToken 생성 및 identity 지정
    at = api.AccessToken(api_key, api_secret).with_identity("egress-service")

    # 녹음 권한 부여: recorder + room_record
    grants = api.VideoGrants(
        room="my-room",
        recorder=True,
        room_record=True
    )
    at.with_grants(grants)

    # 만료시간 24시간으로 설정 (timedelta 사용)
    at.ttl = datetime.timedelta(hours=24)

    return at.to_jwt()

# Save the token to a JSON file
def save_token_to_file():
    token = generate_token()
    egress_token = generate_egress_token()
    token_data = {"token": token}
    egress_token_data = {"egress_token": egress_token}

    # Save the token as a JSON file
    with open("livekit_token.json", "w") as file:
        json.dump({
            "token": token_data,
            "egress_token": egress_token_data
        }, file, indent=2)
        
    print("Token saved to livekit_token.json")

if __name__ == "__main__":
    # app.run(debug=True, use_reloader=False)
    save_token_to_file()