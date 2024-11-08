import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analyzeVideoEmotion, transcribeAudio, createText, generateImage, getBiSentiment, createMusicBinary } from '../API';
import html2canvas from 'html2canvas';
import loadingImage from '../assets/loading.svg'; // 로딩 이미지를 import
import musicLoadingImage from '../assets/loading2.svg'; // 음악 로딩 이미지 import
import translate from 'translate';
import React from 'react';

const EmotionResultPage = () => {
  const location = useLocation();
  const resultRef = useRef(null); // 캡처할 컴포넌트를 참조하기 위한 Ref
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);

  const [analysisResult, setAnalysisResult] = useState('감정 분석 중...');
  const [audioResult, setAudioResult] = useState('음성 분석 중...');
  const [biSentiResult, setBiSentiResult] = useState(null);
  const [generatedText, setGeneratedText] = useState('명언 생성 중...');
  const [imageURL, setImageURL] = useState(null);
  const [musicURL, setMusicURL] = useState(null);

  const [isLoadingImage, setIsLoadingImage] = useState(false); // 이미지 생성 로딩 상태 추가
  const [isMusicLoadingImage, setIsMusicLoadingImage] = useState(false); // 음악 생성 로딩 상태 추가

  // 번역 함수
  const translateText = async (text) => {
    try {
      translate.engine = 'google'; // 번역 엔진 설정
      translate.from = 'ko';
      translate.to = 'en';

      const result = await translate(text);
      return result
    } catch (error) {
      console.error('Translation error:', error);
      return 'Translation failed';
    }
  };


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
          const translatedText = await translateText(audioToText); // ko - en 번역 중
          console.log(translatedText);


          const textSentiResult = await getBiSentiment(audioToText);
          setBiSentiResult(textSentiResult?.score || '텍스트 감정 분석 결과가 없습니다.');

          setIsLoadingImage(true); // 이미지 생성 시작 시 로딩 상태 true로 설정
          const imageResult = await generateImage(mostCommonEmotion + ", " + translatedText);
          setImageURL(imageResult);
          setIsLoadingImage(false); // 이미지 생성 완료 후 로딩 상태 false로 설정

          const wiseSayingResponse = await createText(mostCommonEmotion + ", " + translatedText);
          setGeneratedText(wiseSayingResponse?.quote || '명언 생성에 실패했습니다.');

          setIsMusicLoadingImage(true); // 음악 생성 시작 시 로딩 상태 true로 설정
          const musicResult = await createMusicBinary(mostCommonEmotion + ", " + translatedText);
          const url = URL.createObjectURL(musicResult);
          setMusicURL(url);
          setIsMusicLoadingImage(false); // 음악 생성 완료 후 로딩 상태 flase로 설정

        } catch (error) {
          console.error('Error fetching data:', error);
          setIsLoadingImage(false); // 에러 발생 시에도 로딩 상태를 false로 설정
          setIsMusicLoadingImage(false); // 음악 생성 로딩 역시 false로 설정
        }
      };

      fetchData();
    }
  }, [location.state]);

  // 분석 결과를 이미지로 다운로드하는 함수
  const handleDownloadAsImage = () => {
    if (resultRef.current) {
      html2canvas(resultRef.current, {
        width: 500,
        height: 800,
        scale: 1,
        useCORS: true,
      }).then((canvas) => {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-4">[{analysisResult}]</h1>

        {audioResult && (
          <div className="bg-indigo-50 p-4 rounded-lg mb-6 text-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-indigo-800">음성 인식</h2>
            <p>{audioResult}</p>
          </div>
        )}


        <div className="bg-purple-50 p-4 rounded-lg mb-6 text-gray-700 shadow-sm">
          <h2 className="text-lg font-semibold mb-2 text-purple-800">텍스트 감정 분석 결과</h2>
          {biSentiResult == null ? (
            <p>분석 중...</p>
          ) : (
            <>
              <div className="w-full bg-red-600 rounded-full h-2.5 dark:bg-red-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${biSentiResult * 100}%` }}></div>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-700 dark:text-blue">Positive</span>
                <span className="text-base font-medium text-red-700 dark:text-red">Negative</span>
              </div>

              <p>{(biSentiResult * 100).toFixed(2)}%</p>
            </>
          )}
        </div>


        {generatedText && (
          <div className="bg-pink-50 p-4 rounded-lg mb-6 text-gray-700 shadow-sm">
            <h2 className="text-lg font-semibold mb-2 text-pink-800">추천 명언</h2>
            {generatedText.includes('-') ? (
              <>
                <p className="text-base font-medium mb-2">{generatedText.split('-')[0].trim()}</p>
                <p className="text-base font-semibold text-gray-700">- {generatedText.split('-')[1].trim()}</p>
              </>
            ) : (
              <p className="text-base font-medium">{generatedText}</p>
            )}
          </div>
        )}


        {/* 이미지 생성 중 로딩 표시 */}
        {isLoadingImage ? (
          <div className="flex justify-center items-center mb-6">
            <img src={loadingImage} alt="Loading" className="w-24 h-24" />
          </div>
        ) : (
          imageURL && (
            <img
              src={imageURL}
              alt="Generated Result"
              className="w-full h-64 object-contain rounded-lg mb-6 shadow-lg border border-gray-200"
            />
          )
        )}

        {/* 음악 생성 중 로딩 표시 */}
        {isMusicLoadingImage ? (
          <div className="flex justify-center items-center mb-6">
            <img src={musicLoadingImage} alt="Loading" className="w-24 h-24" />
          </div>
        ) : (
          musicURL && (
            <audio controls>
              <source src={musicURL} type="audio/wav" />
              Your browser does not support the audio
            </audio>
          )
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
            다운로드
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmotionResultPage;