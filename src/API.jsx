import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://192.168.0.206:8000/v1/api",  // 공통 URL 부분 설정
  // baseURL: "http://localhost:3000/v1/api",  // 공통 URL 부분 설정
  headers: {
    "Content-Type": "multipart/form-data"
    // 'Content-Type': 'application/json',
  },
});

export default api;
// 비디오 파일 감정 분석 요청
export const analyzeVideoEmotion = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await api.post("/video-to-senti", formData);
    return response.data;  // { filename, emotions, most_common_emotion }
  } catch (error) {
    console.error("Error analyzing video emotion:", error);
    return null;
  }
};

// 오디오 파일을 텍스트로 변환
export const transcribeAudio = async (file) => {
  const formData = new FormData();
  formData.append("audio", file);

  try {
    const response = await api.post("/audio-to-text", formData);
    return response.data;  // { text }
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return null;
  }
};

// 텍스트 요약 생성
export const createSummary = async (inputText) => {
  const formData = new FormData();
  formData.append("input_text", inputText);

  try {
    const response = await api.post("/text-to-summary", formData);
    return response.data.result;  // 요약된 텍스트를 반환
  } catch (error) {
    console.error("Error creating summary:", error);
    return null;
  }
};

// 이진 감정 분석 요청(긍정, 부정)
export const getBiSentiment = async (query) => {
  const formData = new FormData();
  formData.append("query", query);

  try {
    const response = await api.post("/text-to-sentiment", formData);
    return response.data;  // { label, score }
  } catch (error) {
    console.error("Error in bi-sentiment analysis:", error);
    return null;
  }
};

// 상위 k개의 감정 분석 요청
export const getTopKSentiment = async (query, topK) => {
  const formData = new FormData();
  formData.append("query", query);
  formData.append("top_k", topK);

  try {
    const response = await api.post("/text-to-sentiment", formData);
    return response.data;  // [{ label, score }, ...]
  } catch (error) {
    console.error("Error in top-k sentiment analysis:", error);
    return null;
  }
};

// 이미지 생성
export const generateImage = async (query) => {
  const formData = new FormData();
  formData.append("query", query);

  try {
    const response = await api.post("/text-to-image", formData, {
      responseType: "blob",  // 이미지를 바이너리 형식으로 받아오기 위해 설정
    });
    return URL.createObjectURL(response.data);  // Blob URL 생성
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};

// 명언 생성
export const createText = async (inputText) => {
  const formData = new FormData();
  formData.append("input_text", inputText);

  try {
    const response = await api.post("/text-to-wise-saying", formData);
    return response.data;  // { quote_id, quote, message }
  } catch (error) {
    console.error("Error creating text:", error);
    return null;
  }
};

// 음악 생성
export const createMusicBinary = async (summaryText, length = 512) => {
  const formData = new FormData();
  formData.append("summary_text", summaryText);
  formData.append("length", length);

  try {
    const response = await api.post("/text-to-music", formData, {
      responseType: 'blob',
    });
    return response.data;  // blob으로 반환
  } catch (error) {
    console.error("Error creating music:", error);
    return null;
  }
};
