# notification.py
import json
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import os

SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"]
SERVICE_ACCOUNT_FILE = "service_account_key.json"  # same directory
PROJECT_ID = "safe-call-f0276"  # 🔁 Replace with your actual project ID

print("✅ notificationPY module successfully loaded")



def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE,
        scopes=SCOPES
    )
    credentials.refresh(Request())
    return credentials.token


def send_push_notification(device_token: str, caller_name: str, call_payload: dict):
    access_token = get_access_token()

    message = {
        "message": {
            "token": device_token,
            "notification": {
                "title": "📞 전화 수신 중",
                "body": f"{caller_name} 님이 전화 중입니다.",
                "sound": "default"
            },
            "android": {
                "priority": "high",
                "notification": {
                    "sound": "default",
                    "channel_id": "incoming_calls",  # 👈 Must match what's in app/_layout.tsx
                }
            },
            "data": {
                "type": "incoming_call",
                "name": caller_name,
                "phone": call_payload.get("phone", ""),
                "token": call_payload.get("token", ""),
                "roomName": call_payload.get("roomName", ""),
                "callId": call_payload.get("callId", ""),
                "profilePic": call_payload.get("profilePic", "")
            }
        }
    }

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json; UTF-8",
    }

    res = requests.post(
        f"https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send",
        headers=headers,
        data=json.dumps(message)
    )

    print("📤 Push response:", res.status_code, res.text)
    return res.status_code == 200
