
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Clock, Upload, CheckCircle, AlertCircle, 
  Printer, GraduationCap, X, BookOpen, Brain, Play, Maximize2, Download
} from 'lucide-react';
import { TestConfig, ExamData, ExamResult } from '../types';
import { GoogleGenAI } from "@google/genai";
import mammoth from 'mammoth';
import { TEST_GENERATOR_PROMPT, TEST_GRADER_PROMPT } from '../constants';
import MarkdownRenderer from './MarkdownRenderer';
import confetti from 'canvas-confetti';

interface TestPrepSystemProps {
  onBack: () => void;
  checkLimit: () => boolean;
  incrementUsage: () => void;
}

const TestPrepSystem: React.FC<TestPrepSystemProps> = ({ 
  onBack,
  checkLimit,
  incrementUsage
}) => {
  const [step, setStep] = useState<'config' | 'generating' | 'preview' | 'countdown' | 'testing' | 'grading' | 'result'>('config');
  
  const [config, setConfig] = useState<TestConfig>({
    gradeLevel: 'Lớp 12',
    examFormat: 'THPT Quốc Gia',
    topics: '',
    duration: 60,
    referenceContent: ''
  });
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(3);
  const [result, setResult] = useState<ExamResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();

    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          setConfig(prev => ({ ...prev, referenceContent: result.value }));
        } catch (err) {
          console.error(err);
          alert("Error reading Word file");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      reader.onload = (event) => {
        setConfig(prev => ({ ...prev, referenceContent: event.target?.result as string }));
      };
      reader.readAsText(file);
    }
  };

  const startGeneration = async () => {
    setStep('generating');
    incrementUsage();

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      alert("⚠️ Lỗi: Chưa cấu hình API Key. Vui lòng liên hệ quản trị viên.");
      setStep('config');
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Yêu cầu tạo đề thi:
        - Trình độ/Lớp: ${config.gradeLevel}
        - Định dạng: ${config.examFormat}
        - Thời gian: ${config.duration} phút
        - Chủ đề ngữ pháp trọng tâm: ${config.topics || "Tổng hợp kiến thức toàn diện"}
        ${config.referenceContent ? `- DỰA TRÊN TÀI LIỆU THAM KHẢO SAU ĐÂY: \n${config.referenceContent.slice(0, 3000)}...` : ""}
        
        Hãy tạo JSON đề thi theo đúng format yêu cầu.
      `;

      // Use Gemini 3 Pro with Thinking Config for sophisticated exam generation
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          systemInstruction: TEST_GENERATOR_PROMPT,
          temperature: 0.5,
          thinkingConfig: { thinkingBudget: 2048 }
        }
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed: ExamData = JSON.parse(jsonMatch[0]);
        setExamData(parsed);
        setTimeLeft(parsed.duration * 60); 
        setStep('preview');
      } else {
        throw new Error("Could not parse exam JSON");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tạo đề thi. Vui lòng thử lại.");
      setStep('config');
    }
  };

  const handleStartExam = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => console.warn(err));
    }
    setCountdown(3);
    setStep('countdown');
  };

  const handleExitFullScreen = () => {
     if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.warn(err));
     }
  };

  useEffect(() => {
    if (step === 'countdown') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setStep('testing');
            return 3;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'testing') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleAnswerChange = (qId: number, value: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const submitExam = async () => {
    handleExitFullScreen();
    setStep('grading');
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Dữ liệu bài làm: ${JSON.stringify({ examData, userAnswers })}. Hãy chấm điểm theo đúng format JSON yêu cầu.`;

      // Use Gemini 3 Pro for grading
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: { parts: [{ text: prompt }] },
        config: {
          systemInstruction: TEST_GRADER_PROMPT,
          temperature: 0.2,
          thinkingConfig: { thinkingBudget: 1024 }
        }
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed: ExamResult = JSON.parse(jsonMatch[0]);
        setResult(parsed);
        setStep('result');
        if (parsed.score >= 8) {
           confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
      } else {
        throw new Error("Grading JSON failed");
      }

    } catch (e) {
      console.error(e);
      alert("Lỗi khi chấm bài. Đang hiển thị kết quả thô.");
      setStep('result'); 
    }
  };

  const handleExportWord = () => {
    if (!examData) return;
    const content = document.getElementById('exam-paper-content')?.innerHTML;
    const styles = `
      <style>
        @page { size: 21cm 29.7cm; margin: 2cm; mso-page-orientation: portrait; }
        body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.3; text-align: justify; }
        .section-title { font-weight: bold; font-size: 14pt; margin-top: 15pt; margin-bottom: 5pt; text-transform: uppercase; }
        .question-container { margin-bottom: 12pt; page-break-inside: avoid; }
      </style>
    `;
    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Exam</title>${styles}</head><body><div class="Section1">${content}</div></body></html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${examData.title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => window.print();

  if (step === 'config') {
    return (
      <div className="h-full bg-slate-50 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-4 md:p-8 animate-fade-in my-auto">
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <div className="bg-indigo-600 p-3 rounded-xl text-white shadow-lg shrink-0">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Hệ Thống Luyện Thi VIP Pro</h1>
              <p className="text-gray-500">Thiết kế đề thi chuẩn 99% - Phân tích chuyên sâu (Powered by Gemini 3.0)</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Trình độ / Lớp</label>
                 <select value={config.gradeLevel} onChange={(e) => setConfig({...config, gradeLevel: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg">
                   <option>Lớp 9 (Luyện thi vào 10)</option>
                   <option>Lớp 12 (Tốt nghiệp THPT)</option>
                   <option>Đại Học</option>
                   <option>IELTS Foundation</option>
                   <option>IELTS Advanced</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Định dạng đề thi</label>
                 <input type="text" value={config.examFormat} onChange={(e) => setConfig({...config, examFormat: e.target.value})} placeholder="VD: THPT Quốc Gia 2024" className="w-full p-3 border border-gray-200 rounded-lg" />
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Thời gian (Phút)</label>
                 <input type="number" value={config.duration} onChange={(e) => setConfig({...config, duration: parseInt(e.target.value) || 60})} className="w-full p-3 border border-gray-200 rounded-lg" />
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">Chủ đề trọng tâm</label>
                 <input type="text" value={config.topics} onChange={(e) => setConfig({...config, topics: e.target.value})} placeholder="VD: Ngữ âm, Đọc hiểu..." className="w-full p-3 border border-gray-200 rounded-lg" />
               </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
               <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg text-blue-600 shrink-0"><Upload className="w-6 h-6" /></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">Tải lên đề thi mẫu (Tùy chọn)</h3>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".doc,.docx,.txt" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm">
                      {uploadedFileName ? `Đã chọn: ${uploadedFileName}` : "Chọn File từ máy tính"}
                    </button>
                  </div>
               </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button onClick={onBack} className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-xl">Hủy bỏ</button>
              <button onClick={startGeneration} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
                <Brain className="w-5 h-5" /> Thiết Kế Đề Thi Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'generating' || step === 'grading') {
    return (
       <div className="h-full bg-slate-50 flex flex-col items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full animate-fade-in">
             <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   {step === 'generating' ? <BookOpen className="w-8 h-8 text-indigo-600" /> : <CheckCircle className="w-8 h-8 text-green-600" />}
                </div>
             </div>
             <h2 className="text-xl font-bold text-gray-800 mb-2">
               {step === 'generating' ? 'AI Đang Thiết Kế Đề Thi...' : 'AI Đang Chấm Bài...'}
             </h2>
             <p className="text-gray-500 text-sm">Vui lòng đợi trong giây lát, hệ thống đang xử lý với tốc độ cao.</p>
          </div>
       </div>
    );
  }

  if (step === 'countdown') {
    return (
      <div className="fixed inset-0 z-50 bg-indigo-900 flex items-center justify-center">
        <div className="text-white text-9xl font-black animate-bounce">{countdown}</div>
      </div>
    );
  }

  const isPreviewMode = step === 'preview';
  const isTestingMode = step === 'testing';
  const isResultMode = step === 'result';

  return (
    <div className={`h-full bg-gray-100 overflow-y-auto flex flex-col items-center relative print:bg-white print:h-auto print:overflow-visible scroll-smooth ${isTestingMode ? 'bg-slate-800' : ''}`}>
      {isPreviewMode && (
         <div className="sticky top-0 z-40 w-full bg-white border-b px-6 py-4 shadow-sm flex justify-between items-center animate-fade-in">
            <div className="flex items-center gap-3">
               <div className="bg-indigo-100 p-2 rounded-lg"><FileText className="w-6 h-6 text-indigo-600" /></div>
               <div><h2 className="font-bold text-gray-800">Xem Trước Đề Thi</h2></div>
            </div>
            <div className="flex gap-2">
               <button onClick={handleExportWord} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm flex gap-2"><Download className="w-4 h-4" /> Word</button>
               <button onClick={handlePrintPDF} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm flex gap-2"><Printer className="w-4 h-4" /> PDF</button>
               <button onClick={handleStartExam} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg flex gap-2"><Play className="w-4 h-4" /> Làm Bài</button>
            </div>
         </div>
      )}
      {!isPreviewMode && (
        <div className="sticky top-0 z-40 w-full bg-slate-900 text-white px-6 py-3 shadow-md flex justify-between items-center print:hidden">
           <div className="flex items-center gap-4">
              <span className="font-bold text-lg truncate max-w-xs">{examData?.title}</span>
              {isTestingMode && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-sm ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}>
                  <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
                </div>
              )}
           </div>
           <div className="flex gap-3">
              {isResultMode && (
                <>
                   <button onClick={handleExportWord} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"><FileText className="w-4 h-4 inline mr-1" /> Word</button>
                   <button onClick={onBack} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium border border-gray-600"><X className="w-4 h-4 inline mr-1" /> Thoát</button>
                </>
              )}
              {isTestingMode && (
                 <button onClick={submitExam} className="bg-green-600 hover:bg-green-700 text-white px-6 py-1.5 rounded-lg font-bold shadow-lg flex items-center gap-2 text-sm"><CheckCircle className="w-4 h-4" /> Nộp Bài</button>
              )}
           </div>
        </div>
      )}

      {isResultMode && result && (
        <div className="w-full max-w-5xl mt-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-600 p-6 print:hidden animate-fade-in">
           <div className="flex gap-6">
              <div className="text-center">
                 <div className="inline-block p-4 rounded-full bg-indigo-50 border-4 border-indigo-100 mb-2">
                    <span className="text-4xl font-black text-indigo-700">{result.score}</span>
                    <span className="text-sm text-gray-500">/10</span>
                 </div>
                 <p className="font-bold text-gray-800">{result.correctCount}/{result.totalQuestions} Câu đúng</p>
              </div>
              <div className="flex-1 space-y-4">
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-1">Lời phê của giáo viên:</h4>
                    <p className="text-gray-700 italic">"{result.teacherComment}"</p>
                 </div>
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 mb-1">Kế hoạch cải thiện:</h4>
                    <p className="text-yellow-900 text-sm">{result.improvementPlan}</p>
                 </div>
              </div>
           </div>
           <div className="mt-6 border-t pt-6">
              <h3 className="font-bold text-lg mb-4">Phân tích chi tiết:</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-h-60 overflow-y-auto">
                 <MarkdownRenderer content={result.detailedAnalysis} />
              </div>
           </div>
        </div>
      )}

      <div id="exam-paper-content" className={`w-full max-w-5xl mx-auto bg-white shadow-md my-8 p-14 text-gray-900 leading-relaxed font-serif text-justify print:shadow-none print:m-0 print:w-full print:max-w-none print:p-[2cm] ${isPreviewMode ? 'pointer-events-none select-none' : ''}`}>
        <div className="border-b-2 border-black pb-4 mb-8 text-center">
           <h1 className="text-2xl font-bold uppercase mb-2">{examData?.title}</h1>
           <p className="italic font-medium text-gray-700">{examData?.subtitle}</p>
        </div>
        {examData?.sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-10 section-container break-inside-avoid-page">
            <h2 className="font-bold text-lg mb-4 uppercase text-black border-b border-gray-300 pb-1 section-title">{section.title}</h2>
            {section.description && <p className="italic mb-4 text-gray-600">{section.description}</p>}
            {section.passageContent && (
               <div className="reading-box bg-gray-50 border border-gray-300 p-6 mb-6 text-justify leading-relaxed print:bg-transparent print:border-gray-800">
                  <MarkdownRenderer content={section.passageContent} />
               </div>
            )}
            <div className="space-y-6">
              {section.questions.map((q, qIdx) => {
                const questionNumber = section.questions.reduce((acc, curr, currIdx) => currIdx < qIdx ? acc + 1 : acc, 0) + examData.sections.slice(0, sIdx).reduce((acc, s) => acc + s.questions.length, 0) + 1;
                const userAnswer = userAnswers[questionNumber];
                const isCorrect = isResultMode ? userAnswer === q.correctAnswer : null;
                return (
                  <div key={q.id} className="relative group pl-1 question-container break-inside-avoid">
                    {isResultMode && (
                       <div className="absolute -left-8 top-1 print:hidden">
                          {isCorrect ? <CheckCircle className="w-6 h-6 text-green-600" /> : <X className="w-6 h-6 text-red-600" />}
                       </div>
                    )}
                    <div className="flex gap-2 mb-3 items-baseline">
                       <span className="font-bold whitespace-nowrap text-lg">Q.{questionNumber}:</span>
                       <div className="flex-1 text-lg"><MarkdownRenderer content={q.content} /></div>
                    </div>
                    {q.type === 'multiple_choice' && q.options && (
                      <div className="options-grid grid grid-cols-1 md:grid-cols-4 gap-4 ml-2 print:grid-cols-4 print:gap-2">
                        {q.options.map((opt, oIdx) => {
                          const key = String.fromCharCode(65 + oIdx); 
                          const isSelected = userAnswer === key;
                          const isKeyCorrect = q.correctAnswer === key;
                          let className = "flex items-start gap-2 p-1.5 rounded transition-all cursor-pointer ";
                          if (!isResultMode) className += isSelected ? "bg-indigo-50 font-bold text-indigo-900 underline" : "hover:bg-gray-50";
                          else {
                             if (isKeyCorrect) className += "bg-green-100 text-green-900 font-bold ";
                             else if (isSelected && !isKeyCorrect) className += "bg-red-100 text-red-900 line-through ";
                             else className += "opacity-60 ";
                          }
                          return (
                            <div key={oIdx} onClick={() => !isResultMode && !isPreviewMode && handleAnswerChange(questionNumber, key)} className={className}>
                              <span className={`w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-xs font-bold shrink-0 ${isSelected && !isResultMode ? 'bg-indigo-600 text-white' : ''}`}>{key}</span>
                              <span className="pt-0.5">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {q.type === 'essay' && (
                       <div className="mt-3 ml-4">
                          <textarea disabled={isResultMode || isPreviewMode} value={userAnswer || ''} onChange={(e) => handleAnswerChange(questionNumber, e.target.value)} className="w-full bg-transparent outline-none min-h-[120px] p-4 text-base leading-loose resize-y print:border-gray-800" placeholder="Write answer..." style={{backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)', lineHeight: '32px', paddingTop: '8px'}} />
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="mt-16 text-center font-bold text-black border-t-2 border-black pt-6 pb-6">--- THE END ---</div>
      </div>
    </div>
  );
};

export default TestPrepSystem;
