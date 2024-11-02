import React from 'react';
import { useNavigate } from "react-router-dom";


function HomePage() {
  const navigate = useNavigate();

  // 체험하기 버튼 클릭 시 /recorder 경로로 이동
  const handleExperienceClick = () => {
    navigate('/recorder');
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Top Image */}
      <div className="flex justify-center mb-8">
        <img src="/image/emotion.png" alt="Emotion Icon" className="w-24 h-24" />
      </div>

      {/* Introduction Section */}
      <header className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          나만의 소중한 하루, 영상으로 담다.
        </h1>
        <p className="text-lg text-gray-600">감정을 영상으로 담아, 나를 이해하기</p>
      </header>
      
      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <div className="text-4xl text-gray-500 mb-4">🎧</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">AI로 말해보는 나의 감정</h2>
          <p className="text-gray-600">AI와 함께 감정을 이야기하고 분석하며 나를 알아가는 첫 걸음을 내딛어 보세요.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <div className="text-4xl text-gray-500 mb-4">📈</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">지속적으로 기록할 수 있는 감정분석</h2>
          <p className="text-gray-600">감정 변화를 기록하고 분석하여 더 나은 나를 발견할 수 있습니다.</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg text-center">
          <div className="text-4xl text-gray-500 mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">다양한 데이터를 통해 나를 이해</h2>
          <p className="text-gray-600">개인화된 데이터를 통해 나의 감정을 깊이 이해할 수 있습니다.</p>
        </div>
      </section>
      
      {/* Emotion Analysis Section */}
      <section className="bg-gray-50 p-10 rounded-lg mb-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">나를 이해하는 첫걸음, 감정 분석</h2>
        <p className="text-gray-600 mb-6">AI가 나를 분석하고 추측하며 나와 소통하고 감정 분석의 여정을 함께 걸어주는 첫걸음.</p>
        <button
          onClick={handleExperienceClick} // 클릭 시 /recorder로 라우팅
          className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
        >
          체험하기
        </button>
      </section>
      
      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-10 rounded-lg text-center">
        <p className="text-lg mb-6">“일상의 소중한 순간을 간직하고 감정의 흐름을 발견하세요.”</p>
        <div className="flex justify-center space-x-8 text-gray-400 mb-4">
          <a href="#!" className="hover:text-white">Company</a>
          <a href="#!" className="hover:text-white">Help</a>
          <a href="#!" className="hover:text-white">Resources</a>
        </div>
        <div className="flex justify-center space-x-4 text-gray-400">
          <a href="#!" className="hover:text-white">🌐</a>
          <a href="#!" className="hover:text-white">📘</a>
          <a href="#!" className="hover:text-white">📷</a>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
