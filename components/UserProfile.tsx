
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, AccountTier, DailyUsage } from '../types';
import { User, Camera, Save, CreditCard, LogOut, Crown, Star, CheckCircle, Zap, Shield, MessageCircle, AlertTriangle, Key } from 'lucide-react';
import { TIER_LIMITS, SUBSCRIPTION_PACKAGES, ZALO_CONSULTATION_URL, ACTIVATION_CODES } from '../constants';
import { safeLocalStorage } from '../services/storage';

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
  onCancelSubscription,
  onResetApp
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  
  // Sync formData with profile prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...profile
    }));
  }, [profile]);
  
  // Activation State
  const [isActivationOpen, setIsActivationOpen] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationMsg, setActivationMsg] = useState<{type: 'success'|'error', text: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleContactZalo = () => {
    window.open(ZALO_CONSULTATION_URL, '_blank');
  };
  
  const handleActivateCode = () => {
    setActivationMsg(null);
    const code = activationCode.trim().toUpperCase();
    
    if (!code) {
      setActivationMsg({ type: 'error', text: "Vui lòng nhập mã." });
      return;
    }

    // Special commands (Always allowed)
    if (code === 'BASIC' || code === 'RESET') {
       onUpdateProfile({ ...formData, accountTier: 'basic', subscriptionExpiry: null });
       setActivationMsg({ type: 'success', text: "Đã chuyển về gói Cơ Bản." });
       setTimeout(() => setIsActivationOpen(false), 2000);
       return;
    }

    // Check if code was already used by this user
    if (profile.usedCodes && profile.usedCodes.includes(code)) {
      setActivationMsg({ type: 'error', text: "Mã này đã được bạn sử dụng rồi." });
      return;
    }

    // Check against Valid Codes Dictionary
    const config = ACTIVATION_CODES[code];

    if (config) {
       let newExpiry: number | null = null;
       const months = config.months;

       // Calculate expiry
       if (months >= 900) {
         // Lifetime
         newExpiry = null;
       } else {
         const now = Date.now();
         const currentExpiry = (profile.subscriptionExpiry && profile.subscriptionExpiry > now) ? profile.subscriptionExpiry : now;
         const additionalTime = months * 30 * 24 * 60 * 60 * 1000;
         newExpiry = currentExpiry + additionalTime;
       }

       const updatedProfile: UserProfile = { 
         ...formData, 
         accountTier: config.tier,
         subscriptionExpiry: newExpiry,
         usedCodes: [...(profile.usedCodes || []), code]
       };

       setFormData(updatedProfile);
       onUpdateProfile(updatedProfile);
       setActivationMsg({ 
         type: 'success', 
         text: `Kích hoạt thành công gói ${config.tier.toUpperCase()} (${months >= 900 ? 'Vĩnh viễn' : months + ' tháng'}).` 
       });
       setActivationCode('');
       
       // Close activation box after delay
       setTimeout(() => {
          setActivationMsg(null);
          setIsActivationOpen(false);
       }, 3000);

    } else {
      setActivationMsg({ type: 'error', text: "Mã không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ Zalo." });
    }
  };
  
  const renderTierBadge = (tier: AccountTier) => {
    switch (tier) {
      case 'vip':
        return (
          <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md animate-shimmer bg-[length:200%_100%] whitespace-nowrap">
             <Crown className="w-3 h-3 fill-white" /> VIP MEMBER
          </div>
        );
      case 'pro':
        return (
          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
             <Star className="w-3 h-3 fill-white" /> PRO STUDENT
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
             BASIC PLAN
          </div>
        );
    }
  };
  
  const limits = TIER_LIMITS[profile.accountTier];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="h-14 md:h-16 border-b flex items-center px-4 md:px-6 bg-white shadow-sm shrink-0">
        <h1 className="font-bold text-lg md:text-xl text-gray-800 truncate">Cài đặt & Hồ sơ cá nhân</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* 1. Usage Dashboard */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 text-base md:text-lg">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Thống kê sử dụng
                </h3>
                {profile.accountTier !== 'basic' && (
                  <button 
                    onClick={onCancelSubscription}
                    className="w-full sm:w-auto text-xs text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                     <AlertTriangle className="w-3.5 h-3.5" /> Hủy gói cước
                  </button>
                )}
             </div>
             
             {/* Responsive Grid for Usage Stats */}
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Messages Usage */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 font-medium">Tin nhắn AI</span>
                     <span className="font-bold text-indigo-600">{dailyUsage.messagesCount} / {limits.messages > 9000 ? '∞' : limits.messages}</span>
                   </div>
                   <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-auto">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-500" 
                        style={{ width: `${Math.min((dailyUsage.messagesCount / (limits.messages || 1)) * 100, 100)}%` }}
                      ></div>
                   </div>
                </div>

                {/* Tests Usage */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 font-medium">Tạo đề thi</span>
                     <span className="font-bold text-purple-600">{dailyUsage.testsGenerated} / {limits.tests > 9000 ? '∞' : limits.tests}</span>
                   </div>
                   <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-auto">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-500" 
                        style={{ width: `${Math.min((dailyUsage.testsGenerated / (limits.tests || 1)) * 100, 100)}%` }}
                      ></div>
                   </div>
                </div>

                {/* Games Usage */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col">
                   <div className="flex justify-between text-sm mb-2">
                     <span className="text-gray-600 font-medium">Chơi Game</span>
                     <span className="font-bold text-green-600">{dailyUsage.gamesPlayed} / {limits.games > 9000 ? '∞' : limits.games}</span>
                   </div>
                   <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-auto">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${Math.min((dailyUsage.gamesPlayed / (limits.games || 1)) * 100, 100)}%` }}
                      ></div>
                   </div>
                </div>
             </div>
             
             {/* Expiry Info */}
             {profile.accountTier !== 'basic' && (
               <div className="mt-4 flex items-center justify-end text-sm text-gray-500">
                 <Shield className="w-4 h-4 mr-1" />
                 Hạn sử dụng: 
                 <strong className="ml-1 text-gray-800">
                   {profile.subscriptionExpiry ? new Date(profile.subscriptionExpiry).toLocaleDateString('vi-VN') : "Vĩnh viễn"}
                 </strong>
               </div>
             )}
          </div>

          {/* 2. User Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Cover Image */}
            <div className={`h-24 md:h-32 relative ${profile.accountTier === 'vip' ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500' : profile.accountTier === 'pro' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gradient-to-r from-gray-400 to-gray-600'}`}>
            </div>
            
            <div className="px-4 md:px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-14 mb-6 gap-4">
                {/* Avatar */}
                <div className="relative group shrink-0">
                  <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-[5px] border-white bg-gray-200 overflow-hidden shadow-lg ${profile.accountTier === 'vip' ? 'ring-4 ring-yellow-400/30' : ''}`}>
                    {formData.avatar ? (
                      <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-400">
                        <User className="w-10 h-10 md:w-12 md:h-12" />
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
                
                <div className="flex-1 text-center md:text-left w-full md:w-auto">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-2 mb-1 justify-center md:justify-start">
                     <h2 className="text-2xl font-bold text-gray-900 line-clamp-1">{profile.name}</h2>
                     <div className="mb-1 md:mb-0.5 transform scale-90 md:scale-100">{renderTierBadge(profile.accountTier)}</div>
                  </div>
                  <p className="text-gray-500 text-sm">Thành viên từ {new Date(profile.joinDate).toLocaleDateString('vi-VN')}</p>
                </div>

                <div className="mt-2 md:mt-0 w-full md:w-auto flex justify-center">
                   {!isEditing ? (
                     <button 
                       onClick={() => setIsEditing(true)}
                       className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all text-sm"
                     >
                       Chỉnh sửa
                     </button>
                   ) : (
                     <div className="flex gap-2 w-full md:w-auto justify-center">
                       <button 
                         onClick={() => { setIsEditing(false); setFormData(profile); }}
                         className="flex-1 md:flex-none px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all text-sm"
                       >
                         Hủy
                       </button>
                       <button 
                         onClick={handleSave}
                         className="flex-1 md:flex-none px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-sm flex items-center justify-center gap-2 transition-all text-sm"
                       >
                         <Save className="w-4 h-4" /> Lưu
                       </button>
                     </div>
                   )}
                </div>
              </div>

              {/* Form Fields - Compact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">Họ và tên</label>
                   <input 
                     type="text" 
                     disabled={!isEditing}
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-white disabled:text-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                   />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-700 mb-1.5">Mục tiêu học tập</label>
                   <select 
                     disabled={!isEditing}
                     value={formData.target || 'Giao tiếp cơ bản'}
                     onChange={(e) => setFormData({...formData, target: e.target.value})}
                     className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 disabled:bg-white disabled:text-gray-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                   >
                      <option>Giao tiếp cơ bản</option>
                      <option>IELTS 6.0+</option>
                      <option>IELTS 7.0+</option>
                      <option>IELTS 8.0+</option>
                      <option>THPT Quốc Gia 9+</option>
                   </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* 4. Pricing & Activation Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-1 text-base md:text-lg">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    Bảng Giá & Kích Hoạt
                  </h3>
                  <p className="text-sm text-gray-500">Nâng cấp để mở khóa quyền năng AI không giới hạn.</p>
                </div>
                
                <button 
                  onClick={() => setIsActivationOpen(!isActivationOpen)}
                  className="w-full md:w-auto bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 border border-indigo-200 active:scale-95"
                >
                  <Key className="w-4 h-4" />
                  {isActivationOpen ? 'Đóng nhập mã' : 'Nhập Mã Kích Hoạt'}
                </button>
             </div>

             {/* Activation Input (Collapsible) */}
             {isActivationOpen && (
               <div className="mb-8 bg-indigo-50 p-4 md:p-6 rounded-xl border-2 border-indigo-100 animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Key className="w-24 h-24 text-indigo-600" />
                  </div>
                  <label className="block text-sm font-bold text-indigo-900 mb-2">Đã có mã kích hoạt từ Zalo?</label>
                  <div className="flex flex-col sm:flex-row gap-2 relative z-10">
                     <input 
                       type="text" 
                       value={activationCode}
                       onChange={(e) => setActivationCode(e.target.value)}
                       placeholder="VD: VIP-2024..."
                       className="flex-1 p-3 border border-indigo-200 rounded-lg uppercase font-mono tracking-wider focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                     />
                     <button 
                       onClick={handleActivateCode}
                       className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 sm:py-0 rounded-lg font-bold transition-colors shadow-md"
                     >
                       Kích hoạt
                     </button>
                  </div>
                  {activationMsg && (
                    <div className={`mt-3 text-sm flex items-center gap-2 font-medium ${activationMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                       {activationMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                       {activationMsg.text}
                    </div>
                  )}
               </div>
             )}

             {/* Pricing Grid - RESPONSIVE MODIFICATION */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {SUBSCRIPTION_PACKAGES.map((pkg) => {
                  const isBasic = pkg.tier === 'basic';
                  return (
                    <div key={pkg.id} className={`relative flex flex-col p-4 rounded-xl border-2 transition-all hover:-translate-y-1 hover:shadow-lg ${pkg.tier === 'vip' ? 'border-amber-200 bg-amber-50/50' : pkg.isPopular ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-100 bg-white'}`}>
                       {pkg.isLifetime && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">HOT</div>}
                       {pkg.isPopular && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">BEST</div>}
                       
                       <div className="mb-2">
                          <h4 className="font-bold text-gray-800 line-clamp-1">{pkg.name}</h4>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${pkg.tier === 'vip' ? 'bg-amber-100 text-amber-700' : isBasic ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                            {pkg.tier.toUpperCase()}
                          </span>
                       </div>
                       
                       <div className="mb-4">
                          <span className="text-xl font-black text-gray-900">{pkg.priceVND > 0 ? `${pkg.priceVND.toLocaleString()}đ` : 'Miễn Phí'}</span>
                          <span className="text-xs text-gray-500 block">
                            {pkg.isLifetime ? 'Thanh toán 1 lần' : pkg.durationMonths > 0 ? `/ ${pkg.durationMonths} tháng` : 'Trọn đời'}
                          </span>
                       </div>

                       <ul className="text-xs text-gray-600 space-y-2 mb-4 flex-1">
                          {pkg.features.map((f, i) => (
                             <li key={i} className="flex items-start gap-1.5">
                               <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${isBasic ? 'text-gray-400' : 'text-green-500'}`} />
                               <span className="leading-tight">{f}</span>
                             </li>
                          ))}
                       </ul>

                       {!isBasic ? (
                         <button 
                           onClick={handleContactZalo}
                           className={`w-full py-2.5 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95
                             ${pkg.tier === 'vip' 
                                 ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:brightness-110' 
                                 : 'bg-indigo-600 text-white hover:bg-indigo-700'
                             }
                           `}
                         >
                           <MessageCircle className="w-3.5 h-3.5" />
                           Liên hệ Zalo
                         </button>
                       ) : (
                         <button disabled className="w-full py-2.5 bg-gray-100 text-gray-400 rounded-lg font-bold text-xs cursor-default border border-gray-200">
                            Đang sử dụng
                         </button>
                       )}
                    </div>
                  );
                })}
             </div>
             
             <p className="text-xs text-center text-gray-400 mt-6 italic">
                * Sau khi thanh toán qua Zalo, bạn sẽ nhận được Mã Kích Hoạt để nhập vào ô ở trên.
             </p>
          </div>

          {/* Reset System (Danger Zone) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8">
               <h3 className="font-bold text-gray-800 mb-2 text-base">Khu vực nguy hiểm</h3>
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <p className="text-xs text-gray-500">
                    Xóa toàn bộ dữ liệu chat và cài đặt. Hành động này không thể hoàn tác.
                  </p>
                  <button 
                     onClick={onResetApp}
                     className="w-full sm:w-auto px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-xs font-bold flex items-center justify-center gap-1"
                  >
                     <LogOut className="w-3 h-3" /> Reset App
                  </button>
               </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
