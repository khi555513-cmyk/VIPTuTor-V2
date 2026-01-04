
import React from 'react';
import { X, Sparkles, BookOpen, GraduationCap, Save, Paperclip, MessageSquare } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Mobile Bottom Sheet / Desktop Modal Container */}
      <div className="bg-white w-full md:w-full md:max-w-2xl rounded-t-[2rem] md:rounded-2xl shadow-2xl max-h-[85vh] md:max-h-[90vh] overflow-hidden flex flex-col relative transform transition-transform duration-300">
        
        {/* Mobile Drag Handle */}
        <div className="md:hidden w-full flex justify-center pt-3 pb-1" onClick={onClose}>
           <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-4 md:py-6 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10 shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Hướng Dẫn</h2>
            <p className="text-xs md:text-sm text-indigo-600 font-medium">VIP English Tutor Pro</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 space-y-6 md:space-y-8 text-gray-700 overflow-y-auto">
          
          {/* Section 1: Modes */}
          <section>
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              1. Chế Độ Học Tập
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-indigo-50 p-3 md:p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 mb-1 text-indigo-700 font-bold text-sm">
                  <GraduationCap className="w-4 h-4" /> General
                </div>
                <p className="text-xs md:text-sm leading-relaxed">Trò chuyện, hỏi đáp và tra từ điển thông minh.</p>
              </div>
              
              <div className="bg-purple-50 p-3 md:p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-2 mb-1 text-purple-700 font-bold text-sm">
                  <Sparkles className="w-4 h-4" /> Exercises
                </div>
                <p className="text-xs md:text-sm leading-relaxed">Giải bài tập chi tiết, giải thích đúng sai.</p>
              </div>

              <div className="bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-1 text-blue-700 font-bold text-sm">
                  <BookOpen className="w-4 h-4" /> Theory
                </div>
                <p className="text-xs md:text-sm leading-relaxed">Chuyên gia lý thuyết ngữ pháp chuyên sâu.</p>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Section 2: Features */}
          <section className="space-y-3 md:space-y-4">
             <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">2. Tính Năng Chính</h3>
             
             <div className="flex gap-3 items-start">
               <div className="bg-gray-100 p-2 rounded-lg shrink-0">
                 <Paperclip className="w-5 h-5 text-gray-600" />
               </div>
               <div>
                 <h4 className="font-semibold text-gray-800 text-sm">Gửi ảnh & Tài liệu</h4>
                 <p className="text-xs md:text-sm text-gray-600 mt-0.5 leading-relaxed">
                   Upload ảnh bài tập, PDF, hoặc file Word để AI phân tích.
                 </p>
               </div>
             </div>

             <div className="flex gap-3 items-start">
               <div className="bg-gray-100 p-2 rounded-lg shrink-0">
                 <Save className="w-5 h-5 text-gray-600" />
               </div>
               <div>
                 <h4 className="font-semibold text-gray-800 text-sm">Lưu Kiến Thức</h4>
                 <p className="text-xs md:text-sm text-gray-600 mt-0.5 leading-relaxed">
                   Lưu lại các câu trả lời hay vào thư viện cá nhân để ôn tập.
                 </p>
               </div>
             </div>
          </section>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 md:p-4 text-xs md:text-sm text-yellow-800 leading-relaxed">
            <strong>Mẹo VIP:</strong> Dùng chế độ <em>Exercises</em> và chụp ảnh bài tập để có lời giải nhanh nhất!
          </div>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end shrink-0 pb-6 md:pb-4">
          <button 
            onClick={onClose}
            className="w-full md:w-auto px-6 py-3 md:py-2 bg-indigo-600 text-white rounded-xl md:rounded-lg hover:bg-indigo-700 font-bold md:font-medium transition-colors text-sm"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
