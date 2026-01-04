
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, DailyUsage } from '../types';
import { User, Camera, Save, Zap, Shield, Crown, CheckCircle } from 'lucide-react';
import { ZALO_CONSULTATION_URL } from '../constants';

interface UserProfileProps {
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  dailyUsage: DailyUsage;
  onCancelSubscription: () => void;
  onResetApp: () => void;
}

const UserProfileView: React.FC<UserProfileProps> = ({ 
  profile, 
  onUpdateProfile,
  dailyUsage,
  onResetApp
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...profile }));
  }, [profile]);

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        onUpdateProfile({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="h-16 border-b flex items-center px-6 bg-white shadow-sm shrink-0">
        <h1 className="font-bold text-xl text-gray-800">Hồ sơ cá nhân</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* VIP Badge Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between">
             <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                   <Crown className="w-8 h-8 text-white fill-white" /> SUPER VIP PRO
                </h2>
                <p className="opacity-90 mt-1">Gói thành viên cao cấp nhất. Không giới hạn trọn đời.</p>
             </div>
             <div className="hidden md:block bg-white/20 p-3 rounded-full">
                <Shield className="w-10 h-10 text-white" />
             </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-slate-700 to-slate-900 relative"></div>
            
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-14 mb-6 gap-4">
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 rounded-full border-[5px] border-white bg-gray-200 overflow-hidden shadow-lg ring-4 ring-amber-400/50">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-400">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-md transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                   <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                   <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 mt-1">
                      <span>Thành viên từ {new Date(profile.joinDate).toLocaleDateString('vi-VN')}</span>
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span className="text-amber-600 font-bold">Lifetime Access</span>
                   </div>
                </div>

                <div className="mt-2 md:mt-0">
                   {!isEditing ? (
                     <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all text-sm">
                       Chỉnh sửa
                     </button>
                   ) : (
                     <div className="flex gap-2">
                       <button onClick={() => { setIsEditing(false); setFormData(profile); }} className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all text-sm">
                         Hủy
                       </button>
                       <button onClick={handleSave} className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm flex items-center gap-2 transition-all text-sm">
                         <Save className="w-4 h-4" /> Lưu
                       </button>
                     </div>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">Họ và tên</label>
                   <input 
                     type="text" 
                     disabled={!isEditing}
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-white disabled:text-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mục tiêu học tập</label>
                   <select 
                     disabled={!isEditing}
                     value={formData.target || 'IELTS 8.0+'}
                     onChange={(e) => setFormData({...formData, target: e.target.value})}
                     className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-white disabled:text-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   >
                      <option>Giao tiếp nâng cao</option>
                      <option>IELTS 7.0+</option>
                      <option>IELTS 8.0+</option>
                      <option>IELTS 9.0 (Master)</option>
                   </select>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Stats (Unlimited) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-orange-500" /> Thống kê hoạt động
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-100 text-center">
                   <div className="text-2xl font-bold text-green-700">{dailyUsage.messagesCount}</div>
                   <div className="text-xs text-green-600 font-medium">Tin nhắn hôm nay</div>
                   <div className="text-[10px] text-green-400 mt-1 uppercase">Không giới hạn</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 text-center">
                   <div className="text-2xl font-bold text-purple-700">{dailyUsage.testsGenerated}</div>
                   <div className="text-xs text-purple-600 font-medium">Đề thi đã tạo</div>
                   <div className="text-[10px] text-purple-400 mt-1 uppercase">Không giới hạn</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                   <div className="text-2xl font-bold text-blue-700">{dailyUsage.gamesPlayed}</div>
                   <div className="text-xs text-blue-600 font-medium">Game đã chơi</div>
                   <div className="text-[10px] text-blue-400 mt-1 uppercase">Không giới hạn</div>
                </div>
             </div>
          </div>

          {/* Support */}
          <div className="text-center pt-4">
             <a href={ZALO_CONSULTATION_URL} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium hover:underline">
                Liên hệ hỗ trợ kỹ thuật qua Zalo
             </a>
             <div className="mt-4">
                <button onClick={onResetApp} className="text-xs text-red-400 hover:text-red-600">
                   Reset ứng dụng (Xóa dữ liệu)
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
