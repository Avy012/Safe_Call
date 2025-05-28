import sys
import os
import time
import jwt
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from .notification import send_push_notification  # ✅ import this
from firebase_admin import firestore, credentials, initialize_app
import firebase_admin
import traceback

print("📂 Current working directory:", os.getcwd())
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()
app = FastAPI()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# ✅ Initialize Firestore
if not firebase_admin._apps:
    cred = credentials.Certificate("service_account_key.json")
    initialize_app(cred)

db = firestore.client()

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

    egress_token = at.to_jwt()
    egress_token_data = {"egress_token": egress_token}
    
    with open("livekit_token.json", "w") as file:
        json.dump({
            "egress_token": egress_token_data
        }, file, indent=4)
        
    return {print("Token saved to livekit_token.json")}


@app.post("/get-token")
async def get_token(request: Request):
    try:
        data = await request.json()
        identity = data.get("identity")
        print(f"🎫 Issuing token for identity: {identity}")

        name = data.get("name", identity)
        room = data.get("room", "safe-call-room")
        receiver_id = data.get("receiver_id")

        if not identity or not receiver_id:
            return {"error": "Missing identity or receiver_id"}

        now = int(time.time())
        exp = now + 3600

        payload = {
            "iss": LIVEKIT_API_KEY,
            "sub": identity,
            "nbf": now,
            "exp": exp,
            "name": name,
            "video": {
                "roomJoin": True,
                "room": room,
                "canPublish": True,
                "canSubscribe": True,
            }
        }

        print("🛠 JWT payload:", payload)
        print("🔐 SECRET exists?", bool(LIVEKIT_API_SECRET))

        token = jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")

        user_doc = db.collection("users").document(receiver_id).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            push_token = user_data.get("pushToken")
            if push_token:
                call_payload = {
                    "name": name,
                    "phone": user_data.get("phone", ""),
                    "profilePic": user_data.get("profilePic", ""),
                    "roomName": room,
                    "callId": identity,
                    "type": "incoming_call"
                }
                send_push_notification(push_token, name, call_payload)
                print("📤 Push sent to:", push_token)
            else:
                print("⚠️ No pushToken found for user:", receiver_id)
        else:
            print("❌ No Firestore user found for:", receiver_id)

        return {"token": token}

    except Exception as e:
        print("🔥 Exception occurred while handling /get-token")
        traceback.print_exc()
        return {"error": f"Internal server error: {str(e)}"}
    
@app.get("/ping")
def ping():
    return {"status": "ok"}

