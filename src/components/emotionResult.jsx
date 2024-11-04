import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ImageIcon, Video, MessageSquare } from 'lucide-react';

const MediaResults = ({ videoResults, textResults, audioUrl, imageUrl }) => {
  const audioRef = useRef(null);

  // 비디오 감정 분석 결과를 위한 이모지 매핑
  const emotionEmoji = {
    '화남': '😠',
    '역겨움': '🤢',
    '두려움': '😨',
    '기쁨': '😊',
    '슬픔': '😢',
    '놀람': '😲',
    '아무생각없음': '😐'
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* 텍스트 감정 분석 결과 */}
      {textResults && (
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center space-x-2">
            <MessageSquare className="w-6 h-6" />
            <CardTitle>텍스트 감정 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>감정 점수</span>
                <span className="text-xl">
                  {textResults.score >= 0.5 ? '😊' : '😢'} {(textResults.score * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${textResults.score * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-500">
                * 0%에 가까울수록 부정적, 100%에 가까울수록 긍정적
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 비디오 감정 분석 결과 */}
      {videoResults && (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Video className="w-6 h-6" />
            <CardTitle>비디오 감정 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>주요 감정</span>
                <span className="text-xl">
                  {emotionEmoji[videoResults.most_common_emotion]} {videoResults.most_common_emotion}
                </span>
              </div>
              <div>
                <h4 className="mb-2 font-medium">감정 분포</h4>
                <div className="space-y-2">
                  {Object.entries(
                    videoResults.emotions.reduce((acc, emotion) => {
                      acc[emotion] = (acc[emotion] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([emotion, count]) => (
                    <div key={emotion} className="flex items-center justify-between">
                      <span>{emotion} {emotionEmoji[emotion]}</span>
                      <span>{((count / videoResults.emotions.length) * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 생성된 이미지 */}
      {imageUrl && (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <ImageIcon className="w-6 h-6" />
            <CardTitle>생성된 이미지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Generated Image" 
                className="object-cover w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 생성된 음악 */}
      {audioUrl && (
        <Card>
          <CardHeader className="flex flex-row items-center space-x-2">
            <Music className="w-6 h-6" />
            <CardTitle>생성된 음악</CardTitle>
          </CardHeader>
          <CardContent>
            <audio 
              ref={audioRef} 
              controls 
              className="w-full"
              src={audioUrl}
            >
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaResults;
