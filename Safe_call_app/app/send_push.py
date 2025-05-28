import json
import requests
from google.oauth2 import service_account
from google.auth.transport.requests import Request
import os


PROJECT_ID = "safe-call-f0276"
DEVICE_TOKEN = os.getenv("DEVICE_TOKEN")
SERVICE_ACCOUNT_FILE = "service_account_key.json"

SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"]

def get_access_token():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    credentials.refresh(Request())
    return credentials.token

def send_push():
    access_token = get_access_token()

    message = {
        "message": {
            "token": DEVICE_TOKEN,
            "notification": {
                "title": "📞 전화 수신 중",
                "body": "김다희 님이 전화 중입니다."
            },
            "data": {
                "type": "incoming_call"
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
