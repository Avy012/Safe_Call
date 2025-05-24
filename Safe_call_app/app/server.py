import os
from fastapi import FastAPI, Request
from livekit import api
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

# Optional: Allow your React Native app to access this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only. Set your app origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/get-token")
async def get_token(request: Request):
    data = await request.json()
    identity = data.get("identity")  # unique user ID
    name = data.get("name", identity)
    room = data.get("room", "safe-call-room")
    
    print("📥 Incoming token request:", data)


    if not identity:
        return {"error": "Missing identity"}

    token = api.AccessToken(
        os.getenv("LIVEKIT_API_KEY"),
        os.getenv("LIVEKIT_API_SECRET"),
    ).with_identity(identity).with_name(name).with_grants(
        api.VideoGrants(room_join=True, room=room)
    ).to_jwt()

    return {"token": token}
