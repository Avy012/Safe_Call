import os
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from livekit import AccessToken, VideoGrant  # ✅ FIXED

load_dotenv()

app = FastAPI()

@app.post("/get-token")
async def get_token(request: Request):
    data = await request.json()
    identity = data.get("identity")
    name = data.get("name", identity)
    room = data.get("room", "safe-call-room")

    if not identity:
        return {"error": "Missing identity"}

    token = AccessToken(
        os.getenv("LIVEKIT_API_KEY"),
        os.getenv("LIVEKIT_API_SECRET"),
        identity=identity,
        name=name,
        grants=[VideoGrant(room_join=True, room=room)],
    )

    return {"token": token.to_jwt()}
