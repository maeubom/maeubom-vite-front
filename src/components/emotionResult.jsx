import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const EmotionResultPage = () => {
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState('');

  useEffect(() => {
    // `location.state`가 준비되었는지 확인
    if (location.state) {
      setAnalysisResult(location.state.analysisResult || '분석 결과가 없습니다.');
    }
  }, [location.state]);

  return (
    <div>
      <h1>감정 분석 결과</h1>
      <p>{analysisResult}</p>
    </div>
  );
};

export default EmotionResultPage;
