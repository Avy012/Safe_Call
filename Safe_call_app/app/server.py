# server.py
# 토큰 생성코드 
# .env 파일에 각자 livekit API key, livekit API secret 넣는 것 주의!!! 
# cmd 에서 python server.py 로 실행 
import os
import json
from livekit import api
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Generate the LiveKit token
def generate_token():
    token = api.AccessToken(os.getenv('LIVEKIT_API_KEY'), os.getenv('LIVEKIT_API_SECRET')) \
        .with_identity("identity") \
        .with_name("dkim") \
        .with_grants(api.VideoGrants(
            room_join=True,
            room="my-room",
        ))
    return token.to_jwt()

# Save the token to a JSON file
def save_token_to_file():
    token = generate_token()
    token_data = {"token": token}

    # Save the token as a JSON file
    with open("livekit_token.json", "w") as file:
        json.dump(token_data, file, indent=4)

    print("Token saved to livekit_token.json")

# Call the function to generate and save the token
if __name__ == "__main__":
    save_token_to_file()

