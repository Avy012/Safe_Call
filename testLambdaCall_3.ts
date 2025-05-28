//stt -> scam판별
import * as fs from 'fs';
import axios from 'axios';
import { SpeechClient } from '@google-cloud/speech';

async function processAudioAndCallOpenAI(fileName: string) {
  const client = new SpeechClient();

  // 1. 파일 읽기
  const fileBuffer = fs.readFileSync(fileName);

  // 2. STT 요청 구성
  const audio = {
    content: fileBuffer.toString('base64'),
  };

  const config = {
    encoding: 'LINEAR16' as const,
    sampleRateHertz: 48000,
    languageCode: 'ko-KR',
  };

  const request = {
    audio,
    config,
  };

  try {
    // 3. Google Speech-to-Text 실행
    const [response] = await client.recognize(request);

    // 4. 인식 결과에서 텍스트 추출
    const transcription = response.results
      ?.map(result => result.alternatives?.[0].transcript)
      .join('\n');

    //console.log('Transcription:', transcription);

    if (!transcription) {
      console.log('No transcription result.');
      return;
    }

    // 5. OpenAI 처리용 Lambda 함수 URL (본인의 URL로 변경)
    const openAiLambdaUrl = 'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/SummationText';
    
    // 6. Lambda 함수에 텍스트 전송
    const lambdaResponse = await axios.post(openAiLambdaUrl, {
      text: transcription
    });

    console.log('OpenAI Lambda response:', lambdaResponse.data); //출력력

  } catch (error) {
    console.error('Error in STT or Lambda call:', error);
  }
}

const audioFilePath = './scenario1.wav';
processAudioAndCallOpenAI(audioFilePath);
