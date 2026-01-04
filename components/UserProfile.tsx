import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, DailyUsage } from '../types';
import { User, Camera, Save, Zap, Shield, Crown, CheckCircle, AlertTriangle, Key } from 'lucide-react';
import { ZALO_CONSULTATION_URL, TIER_LIMITS, SUBSCRIPTION_PACKAGES, ACTIVATION_CODES } from '../constants';
import confetti from 'canvas-confetti';

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
  const [activationCode, setActivationCode] = useState('');
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

  const handleActivateCode = () => {
    const code = activationCode.trim().toUpperCase();
    if (!code) return;

    if (profile.usedCodes?.includes(code)) {
      alert("Mã này đã được sử dụng!");
      return;
    }

    const packageInfo = ACTIVATION_CODES[code];
    if (packageInfo) {
      const now = Date.now();
      const currentExpiry = profile.subscriptionExpiry && profile.subscriptionExpiry > now ? profile.subscriptionExpiry : now;
      
      // Calculate new expiry
      let newExpiry = null;
      if (packageInfo.months < 999) {
         const msPerMonth = 30 * 24 * 60 * 60 * 1000;
         newExpiry = currentExpiry + (packageInfo.months * msPerMonth);
      } else {
         newExpiry = null; // Lifetime
      }

      const newProfile: UserProfile = {
        ...profile,
        accountTier: packageInfo.tier,
        subscriptionExpiry: newExpiry,
        usedCodes: [...(profile.usedCodes || []), code]
      };
      
      onUpdateProfile(newProfile);
      setActivationCode('');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      alert(`Kích hoạt thành công gói ${packageInfo.tier.toUpperCase()}!`);
    } else {
      alert("Mã kích hoạt không hợp lệ. Vui lòng kiểm tra lại.");
    }
  };

  const currentLimits = TIER_LIMITS[profile.accountTier];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="h-16 border-b flex items-center px-6 bg-white shadow-sm shrink-0">
        <h1 className="font-bold text-xl text-gray-800">Hồ sơ cá nhân</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Status Banner */}
          <div className={`rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between ${profile.accountTier === 'vip' ? 'bg-gradient-to-r from-amber-500 to-yellow-600' : profile.accountTier === 'pro' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-700'}`}>
             <div>
                <h2 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                   {profile.accountTier === 'vip' ? <Crown className="w-8 h-8 text-white fill-white" /> : profile.accountTier === 'pro' ? <Zap className="w-8 h-8 text-yellow-300 fill-yellow-300" /> : <User className="w-8 h-8 text-gray-300" />}
                   {profile.accountTier === 'vip' ? 'SUPER VIP PRO' : profile.accountTier === 'pro' ? 'PRO MEMBER' : 'BASIC MEMBER'}
                </h2>
                <p className="opacity-90 mt-1 text-center md:text-left">
                  {profile.accountTier === 'vip' ? 'Gói thành viên cao cấp nhất. Không giới hạn trọn đời.' : profile.accountTier === 'pro' ? 'Đã mở khóa các tính năng nâng cao.' : 'Nâng cấp để mở khóa toàn bộ tính năng.'}
                </p>
                {profile.subscriptionExpiry && (
                   <div className="mt-2 text-sm bg-white/20 inline-block px-3 py-1 rounded-full">
                      Hết hạn: {new Date(profile.subscriptionExpiry).toLocaleDateString('vi-VN')}
                   </div>
                )}
             </div>
             {profile.accountTier !== 'basic' && (
               <div className="mt-4 md:mt-0">
                  <button onClick={onCancelSubscription} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors">
                     Hủy gói
                  </button>
               </div>
             )}
          </div>

          {/* User Info & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Left Column: Avatar & Basic Info */}
             <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-slate-100 to-slate-200 relative"></div>
                <div className="px-6 pb-6 relative">
                   <div className="flex items-end -mt-12 mb-4 gap-4">
                      <div className="relative group">
                         <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                           {formData.avatar ? (
                             <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-400">
                               <User className="w-10 h-10" />
                             </div>
                           )}
                         </div>
                         {isEditing && (
                           <button 
                             onClick={() => fileInputRef.current?.click()}
                             className="absolute bottom-0 right-0 p-1.5 bg-gray-800 text-white rounded-full hover:bg-gray-700 shadow-md transition-colors"
                           >
                             <Camera className="w-4 h-4" />
                           </button>
                         )}
                         <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                      </div>
                      <div className="flex-1 mb-1">
                         {isEditing ? (
                           <input 
                             type="text" 
                             value={formData.name}
                             onChange={(e) => setFormData({...formData, name: e.target.value})}
                             className="text-xl font-bold text-gray-900 border-b border-gray-300 focus:border-indigo-500 outline-none bg-transparent w-full"
                           />
                         ) : (
                           <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
                         )}
                         <p className="text-xs text-gray-500">Thành viên từ {new Date(profile.joinDate).toLocaleDateString('vi-VN')}</p>
                      </div>
                      <div>
                         {!isEditing ? (
                           <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Sửa</button>
                         ) : (
                           <button onClick={handleSave} className="text-green-600 hover:text-green-800 text-sm font-medium">Lưu</button>
                         )}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div>
                         <label className="text-xs font-semibold text-gray-500 uppercase">Mục tiêu</label>
                         {isEditing ? (
                            <select 
                              value={formData.target || 'IELTS 7.0+'}
                              onChange={(e) => setFormData({...formData, target: e.target.value})}
                              className="block w-full mt-1 p-2 border border-gray-200 rounded text-sm"
                            >
                               <option>Giao tiếp nâng cao</option>
                               <option>IELTS 7.0+</option>
                               <option>IELTS 8.0+</option>
                               <option>TOEIC 800+</option>
                            </select>
                         ) : (
                            <p className="text-gray-800 font-medium">{profile.target}</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>

             {/* Right Column: Usage Stats */}
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                   <Zap className="w-4 h-4 text-orange-500" /> Thống kê hôm nay
                </h3>
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-gray-600">Tin nhắn</span>
                         <span className={`font-bold ${dailyUsage.messagesCount >= currentLimits.messages ? 'text-red-500' : 'text-gray-800'}`}>{dailyUsage.messagesCount} / {currentLimits.messages > 9000 ? '∞' : currentLimits.messages}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                         <div className={`h-full ${dailyUsage.messagesCount >= currentLimits.messages ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((dailyUsage.messagesCount / (currentLimits.messages || 1)) * 100, 100)}%` }}></div>
                      </div>
                   </div>
                   <div>
                      <div className="flex justify-between text-sm mb-1">
                         <span className="text-gray-600">Đề thi đã tạo</span>
                         <span className={`font-bold ${dailyUsage.testsGenerated >= currentLimits.tests ? 'text-red-500' : 'text-gray-800'}`}>{dailyUsage.testsGenerated} / {currentLimits.tests > 9000 ? '∞' : currentLimits.tests}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                         <div className={`h-full ${dailyUsage.testsGenerated >= currentLimits.tests ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${Math.min((dailyUsage.testsGenerated / (currentLimits.tests || 1)) * 100, 100)}%` }}></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Activation Code Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-indigo-600" /> Kích hoạt mã giới thiệu / mã gói
             </h3>
             <div className="flex gap-3">
                <input 
                  type="text" 
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  placeholder="Nhập mã (VD: PRO-XXXXXX)"
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none uppercase font-mono"
                />
                <button 
                  onClick={handleActivateCode}
                  disabled={!activationCode.trim()}
                  className="px-6 py-3 bg-indigo-600 disabled:bg-gray-300 text-white rounded-xl font-bold shadow hover:bg-indigo-700 transition-colors"
                >
                  Kích hoạt
                </button>
             </div>
             <p className="text-xs text-gray-500 mt-2">
                Liên hệ <a href={ZALO_CONSULTATION_URL} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Zalo Admin</a> để mua mã kích hoạt.
             </p>
          </div>

          {/* Subscription Packages */}
          <div>
             <h3 className="font-bold text-gray-800 mb-4 text-lg">Các gói dịch vụ</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {SUBSCRIPTION_PACKAGES.map(pkg => (
                   <div key={pkg.id} className={`bg-white rounded-xl border p-5 relative flex flex-col ${profile.accountTier === pkg.tier && !pkg.isLifetime ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' : 'border-gray-200 shadow-sm'}`}>
                      {pkg.isPopular && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>}
                      <h4 className="font-bold text-gray-900 text-lg">{pkg.name}</h4>
                      <div className="text-2xl font-black text-indigo-600 mt-2">
                         {pkg.priceVND === 0 ? 'Miễn phí' : `${pkg.priceVND.toLocaleString()}đ`}
                      </div>
                      <p className="text-xs text-gray-500 mb-4">{pkg.isLifetime ? 'Thanh toán 1 lần' : `/ ${pkg.durationMonths} tháng`}</p>
                      
                      <ul className="space-y-2 mb-6 flex-1">
                         {pkg.features.map((feat, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                               <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                               {feat}
                            </li>
                         ))}
                      </ul>

                      <a 
                        href={ZALO_CONSULTATION_URL} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`w-full py-2 rounded-lg font-bold text-sm text-center transition-colors ${pkg.priceVND === 0 ? 'bg-gray-100 text-gray-600 cursor-default' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                      >
                         {pkg.priceVND === 0 ? 'Đang sử dụng' : 'Mua ngay'}
                      </a>
                   </div>
                ))}
             </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t pt-6 text-center">
              <button onClick={onResetApp} className="text-xs text-red-400 hover:text-red-600 underline">
                 Reset ứng dụng (Xóa toàn bộ dữ liệu máy này)
              </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfileView;