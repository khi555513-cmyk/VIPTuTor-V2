
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
import { getApiKey } from '../services/geminiService';

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
  // --- States ---
  const [step, setStep] = useState<'config' | 'generating' | 'preview' | 'countdown' | 'testing' | 'grading' | 'result'>('config');
  
  // Config State
  const [config, setConfig] = useState<TestConfig>({
    gradeLevel: 'Lớp 12',
    examFormat: 'THPT Quốc Gia',
    topics: '',
    duration: 60,
    referenceContent: ''
  });
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // Exam Data State
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(3);
  
  // Result State
  const [result, setResult] = useState<ExamResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers: Configuration ---
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
    // CHECK LIMIT
    if (!checkLimit()) {
      alert("🔒 TÍNH NĂNG ĐÃ BỊ KHÓA!\n\nBạn đã hết lượt tạo đề thi hôm nay. Tính năng này đã bị vô hiệu hóa.\n\nVui lòng nâng cấp gói cước để tiếp tục.");
      return;
    }

    setStep('generating');
    incrementUsage(); // Deduct usage

    const apiKey = getApiKey();
    if (!apiKey) {
      alert("⚠️ Lỗi: Chưa cấu hình API Key. Vui lòng kiểm tra file .env hoặc cấu hình key.");
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
        ${config.referenceContent ? `- DỰA TRÊN TÀI LIỆU THAM KHẢO SAU ĐÂY (Hãy bắt chước cấu trúc và tạo các phần tương tự): \n${config.referenceContent.slice(0, 3000)}...` : ""}
        
        Hãy tạo JSON đề thi theo đúng format yêu cầu. Chú ý tạo đầy đủ các phần: Phonetics, Grammar, Reading (có passageContent), Writing.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: { parts: [{ text: prompt }] },
        config: {
          systemInstruction: TEST_GENERATOR_PROMPT,
          temperature: 0.5,
        }
      });

      const text = response.text || "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed: ExamData = JSON.parse(jsonMatch[0]);
        if (!parsed.sections || !Array.isArray(parsed.sections)) {
           throw new Error("Invalid Exam JSON structure");
        }
        setExamData(parsed);
        setTimeLeft(parsed.duration * 60); 
        
        // Go to Preview Step
        setStep('preview');
      } else {
        throw new Error("Could not parse exam JSON");
      }
    } catch (e) {
      console.error(e);
      alert("Lỗi khi tạo đề thi. Vui lòng thử lại chi tiết hơn.");
      setStep('config');
    }
  };

  const handleStartExam = () => {
    // Trigger Fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.warn("Fullscreen request denied:", err);
      });
    }

    setCountdown(3);
    setStep('countdown');
  };

  const handleExitFullScreen = () => {
     if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.warn(err));
     }
  };

  // --- Handlers: Countdown & Timer ---
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

  // --- Handlers: Taking Test ---
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

  // --- Handlers: Grading ---
  const submitExam = async () => {
    // Exit full screen when submitting
    handleExitFullScreen();

    setStep('grading');
    const apiKey = getApiKey();
    if (!apiKey) return;

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      const gradingPayload = {
        examData: examData,
        userAnswers: userAnswers
      };

      const prompt = `
        Dữ liệu bài làm: ${JSON.stringify(gradingPayload)}
        
        Hãy chấm điểm theo đúng format JSON yêu cầu.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash', 
        contents: { parts: [{ text: prompt }] },
        config: {
          systemInstruction: TEST_GRADER_PROMPT,
          temperature: 0.2,
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

  // --- Handlers: Export ---
  const handleExportWord = () => {
    if (!examData) return;
    
    const content = document.getElementById('exam-paper-content')?.innerHTML;
    // Add specific styles for Word to ensure A4 layout
    const styles = `
      <style>
        @page {
          size: 21cm 29.7cm;
          margin: 2cm 2cm 2cm 2cm;
          mso-page-orientation: portrait;
        }
        body { 
          font-family: 'Times New Roman', serif; 
          font-size: 12pt;
          line-height: 1.3;
          text-align: justify;
        }
        .section-title { font-weight: bold; font-size: 14pt; margin-top: 15pt; margin-bottom: 5pt; text-transform: uppercase; }
        .question-container { margin-bottom: 12pt; page-break-inside: avoid; }
        .reading-box { 
            background-color: #f9fafb; 
            border: 1px solid #e5e7eb; 
            padding: 15pt; 
            margin-bottom: 15pt; 
            text-align: justify;
        }
        .options-grid { margin-left: 20pt; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; }
      </style>
    `;
    
    const preHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Exam</title>${styles}</head><body><div class="Section1">`;
    const postHtml = "</div></body></html>";
    const html = preHtml + content + postHtml;

    const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    
    const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${examData.title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
     window.print();
  };


  // --- Render Steps ---

  if (step === 'config') {
    return (
      <div className="h-full bg-slate-50 overflow-y-auto p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-4 md:p-8 animate-fade-in my-auto">
          <div className="flex items-center gap-4 mb-6 md:mb-8 border-b pb-4 md:pb-6">
            <div className="bg-indigo-600 p-3 md:p-4 rounded-xl text-white shadow-lg shrink-0">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">Hệ Thống Luyện Thi VIP Pro</h1>
              <p className="text-gray-500 text-sm md:text-base">Thiết kế đề thi chuẩn 99% - Phân tích chuyên sâu</p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            {/* Grid Layout for Forms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Trình độ / Lớp</label>
                 <select 
                   value={config.gradeLevel} 
                   onChange={(e) => setConfig({...config, gradeLevel: e.target.value})}
                   className="w-full p-2.5 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
                 >
                   <option>Lớp 9 (Luyện thi vào 10)</option>
                   <option>Lớp 12 (Tốt nghiệp THPT)</option>
                   <option>Đại Học</option>
                   <option>IELTS Foundation</option>
                   <option>IELTS Advanced</option>
                   <option>TOEIC</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Định dạng đề thi</label>
                 <input 
                   type="text" 
                   value={config.examFormat}
                   onChange={(e) => setConfig({...config, examFormat: e.target.value})}
                   placeholder="VD: THPT Quốc Gia 2024, IELTS Reading..."
                   className="w-full p-2.5 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Thời gian làm bài (Phút)</label>
                 <div className="relative">
                    <Clock className="absolute left-3 top-3 md:top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="number" 
                      value={config.duration}
                      onChange={(e) => setConfig({...config, duration: parseInt(e.target.value) || 60})}
                      className="w-full pl-10 p-2.5 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                 </div>
               </div>
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Nội dung / Chủ đề trọng tâm</label>
                 <input 
                   type="text" 
                   value={config.topics}
                   onChange={(e) => setConfig({...config, topics: e.target.value})}
                   placeholder="VD: Tổng hợp, Ngữ âm, Đọc hiểu..."
                   className="w-full p-2.5 md:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                 />
               </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-6">
               <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg text-blue-600 shrink-0">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-blue-900 mb-1">Tải lên đề thi mẫu (Tùy chọn)</h3>
                    <p className="text-sm text-blue-700 mb-4">
                      Hệ thống sẽ phân tích cấu trúc file Word/PDF của bạn để tạo ra đề thi tương tự.
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".doc,.docx,.txt"
                      className="hidden" 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full md:w-auto px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm truncate"
                    >
                      {uploadedFileName ? `Đã chọn: ${uploadedFileName}` : "Chọn File từ máy tính"}
                    </button>
                  </div>
               </div>
            </div>

            <div className="pt-4 flex flex-col md:flex-row gap-3 md:gap-4">
              <button 
                onClick={onBack}
                className="w-full md:w-auto px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors order-2 md:order-1"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={startGeneration}
                className="w-full md:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 order-1 md:order-2"
              >
                <Brain className="w-5 h-5" />
                Thiết Kế Đề Thi Ngay
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
             <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   {step === 'generating' ? <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" /> : <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600" />}
                </div>
             </div>
             <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
               {step === 'generating' ? 'Đang Thiết Kế Đề Thi...' : 'AI Đang Chấm Bài...'}
             </h2>
             <p className="text-gray-500 text-sm">
               {step === 'generating' ? 'Hệ thống đang phân tích cấu trúc và soạn câu hỏi chuẩn A4.' : 'Đang phân tích đáp án và viết lời phê chi tiết.'}
             </p>
             <div className="mt-6 w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 animate-progress"></div>
             </div>
          </div>
       </div>
    );
  }

  if (step === 'countdown') {
    return (
      <div className="fixed inset-0 z-50 bg-indigo-900 flex items-center justify-center">
        <div className="text-white text-8xl md:text-9xl font-black animate-bounce">
          {countdown}
        </div>
      </div>
    );
  }

  // --- EXAM PAPER VIEW (Preview, Testing & Result) ---
  const isPreviewMode = step === 'preview';
  const isTestingMode = step === 'testing';
  const isResultMode = step === 'result';

  return (
    <div className={`h-full bg-gray-100 overflow-y-auto flex flex-col items-center relative print:bg-white print:h-auto print:overflow-visible scroll-smooth ${isTestingMode ? 'bg-slate-800' : ''}`}>
      
      {/* 1. PREVIEW HEADER */}
      {isPreviewMode && (
         <div className="sticky top-0 z-40 w-full bg-white border-b px-3 md:px-6 py-3 md:py-4 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-3 w-full md:w-auto">
               <div className="bg-indigo-100 p-2 rounded-lg shrink-0">
                  <FileText className="w-6 h-6 text-indigo-600" />
               </div>
               <div>
                  <h2 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">Xem Trước Đề Thi</h2>
                  <p className="text-xs text-gray-500 hidden sm:block">Kiểm tra đề trước khi làm bài.</p>
               </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
               <button onClick={handleExportWord} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-medium transition-colors text-sm whitespace-nowrap">
                  <Download className="w-4 h-4" /> Word
               </button>
               <button onClick={handlePrintPDF} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors text-sm whitespace-nowrap">
                  <Printer className="w-4 h-4" /> PDF
               </button>
               <button 
                 onClick={handleStartExam}
                 className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all hover:scale-105 animate-pulse text-sm whitespace-nowrap"
               >
                  <Play className="w-4 h-4 fill-white" /> Làm Bài
               </button>
            </div>
         </div>
      )}

      {/* 2. TESTING HEADER (Sticky Timer) */}
      {!isPreviewMode && (
        <div className="sticky top-0 z-40 w-full bg-slate-900 text-white px-3 md:px-6 py-2 md:py-3 shadow-md flex justify-between items-center print:hidden">
           <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
              <span className="font-bold text-sm md:text-lg truncate max-w-[150px] md:max-w-none">{examData?.title}</span>
              
              {isTestingMode && (
                <div className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-full font-mono font-bold text-xs md:text-sm shrink-0 ${timeLeft < 60 ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}>
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  {formatTime(timeLeft)}
                </div>
              )}
           </div>
           
           <div className="flex gap-1 md:gap-3 shrink-0">
              {isResultMode && (
                <>
                   <button onClick={handleExportWord} className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs md:text-sm font-medium transition-colors">
                     <FileText className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden md:inline">Word</span>
                   </button>
                   <button onClick={handlePrintPDF} className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs md:text-sm font-medium transition-colors">
                     <Printer className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden md:inline">Print</span>
                   </button>
                   <button onClick={onBack} className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs md:text-sm font-medium transition-colors border border-gray-600">
                     <X className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden md:inline">Thoát</span>
                   </button>
                </>
              )}
              {isTestingMode && (
                 <div className="flex items-center gap-2">
                   <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 mr-2">
                      <Maximize2 className="w-3 h-3" /> Full Screen
                   </div>
                   <button 
                     onClick={submitExam}
                     className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-6 py-1.5 rounded-lg font-bold shadow-lg transition-colors flex items-center gap-2 text-xs md:text-sm"
                   >
                     <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden md:inline">Nộp Bài</span><span className="md:hidden">Nộp</span>
                   </button>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* Result Overview Panel */}
      {isResultMode && result && (
        <div className="w-full max-w-5xl mt-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-600 p-4 md:p-6 print:hidden animate-fade-in mx-auto md:mx-4">
           <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 text-center md:text-left">
                 <div className="inline-block p-4 rounded-full bg-indigo-50 border-4 border-indigo-100 mb-2">
                    <span className="text-4xl font-black text-indigo-700">{result.score}</span>
                    <span className="text-sm text-gray-500">/10</span>
                 </div>
                 <p className="font-bold text-gray-800">{result.correctCount}/{result.totalQuestions} Câu đúng</p>
              </div>
              <div className="flex-1 space-y-4">
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-1">
                      <GraduationCap className="w-5 h-5 text-indigo-600" /> Lời phê của giáo viên:
                    </h4>
                    <p className="text-gray-700 italic">"{result.teacherComment}"</p>
                 </div>
                 <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-1">
                      <AlertCircle className="w-5 h-5" /> Kế hoạch cải thiện:
                    </h4>
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

      {/* 
          EXAM PAPER CONTENT 
          Styled to look like a real document: Times New Roman, Justified, Proper Spacing 
          Mobile Responsive: Reduced padding (p-4) on small screens, p-14 on desktop.
      */}
      <div 
        id="exam-paper-content" 
        className={`w-full max-w-5xl mx-auto bg-white shadow-sm md:shadow-md my-2 md:my-8 p-4 md:p-14 text-gray-900 leading-relaxed font-serif text-justify print:shadow-none print:m-0 print:w-full print:max-w-none print:p-[2cm] box-border ${isPreviewMode ? 'pointer-events-none select-none' : ''}`}
      >
        
        {/* Paper Header */}
        <div className="border-b-2 border-black pb-4 mb-6 md:mb-8 text-center">
           <h1 className="text-xl md:text-2xl font-bold uppercase mb-2 leading-tight tracking-wide">{examData?.title}</h1>
           <p className="italic font-medium text-gray-700 text-sm md:text-lg">{examData?.subtitle}</p>
        </div>

        {/* Sections */}
        {examData?.sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-8 md:mb-10 section-container break-inside-avoid-page">
            <h2 className="font-bold text-base md:text-lg mb-4 uppercase text-black border-b border-gray-300 pb-1 section-title">
              {section.title}
            </h2>
            
            {section.description && (
               <p className="italic text-sm md:text-base mb-4 text-gray-600 px-1 md:px-2">{section.description}</p>
            )}

            {/* Reading Passage Box (Styled & Framed) */}
            {section.passageContent && (
               <div className="reading-box bg-gray-50 border border-gray-300 p-4 md:p-6 mb-6 text-justify text-sm md:text-base leading-relaxed print:bg-transparent print:border print:border-gray-800">
                  <MarkdownRenderer content={section.passageContent} />
               </div>
            )}

            <div className="space-y-6">
              {section.questions.map((q, qIdx) => {
                const questionNumber = section.questions.reduce((acc, curr, currIdx) => 
                   currIdx < qIdx ? acc + 1 : acc, 0) + 
                   examData.sections.slice(0, sIdx).reduce((acc, s) => acc + s.questions.length, 0) + 1;

                const userAnswer = userAnswers[questionNumber];
                const isCorrect = isResultMode ? userAnswer === q.correctAnswer : null;

                return (
                  <div key={q.id} className="relative group pl-1 question-container break-inside-avoid">
                    {/* Result Indicator */}
                    {isResultMode && (
                       <div className="absolute -left-4 md:-left-8 top-1 print:hidden">
                          {isCorrect ? (
                             <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
                          ) : (
                             <X className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
                          )}
                       </div>
                    )}

                    <div className="flex gap-2 mb-2 md:mb-3 items-baseline">
                       <span className="font-bold whitespace-nowrap text-base md:text-lg">Q.{questionNumber}:</span>
                       <div className="flex-1 text-base md:text-lg">
                         <MarkdownRenderer content={q.content} />
                       </div>
                    </div>

                    {q.type === 'multiple_choice' && q.options && (
                      <div className="options-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-2 md:gap-y-3 ml-1 md:ml-2 print:grid-cols-4 print:gap-2">
                        {q.options.map((opt, oIdx) => {
                          const key = String.fromCharCode(65 + oIdx); 
                          const isSelected = userAnswer === key;
                          const isKeyCorrect = q.correctAnswer === key;
                          
                          let className = "flex items-start gap-2 p-1.5 rounded transition-all cursor-pointer ";
                          if (!isResultMode) {
                             className += isSelected ? "bg-indigo-50 font-bold text-indigo-900 underline decoration-indigo-300" : "hover:bg-gray-50";
                          } else {
                             if (isKeyCorrect) className += "bg-green-100 text-green-900 font-bold ";
                             else if (isSelected && !isKeyCorrect) className += "bg-red-100 text-red-900 decoration-red-500 line-through ";
                             else className += "opacity-60 ";
                          }

                          return (
                            <div 
                              key={oIdx} 
                              onClick={() => !isResultMode && !isPreviewMode && handleAnswerChange(questionNumber, key)}
                              className={className}
                            >
                              <span className={`w-5 h-5 md:w-6 md:h-6 rounded-full border border-gray-400 flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected && !isResultMode ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent text-gray-800'}`}>
                                {key}
                              </span>
                              <span className="text-sm md:text-base pt-0.5">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'essay' && (
                       <div className="mt-3 ml-0 md:ml-4">
                          <textarea 
                            disabled={isResultMode || isPreviewMode}
                            value={userAnswer || ''}
                            onChange={(e) => handleAnswerChange(questionNumber, e.target.value)}
                            className="w-full bg-transparent outline-none min-h-[100px] md:min-h-[120px] p-2 md:p-4 text-sm md:text-base leading-loose resize-y print:border print:border-gray-800"
                            placeholder="Write your answer here..."
                            style={{
                              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e5e7eb 31px, #e5e7eb 32px)',
                              lineHeight: '32px',
                              paddingTop: '8px'
                            }}
                          />
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-12 md:mt-16 text-center font-bold text-black border-t-2 border-black pt-6 pb-6">
           --- THE END ---
        </div>
      </div>
    </div>
  );
};

export default TestPrepSystem;
