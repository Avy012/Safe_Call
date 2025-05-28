//stt하는 lambda 불러오는 코드
import * as fs from 'fs';
import axios from 'axios';

async function transcribeWav(fileName: string) {
  const hz = 48000;
  
  const fileBuffer = fs.readFileSync(fileName);
  const audio = fileBuffer.toString('base64')

  // Lambda 함수가 배포된 URL로 교체하세요.
  const lambdaApiUrl = 'https://usyvahybz2.execute-api.us-east-1.amazonaws.com/dev/audio';

  // Lambda에 POST 요청
  const lambdaResponse = await axios.post(
    lambdaApiUrl, {
      audio: audio
    }
  );
   console.log(lambdaResponse.data.body);
}

const audioFilePath = [
  './scenario1.wav',
];

for(const path of audioFilePath){
  transcribeWav(path);
};
