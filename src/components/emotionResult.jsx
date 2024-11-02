import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { analyzeVideoEmotion, transcribeAudio, createText, generateImage, getBiSentiment } from '../API';

const EmotionResultPage = () => {
  const location = useLocation();
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);

  const [analysisResult, setAnalysisResult] = useState('분석 중...');
  const [audioResult, setAudioResult] = useState('음성 인식 중...');
  const [biSentiResult, setBiSentiResult] = useState('텍스트 감정 분석 중...');
  const [generatedText, setGeneratedText] = useState('명언 생성 중...');
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { recordedAudio, recordedVideo } = location.state;
      setRecordedAudio(recordedAudio);
      setRecordedVideo(recordedVideo);

      const fetchData = async () => {
        try {
          // 감정 분석 API 호출
          const videoResult = await analyzeVideoEmotion(recordedVideo);
          const mostCommonEmotion = videoResult?.most_common_emotion || '감정 분석 결과가 없습니다.';
          setAnalysisResult(mostCommonEmotion);

          // 음성 to 텍스트 API 호출
          const audioResponse = await transcribeAudio(recordedAudio);
          const audioToText = audioResponse?.text || '음성 인식 결과가 없습니다.';
          setAudioResult(audioToText);

          // 텍스트 감정분석 API 호출
          const textSentiResult = await getBiSentiment(audioToText);
          setBiSentiResult(textSentiResult?.score || '텍스트 감정 분석 결과가 없습니다.');

          // 텍스트 to 이미지 API 호출
          const imageResult = await generateImage(mostCommonEmotion);
          setImageURL(imageResult); // 감정 기반 이미지 생성 결과 (Blob URL 설정)

          // 명언 API 호출
          const wiseSayingResponse = await createText(mostCommonEmotion);
          setGeneratedText(wiseSayingResponse?.quote || '명언 생성에 실패했습니다.');

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [location.state]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
      {/* 상단에 정렬된 중앙 이미지 */}
      <div className="flex justify-center mb-8">
        <img src="/image/emotion.png" alt="Emotion Icon" className="w-24 h-24" />
      </div>
  
      {/* 감정 분석 카드 */}
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
        {/* 감정 분석 결과 */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{analysisResult}</h1>

        {/* 변환된 텍스트 */}
        {audioResult && (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-gray-700">
            <h2 className="text-lg font-semibold mb-2">{audioResult}</h2>
            {/* <p>{audioResult}</p> */}
          </div>
        )}

        {/* 텍스트 감정 분석 결과 */}
        {biSentiResult && (
          <div className="bg-gray-100 p-4 rounded-lg mb-4 text-gray-700">
            <h2 className="text-lg font-semibold mb-2">{biSentiResult}</h2>
            {/* <p>{biSentiResult}</p> */}
          </div>
        )}

        {/* 명언 텍스트 */}
        {generatedText && (
          <p className="text-gray-600 text-lg mb-4">{generatedText}</p>
        )}
        
        {/* 생성된 이미지 */}
        {imageURL && (
          <img 
            src={imageURL} 
            alt="Generated Result" 
            className="w-full h-40 object-cover rounded-lg mb-4" 
          />
        )}

        <button 
          onClick={() => window.history.back()} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default EmotionResultPage;
