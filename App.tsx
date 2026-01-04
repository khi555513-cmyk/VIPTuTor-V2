
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SavedView from './components/SavedView';
import NotificationView from './components/NotificationView';
import TestPrepSystem from './components/TestPrepSystem';
import HelpModal from './components/HelpModal';
import MiniGame from './components/MiniGame';
import UserProfileView from './components/UserProfile';
import SubscriptionExpiredModal from './components/SubscriptionExpiredModal';
import LimitReachedModal from './components/LimitReachedModal';
import { ChatSession, SavedKnowledgeItem, Message, Role, AppNotification, GameData, UserProfile, DailyUsage } from './types';
import { TIER_LIMITS } from './constants';
import { Menu, AlertOctagon } from 'lucide-react';
import { safeLocalStorage, storageStatus } from './services/storage';

const App: React.FC = () => {
  const isResettingRef = useRef(false);

  // --- App Data State ---
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('vip_tutor_sessions');
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [{ id: 'default', title: 'New Session', createdAt: Date.now(), messages: [] }];
    } catch (e) {
      return [{ id: 'default', title: 'New Session', createdAt: Date.now(), messages: [] }];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    try {
      const savedSessions = safeLocalStorage.getItem('vip_tutor_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
             return parsed[parsed.length - 1].id; 
        }
      }
      return 'default';
    } catch (e) {
      return 'default';
    }
  });

  const [savedItems, setSavedItems] = useState<SavedKnowledgeItem[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('vip_tutor_saved');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = safeLocalStorage.getItem('vip_tutor_notifications');
      if (saved) return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  // User Profile State - SUPER VIP PRO DEFAULT
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = safeLocalStorage.getItem('vip_tutor_profile');
      const defaultProfile: UserProfile = { 
        name: 'Super VIP Student', 
        joinDate: Date.now(), 
        target: 'IELTS 9.0+',
        accountTier: 'vip', // Always VIP
        subscriptionExpiry: null, // Lifetime
        usedCodes: [] 
      };
      // Merge saved data but ENFORCE VIP status
      return saved ? { ...defaultProfile, ...JSON.parse(saved), accountTier: 'vip', subscriptionExpiry: null } : defaultProfile;
    } catch (e) {
      return { name: 'Super VIP Student', joinDate: Date.now(), target: 'IELTS 9.0+', accountTier: 'vip', subscriptionExpiry: null, usedCodes: [] };
    }
  });

  // Daily Usage State
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>(() => {
    try {
      const saved = safeLocalStorage.getItem('vip_tutor_usage');
      const today = new Date().toISOString().split('T')[0];
      if (saved) {
        const parsed: DailyUsage = JSON.parse(saved);
        if (parsed.date === today) {
          return parsed;
        }
      }
      return { date: today, messagesCount: 0, testsGenerated: 0, gamesPlayed: 0 };
    } catch (e) {
      return { date: new Date().toISOString().split('T')[0], messagesCount: 0, testsGenerated: 0, gamesPlayed: 0 };
    }
  });

  const [currentView, setCurrentView] = useState<'chat' | 'saved' | 'notifications' | 'test-prep' | 'profile'>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [fullScreenGameData, setFullScreenGameData] = useState<GameData | null>(null);

  // Expiry Modal State (Disabled for Lifetime VIP)
  const [showExpiryModal, setShowExpiryModal] = useState(false);

  // Limit Reached Modal State
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
  const [limitModalMessage, setLimitModalMessage] = useState('');

  // --- Effects for Persistence ---
  useEffect(() => {
    if (!isResettingRef.current) safeLocalStorage.setItem('vip_tutor_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!isResettingRef.current) safeLocalStorage.setItem('vip_tutor_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    if (!isResettingRef.current) safeLocalStorage.setItem('vip_tutor_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!isResettingRef.current) safeLocalStorage.setItem('vip_tutor_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    if (!isResettingRef.current) safeLocalStorage.setItem('vip_tutor_usage', JSON.stringify(dailyUsage));
  }, [dailyUsage]);

  // --- HANDLER: Add Notification ---
  const handleAddNotification = (note: AppNotification) => {
    setNotifications(prev => [note, ...prev]);
  };

  // --- Logic for Limits & Usage (Always allow for VIP) ---
  const checkLimit = (type: 'message' | 'test' | 'game'): boolean => {
    return true; // SUPER VIP HAS NO LIMITS
  };

  const incrementUsage = (type: 'message' | 'test' | 'game') => {
    setDailyUsage(prev => {
      const today = new Date().toISOString().split('T')[0];
      if (prev.date !== today) {
        return { 
          date: today, 
          messagesCount: type === 'message' ? 1 : 0, 
          testsGenerated: type === 'test' ? 1 : 0, 
          gamesPlayed: type === 'game' ? 1 : 0 
        };
      }
      return {
        ...prev,
        messagesCount: type === 'message' ? prev.messagesCount + 1 : prev.messagesCount,
        testsGenerated: type === 'test' ? prev.testsGenerated + 1 : prev.testsGenerated,
        gamesPlayed: type === 'game' ? prev.gamesPlayed + 1 : prev.gamesPlayed
      };
    });
  };

  // --- Handlers (Existing) ---
  const getCurrentMessages = () => {
    return sessions.find(s => s.id === currentSessionId)?.messages || [];
  };

  const setMessages = (updateFn: React.SetStateAction<Message[]>) => {
    setSessions(prevSessions => {
      const newSessions = prevSessions.map(session => {
        if (session.id === currentSessionId) {
          const newMessages = typeof updateFn === 'function' ? updateFn(session.messages) : updateFn;
          let newTitle = session.title;
          if (session.title === 'New Session' && newMessages.length > 0) {
             const firstUserMsg = newMessages.find(m => m.role === Role.USER);
             if (firstUserMsg) {
                newTitle = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
             }
          }
          return { ...session, messages: newMessages, title: newTitle };
        }
        return session;
      });
      return newSessions;
    });
  };

  const handleNewSession = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Session',
      createdAt: Date.now(),
      messages: []
    };
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newId);
    setCurrentView('chat');
    setIsMobileMenuOpen(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch sử đoạn chat này không?")) return;
    const remainingSessions = sessions.filter(s => s.id !== sessionId);
    if (remainingSessions.length === 0) {
      const newId = Date.now().toString();
      const newSession = { id: newId, title: 'New Session', createdAt: Date.now(), messages: [] };
      setSessions([newSession]);
      setCurrentSessionId(newId);
    } else {
      setSessions(remainingSessions);
      if (sessionId === currentSessionId) {
         setCurrentSessionId(remainingSessions[remainingSessions.length - 1].id);
      }
    }
  };

  const handleSaveKnowledge = (item: SavedKnowledgeItem) => {
    setSavedItems(prev => [...prev, item]);
    const newNotification: AppNotification = {
      id: Date.now().toString(),
      title: 'Đã lưu kiến thức mới',
      message: `Bạn đã lưu "${item.title}" vào kho kiến thức cá nhân.`,
      type: 'system',
      timestamp: Date.now(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleDeleteKnowledge = (id: string) => {
    if(confirm("Are you sure you want to delete this?")) {
      setSavedItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleCancelSubscription = () => {
     alert("Bạn đang sử dụng phiên bản Super VIP Pro trọn đời. Không cần hủy!");
  };

  const handleResetApp = () => {
    if(window.confirm('CẢNH BÁO: Hành động này sẽ xóa toàn bộ lịch sử chat và cài đặt. Bạn có chắc chắn không?')) {
       isResettingRef.current = true;
       safeLocalStorage.clear();
       window.location.reload();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    if (currentView === 'test-prep') {
      return (
        <TestPrepSystem 
          onBack={() => setCurrentView('chat')} 
          checkLimit={() => checkLimit('test')}
          incrementUsage={() => incrementUsage('test')}
        />
      );
    }

    if (currentView === 'chat') {
       return (
         <ChatInterface 
           currentSessionId={currentSessionId}
           onSaveKnowledge={handleSaveKnowledge}
           messages={getCurrentMessages()}
           setMessages={setMessages}
           onPlayGame={(data) => {
              incrementUsage('game');
              setFullScreenGameData(data);
           }}
           onAddNotification={handleAddNotification}
           checkLimit={() => checkLimit('message')}
           incrementUsage={() => incrementUsage('message')}
           onToggleSidebar={() => setIsMobileMenuOpen(true)}
           onOpenProfile={() => setCurrentView('profile')}
         />
       );
    }
    
    if (currentView === 'saved') {
      return <SavedView items={savedItems} onDelete={handleDeleteKnowledge} />;
    }
    
    if (currentView === 'notifications') {
      return <NotificationView notifications={notifications} onMarkAllRead={handleMarkAllNotificationsRead} onDelete={handleDeleteNotification} onMarkRead={handleMarkNotificationRead} />;
    }

    if (currentView === 'profile') {
      return (
        <UserProfileView 
          profile={userProfile} 
          onUpdateProfile={setUserProfile} 
          dailyUsage={dailyUsage}
          onCancelSubscription={handleCancelSubscription}
          onResetApp={handleResetApp}
        />
      );
    }
  };

  return (
    <div className="flex h-[100dvh] bg-gray-100 overflow-hidden relative">
      {!storageStatus.local && (
        <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs px-4 py-1 z-[100] flex items-center justify-center gap-2">
           <AlertOctagon className="w-3 h-3" />
           <span>Cảnh báo: Trình duyệt đang chặn lưu trữ.</span>
        </div>
      )}

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      {/* Expiry and Limit Modals removed/disabled for Super VIP */}

      {fullScreenGameData && (
        <div className="fixed inset-0 z-50 bg-gray-100 animate-fade-in flex flex-col">
          <MiniGame 
             data={fullScreenGameData} 
             isFullScreenMode={true} 
             onCloseFullScreen={() => setFullScreenGameData(null)}
          />
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="absolute inset-0 bg-black/50 z-[45] md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-all duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>
        <Sidebar 
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewSession={handleNewSession}
          onSelectSession={(id) => { setCurrentSessionId(id); setIsMobileMenuOpen(false); }}
          onDeleteSession={handleDeleteSession}
          savedItems={savedItems}
          currentView={currentView}
          setCurrentView={(view) => { setCurrentView(view); setIsMobileMenuOpen(false); }}
          onOpenHelp={() => setIsHelpOpen(true)}
          unreadNotificationsCount={unreadCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      <div className="flex-1 flex flex-col h-full w-full min-w-0">
        {currentView !== 'chat' && (
          <div className="md:hidden h-14 bg-white border-b flex items-center px-4 justify-between flex-shrink-0">
             <span className="font-bold text-gray-800">VIP Tutor</span>
             <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-600">
               <Menu className="w-6 h-6" />
             </button>
          </div>
        )}
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
