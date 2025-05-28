# AWS Lambda Function

from openai import OpenAI
import os
import io
import json
import base64
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])

def lambda_handler(event, context):
    logger.info(f"Received event: {event}")
    # gpt-4o-mini-transcribe, gpt-4o-transcribe, whisper-1
    transcribe_model = "gpt-4o-transcribe"
    try:
        if isinstance(event, str):
            event = json.loads(event)
        audio_base64 = event["audio"]
        file_name = event.get("filename", "audio.m4a")

        logger.debug("Audio Decoding Start")
        audio_bytes = base64.b64decode(audio_base64)
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = file_name
        logger.debug("Audio Decoding End")

        logger.debug("Transcribe Request Start")
        transcript = client.audio.transcriptions.create(
            model=transcribe_model,
            file=audio_file,
            response_format="json"
        )
        logger.debug("Transcribe Request End")

        logger.info(f"Transcript result: {transcript}")

    except Exception as e:
        logger.error(f"Error: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    transcript = transcript.text

    return {
        'statusCode': 200,
        'body': {
            "result": transcript
        },
        'headers': {"Content-Type": "application/json; charset=utf-8"}
    }