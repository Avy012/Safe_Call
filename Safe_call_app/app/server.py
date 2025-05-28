# server.py
import os
import time
import jwt
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from notificationPY import send_push_notification  # ✅ import this
from firebase_admin import firestore, credentials, initialize_app
import firebase_admin


import os
print("📂 Current working directory:", os.getcwd())

load_dotenv()
app = FastAPI()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# ✅ Initialize Firestore
if not firebase_admin._apps:
    cred = credentials.Certificate("service_account_key.json")
    initialize_app(cred)

db = firestore.client()

@app.post("/get-token")
async def get_token(request: Request):
    data = await request.json()
    identity = data.get("identity")  # 👈 could be null or wrong
    print(f"🎫 Issuing token for identity: {identity}")

    name = data.get("name", identity)
    room = data.get("room", "safe-call-room")
    receiver_id = data.get("receiver_id")  # 👈 add this field in your request

    if not identity or not receiver_id:
        return {"error": "Missing identity or receiver_id"}

    now = int(time.time())
    exp = now + 3600

    payload = {
        "iss": LIVEKIT_API_KEY,
        "sub": identity,  # ✅ only caller gets token
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

    token = jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")

    # 🔍 Get receiver info (callee)
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
