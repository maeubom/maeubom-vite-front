import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from "./components/home"
import SeparateMediaRecorder from "./components/SeparateMediaRecorder"
import EmotionResultPage from "./components/emotionResult"

function App() {
  const [showRecorder, setShowRecorder] = useState(false);

  return (
    <Router>
      <div className="flex flex-col items-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recorder" element={<SeparateMediaRecorder />} />
          <Route path="/emotionResult" element={<EmotionResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
