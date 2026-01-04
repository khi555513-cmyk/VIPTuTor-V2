
import React, { useState, useEffect } from 'react';
import { GameData, AppNotification } from '../types';
import { CheckCircle2, XCircle, Trophy, RefreshCw, ArrowRight, Star, AlertCircle, Lightbulb, Play, Clock, ArrowLeft, Maximize2 } from 'lucide-react';

interface MiniGameProps {
  data: GameData;
  onRequestFullScreen?: (data: GameData) => void;
  onPlayLater?: (data: GameData) => void;
  isFullScreenMode?: boolean;
  onCloseFullScreen?: () => void;
}

declare global {
  interface Window {
    confetti: any;
  }
}

const MiniGame: React.FC<MiniGameProps> = ({ 
  data, 
  onRequestFullScreen, 
  onPlayLater, 
  isFullScreenMode = false,
  onCloseFullScreen
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState<{qIndex: number, userAns: number, isCorrect: boolean}[]>([]);
  
  // States for the "Invite" logic (only used when NOT in full screen)
  const [status, setStatus] = useState<'invite' | 'saved' | 'playing'>('invite');

  // If in full screen, we start immediately
  useEffect(() => {
    if (isFullScreenMode) {
      setStatus('playing');
    }
  }, [isFullScreenMode]);

  const currentQuestion = data.questions[currentQIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    
    const isCorrect = index === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
      if (window.confetti) {
        window.confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#4ade80', '#22c55e']
        });
      }
    }

    setHistory(prev => [...prev, {
      qIndex: currentQIndex,
      userAns: index,
      isCorrect: isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentQIndex < data.questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setIsFinished(true);
    if (window.confetti) {
      const duration = 3000;
      const end = Date.now() + duration;

      (function frame() {
        window.confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
        window.confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  };

  const getEvaluation = () => {
    const percentage = (score / data.questions.length) * 100;
    if (percentage === 100) return { text: "Xuất sắc! Bạn là thiên tài.", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 80) return { text: "Rất tốt! Kiến thức vững vàng.", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 50) return { text: "Khá ổn. Cố gắng thêm chút nữa!", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Cần luyện tập thêm. Đừng bỏ cuộc!", color: "text-red-600", bg: "bg-red-50" };
  };

  // --- RENDER LOGIC ---

  // 1. Invite Screen (Default inside chat)
  if (!isFullScreenMode && status === 'invite') {
    return (
      <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-4 md:p-5 max-w-md animate-fade-in">
         <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-md">
               <Trophy className="w-6 h-6" />
            </div>
            <div>
               <h3 className="font-bold text-gray-800 text-lg">Game đã sẵn sàng!</h3>
               <p className="text-xs text-gray-500">{data.title} • {data.difficulty}</p>
            </div>
         </div>
         <p className="text-sm text-gray-600 mb-4">
            Bạn có muốn tham gia thử thách này ngay bây giờ không?
         </p>
         <div className="flex gap-2">
            <button 
              onClick={() => {
                if(onRequestFullScreen) onRequestFullScreen(data);
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95"
            >
               <Play className="w-4 h-4 fill-current" /> Chơi ngay
            </button>
            <button 
              onClick={() => {
                setStatus('saved');
                if(onPlayLater) onPlayLater(data);
              }}
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all"
            >
               <Clock className="w-4 h-4" /> Để sau
            </button>
         </div>
      </div>
    );
  }

  // 2. Saved State (Inside chat)
  if (!isFullScreenMode && status === 'saved') {
    return (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 max-w-md flex items-center gap-3 opacity-80">
         <CheckCircle2 className="w-5 h-5 text-green-600" />
         <div>
            <p className="text-sm font-medium text-gray-800">Đã lưu vào Hộp thư thông báo</p>
            <p className="text-xs text-gray-500">Bạn có thể mở lại game bất cứ lúc nào.</p>
         </div>
      </div>
    );
  }

  // 3. Result Screen (Full Screen & Embedded Playing)
  if (isFinished) {
    const evaluation = getEvaluation();
    return (
      <div className={`w-full mx-auto bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden animate-fade-in flex flex-col ${isFullScreenMode ? 'h-full max-w-4xl shadow-2xl my-0 md:my-8' : 'max-w-2xl'}`}>
        
        {/* Full Screen Header */}
        {isFullScreenMode && (
          <div className="absolute top-4 left-4 z-50">
             <button onClick={onCloseFullScreen} className="bg-white/90 backdrop-blur text-gray-700 px-4 py-2 rounded-full shadow-md font-medium flex items-center gap-2 hover:bg-gray-100 transition-all text-sm">
                <ArrowLeft className="w-4 h-4" /> Trở về
             </button>
          </div>
        )}

        <div className="bg-indigo-600 p-6 md:p-8 text-center text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <Trophy className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-yellow-300 drop-shadow-md" />
          <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Game Over!</h2>
          <p className="opacity-90 text-sm md:text-base">{data.title}</p>
        </div>

        <div className="p-4 md:p-6 flex-1 overflow-y-auto">
          {/* Score Card */}
          <div className="flex flex-col items-center justify-center -mt-12 md:-mt-16 mb-6 md:mb-8 relative z-10">
            <div className="bg-white p-2 rounded-full shadow-lg">
               <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 text-2xl md:text-3xl font-bold bg-white ${score === data.questions.length ? 'border-green-500 text-green-600' : 'border-indigo-500 text-indigo-600'}`}>
                 {score}/{data.questions.length}
               </div>
            </div>
            <div className={`mt-4 px-6 py-2 rounded-full font-medium text-sm md:text-base ${evaluation.bg} ${evaluation.color}`}>
              {evaluation.text}
            </div>
          </div>

          {/* Detailed Review */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2 text-base md:text-lg">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Chi tiết & Đánh giá
            </h3>
            
            <div className="space-y-4">
              {data.questions.map((q, idx) => {
                const historyItem = history.find(h => h.qIndex === idx);
                const userChoice = historyItem?.userAns;
                const isCorrect = historyItem?.isCorrect;

                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30'}`}>
                    <div className="flex gap-3">
                      <div className="mt-1 shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm mb-2">
                          <span className="text-gray-500 mr-2">Câu {idx + 1}:</span>
                          {q.question}
                        </p>
                        
                        {!isCorrect && userChoice !== undefined && (
                          <p className="text-xs text-red-600 mb-1">
                            ❌ Bạn chọn: {q.options[userChoice]}
                          </p>
                        )}
                        <p className="text-xs text-green-700 font-medium mb-2">
                          ✅ Đáp án: {q.options[q.correctAnswer]}
                        </p>
                        
                        <div className="text-xs bg-white p-3 rounded-lg border border-gray-200 text-gray-600 italic">
                          💡 {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. Playing Screen
  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden animate-fade-in flex flex-col ${isFullScreenMode ? 'h-full w-full max-w-4xl mx-auto my-0 md:my-8 shadow-2xl' : 'w-full max-w-xl mx-auto my-4'}`}>
      
      {/* Full Screen Header */}
      {isFullScreenMode && (
         <div className="absolute top-4 left-4 z-50">
            {/* We hide this during questions to focus, or keep it small */}
            <button onClick={onCloseFullScreen} className="bg-white/50 hover:bg-white text-gray-800 p-2 rounded-full backdrop-blur transition-all shadow-sm">
               <ArrowLeft className="w-6 h-6" />
            </button>
         </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex justify-between items-center flex-shrink-0">
        <div className={isFullScreenMode ? 'ml-12' : ''}>
           <h3 className="font-bold text-base md:text-lg line-clamp-1">{data.title}</h3>
           <p className="text-xs opacity-80 flex items-center gap-1">
             <Star className="w-3 h-3" /> {data.difficulty}
           </p>
        </div>
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs md:text-sm backdrop-blur-sm shrink-0">
           <span>Q: {currentQIndex + 1}/{data.questions.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1.5 flex-shrink-0">
        <div 
          className="bg-indigo-500 h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${((currentQIndex + 1) / data.questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="p-4 md:p-6 flex-1 overflow-y-auto flex flex-col justify-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Question */}
          <div className="mb-6 md:mb-8">
            <h4 className={`${isFullScreenMode ? 'text-xl md:text-2xl' : 'text-lg'} font-semibold text-gray-800 leading-relaxed`}>
              {currentQuestion.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-4">
            {currentQuestion.options.map((opt, idx) => {
              let optionClass = "border-gray-200 hover:border-indigo-300 hover:bg-gray-50";
              let icon = null;

              if (isAnswered) {
                if (idx === currentQuestion.correctAnswer) {
                  optionClass = "border-green-500 bg-green-50 text-green-700 font-medium ring-1 ring-green-500";
                  icon = <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />;
                } else if (idx === selectedOption) {
                  optionClass = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                  icon = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
                } else {
                  optionClass = "border-gray-200 opacity-50";
                }
              } else if (selectedOption === idx) {
                optionClass = "border-indigo-500 bg-indigo-50 text-indigo-700";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${optionClass} ${isFullScreenMode ? 'text-base md:text-lg py-4 md:py-5' : 'text-sm'}`}
                >
                  <span className="mr-2">{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Feedback Area */}
          {isAnswered && (
            <div className="mt-6 md:mt-8 animate-fade-in">
              <div className={`p-4 rounded-lg mb-4 text-sm ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <p className="font-bold flex items-center gap-2 mb-1 text-base">
                    {selectedOption === currentQuestion.correctAnswer ? 'Chính xác! 🎉' : 'Chưa đúng rồi 😅'}
                  </p>
                  <p className="opacity-90">{currentQuestion.explanation}</p>
              </div>
              
              <button 
                onClick={handleNext}
                className="w-full py-3.5 md:py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all text-base md:text-lg active:scale-[0.98]"
              >
                {currentQIndex < data.questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'} 
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniGame;
