
import React from 'react';
import { Lock, Crown, X } from 'lucide-react';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  message: string;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  message 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full md:w-full md:max-w-md rounded-t-[2rem] md:rounded-2xl shadow-2xl overflow-hidden relative transform transition-all animate-[fadeIn_0.3s_ease-out]">
        
        {/* Mobile Drag Handle */}
        <div className="md:hidden w-full flex justify-center pt-3 pb-1 absolute top-0 z-20" onClick={onClose}>
           <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
        </div>

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/80 hover:text-white z-20 transition-colors p-1 bg-white/10 rounded-full"
        >
            <X className="w-5 h-5" />
        </button>
        
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 pt-10 text-center relative overflow-hidden">
           {/* Decorative elements */}
           <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
           <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/30 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl"></div>
           
           {/* Icon Bubble */}
           <div className="relative">
             <div className="absolute inset-0 bg-white/20 blur-xl rounded-full scale-150"></div>
             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ring-4 ring-white/10 relative z-10">
                <Lock className="w-10 h-10 text-white drop-shadow-md" />
             </div>
           </div>
           
           <h2 className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-sm mb-1">
             Tính Năng Bị Khóa
           </h2>
           <p className="text-purple-200 text-xs font-medium uppercase tracking-widest">Premium Feature</p>
        </div>
        
        <div className="p-6 md:p-8 text-center pb-8 md:pb-8">
           <div className="mb-8">
             <p className="text-gray-700 text-base md:text-lg font-medium leading-relaxed">
               {message}
             </p>
           </div>
           
           <div className="flex flex-col gap-3">
              <button 
                onClick={onUpgrade}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group text-base"
              >
                <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform" />
                Nâng cấp gói ngay
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors text-sm"
              >
                Để sau
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LimitReachedModal;
