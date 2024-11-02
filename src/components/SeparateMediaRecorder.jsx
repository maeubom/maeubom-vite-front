import { React, useState, useRef, useEffect } from 'react';
import { Video, Mic, Camera, StopCircle, Download, Smile } from 'lucide-react';
import { analyzeVideoEmotion } from '../API';
import { useNavigate } from "react-router-dom";

const SeparateMediaRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const videoRecorderRef = useRef(null);
  const audioRecorderRef = useRef(null);
  const videoChunksRef = useRef([]);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  // 미디어 스트림 시작
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const videoStream = new MediaStream([stream.getVideoTracks()[0]]);
      const audioStream = new MediaStream([stream.getAudioTracks()[0]]);
          
      videoRecorderRef.current = new MediaRecorder(videoStream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      audioRecorderRef.current = new MediaRecorder(audioStream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      videoRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          videoChunksRef.current.push(e.data);
        }
      };

      audioRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      videoRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        setRecordedVideo(videoBlob);
      };

      audioRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(audioBlob);
      };
    } catch (err) {
      console.error("미디어 스트림 에러:", err);
    }
  };

  const startRecording = () => {
    videoChunksRef.current = [];
    audioChunksRef.current = [];
    
    videoRecorderRef.current?.start();
    audioRecorderRef.current?.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    videoRecorderRef.current?.stop();
    audioRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const downloadVideo = () => {
    if (recordedVideo) {
      const url = URL.createObjectURL(recordedVideo);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recorded-video-${new Date().getTime()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadAudio = () => {
    if (recordedAudio) {
      const url = URL.createObjectURL(recordedAudio);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recorded-audio-${new Date().getTime()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const analyzeEmotion = async () => {
    if (recordedAudio) {
      try {
        const formData = new FormData();
        formData.append("file", recordedAudio, "recorded-audio.webm");
  
        // 따로 빼놓은 analyzeVideoEmotion 함수를 사용해 감정 분석 요청을 보냅니다.
        const response = await analyzeVideoEmotion(recordedVideo);
        console.log(response)
        console.log(response.most_common_emotion)
  
        if (response && response.most_common_emotion) {
          setAnalysisResult(response.most_common_emotion); // 서버에서 감정 분석 결과를 가져옴
  
          // 감정 분석 결과 페이지로 이동
          navigate("/emotionResult", { state: { analysisResult: response.most_common_emotion }})
        } else {
          console.error("Error: No analysis result returned");
        }
      } catch (error) {
        console.error("Error analyzing emotion:", error);
      }
    }
  };

  useEffect(() => {
    startStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="relative w-full max-w-2xl rounded-lg overflow-hidden bg-gray-100">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full"
        />
      </div>
      
      <div className="flex gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Camera className="w-5 h-5" />
            녹화 시작
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <StopCircle className="w-5 h-5" />
            녹화 중지
          </button>
        )}
        
        {recordedVideo && (
          <button
            onClick={downloadVideo}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Video className="w-5 h-5" />
            비디오 다운로드
          </button>
        )}
        
        {recordedAudio && (
          <button
            onClick={downloadAudio}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Mic className="w-5 h-5" />
            오디오 다운로드
          </button>
        )}

        {recordedAudio && (
          <button
            onClick={analyzeEmotion}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <Smile className="w-5 h-5" />
            감정 분석하기
          </button>
        )}
      </div>

      {/* 감정 분석 결과 출력 */}
      {analysisResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-center">
          <h3 className="text-lg font-semibold">감정 분석 결과:</h3>
          <p>{analysisResult}</p>
        </div>
      )}
    </div>
  );
};

export default SeparateMediaRecorder;
