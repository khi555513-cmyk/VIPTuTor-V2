
import React from 'react';
import { AlertTriangle, Crown } from 'lucide-react';

interface SubscriptionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: () => void;
  expiredPackageName: string;
}

const SubscriptionExpiredModal: React.FC<SubscriptionExpiredModalProps> = ({ 
  isOpen, 
  onClose, 
  onRenew,
  expiredPackageName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full md:w-full md:max-w-md rounded-t-[2rem] md:rounded-2xl shadow-2xl overflow-hidden relative transform transition-all animate-[fadeIn_0.3s_ease-out]">
        
        {/* Mobile Drag Handle */}
        <div className="md:hidden w-full flex justify-center pt-3 pb-1 absolute top-0 z-20" onClick={onClose}>
           <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-orange-600 p-8 pt-10 text-center relative overflow-hidden">
           {/* Decorative circles */}
           <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
           
           <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner ring-4 ring-white/10">
              <AlertTriangle className="w-8 h-8 text-white drop-shadow-md" />
           </div>
           <h2 className="text-xl font-bold text-white uppercase tracking-wider drop-shadow-sm">Hết Hạn Gói Cước</h2>
        </div>
        
        <div className="p-6 md:p-6 text-center pb-8 md:pb-6">
           <div className="mb-6">
             <p className="text-gray-800 text-lg font-medium leading-relaxed">
               Bạn đã sử dụng hết lưu lượng của gói <br/>
               <span className="text-red-600 font-black text-2xl uppercase">{expiredPackageName}</span>
             </p>
           </div>
           
           <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 text-sm text-gray-700 text-left shadow-inner">
              <p className="mb-2 font-semibold text-orange-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Tài khoản đã về gói CƠ BẢN
              </p>
              <p className="opacity-90 leading-relaxed text-xs md:text-sm">
                Hãy gia hạn để tiếp tục sử dụng các tính năng nâng cao.
              </p>
           </div>

           <div className="flex flex-col gap-3">
              <button 
                onClick={onRenew}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 text-base"
              >
                <Crown className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                Gia hạn / Nâng cấp ngay
              </button>
              <button 
                onClick={onClose}
                className="w-full py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors text-sm"
              >
                Đóng và dùng gói cơ bản
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionExpiredModal;
