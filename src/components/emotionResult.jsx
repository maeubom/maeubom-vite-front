import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyzeVideoEmotion, transcribeAudio, createText, generateImage, getBiSentiment } from '../API';
import html2canvas from 'html2canvas';

const EmotionResultPage = () => {
  const location = useLocation();
  const resultRef = useRef(null); // 캡처할 컴포넌트를 참조하기 위한 Ref
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
          const videoResult = await analyzeVideoEmotion(recordedVideo);
          const mostCommonEmotion = videoResult?.most_common_emotion || '감정 분석 결과가 없습니다.';
          setAnalysisResult(mostCommonEmotion);

          const audioResponse = await transcribeAudio(recordedAudio);
          const audioToText = audioResponse?.text || '음성 인식 결과가 없습니다.';
          setAudioResult(audioToText);

          const textSentiResult = await getBiSentiment(audioToText);
          setBiSentiResult(textSentiResult?.score || '텍스트 감정 분석 결과가 없습니다.');

          const imageResult = await generateImage(mostCommonEmotion);
          setImageURL(imageResult);

          const wiseSayingResponse = await createText(mostCommonEmotion);
          setGeneratedText(wiseSayingResponse?.quote || '명언 생성에 실패했습니다.');

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [location.state]);

  // 분석 결과를 이미지로 다운로드하는 함수
  const handleDownloadAsImage = () => {
    if (resultRef.current) {
      html2canvas(resultRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'emotion_analysis_result.png';
        link.click();
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="flex justify-center mb-8">
        <img src="/image/emotion.png" alt="Emotion Icon" className="w-24 h-24" />
      </div>
  
      <div
        ref={resultRef} // 이 부분을 캡처합니다
        className="bg-white shadow-xl rounded-lg p-8 max-w-lg w-full text-center transform transition duration-300 hover:scale-105"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{analysisResult}</h1>

        {audioResult && (
          <div className="bg-indigo-50 p-4 rounded-lg mb-6 text-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-indigo-800">음성 인식 결과</h2>
            <p>{audioResult}</p>
          </div>
        )}

        {biSentiResult && (
          <div className="bg-purple-50 p-4 rounded-lg mb-6 text-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-purple-800">텍스트 감정 분석 결과</h2>
            <p>{biSentiResult}</p>
          </div>
        )}

        {generatedText && (
          <p className="bg-pink-50 p-4 rounded-lg mb-6 text-pink-700 shadow-sm text-lg font-medium">{generatedText}</p>
        )}
        
        {imageURL && (
          <img 
            src={imageURL} 
            alt="Generated Result" 
            className="w-full h-64 object-contain rounded-lg mb-6 shadow-lg border border-gray-200"
          />
        )}

        <div className="flex justify-center space-x-8 mt-6">
          <button 
            onClick={() => window.history.back()} 
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
          >
            돌아가기
          </button>
          <button 
            onClick={handleDownloadAsImage} 
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            다운받기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmotionResultPage;
