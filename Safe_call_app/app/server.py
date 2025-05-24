import os
import time
import jwt  # PyJWT
from fastapi import FastAPI, Request
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")


@app.post("/get-token")
async def get_token(request: Request):
    data = await request.json()
    identity = data.get("identity")
    name = data.get("name", identity)
    room = data.get("room", "safe-call-room")

    if not identity:
        return {"error": "Missing identity"}

    now = int(time.time())
    exp = now + 3600  # 1 hour expiry

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

    token = jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")

    return {"token": token}
