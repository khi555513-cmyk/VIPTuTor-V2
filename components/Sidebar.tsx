
import React from 'react';
import { MessageSquare, Book, Clock, Plus, Trash2, HelpCircle, Bell, PenTool, ChevronLeft, ChevronRight, GraduationCap, Settings, Shield } from 'lucide-react';
import { SavedKnowledgeItem, ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  savedItems: SavedKnowledgeItem[];
  currentView: 'chat' | 'saved' | 'notifications' | 'test-prep' | 'profile';
  setCurrentView: (view: 'chat' | 'saved' | 'notifications' | 'test-prep' | 'profile') => void;
  onOpenHelp: () => void;
  unreadNotificationsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  currentSessionId, 
  onNewSession, 
  onSelectSession, 
  onDeleteSession,
  savedItems,
  currentView,
  setCurrentView,
  onOpenHelp,
  unreadNotificationsCount,
  isCollapsed,
  onToggleCollapse
}) => {

  const NavButton = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label, 
    badge 
  }: { 
    active: boolean; 
    onClick: () => void; 
    icon: any; 
    label: string; 
    badge?: number | React.ReactNode 
  }) => (
    <button 
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative group ${active ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 text-slate-400 hover:text-white'}`}
    >
      <div className={`${isCollapsed ? 'mx-auto' : ''}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
      </div>
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
      
      {/* Badge handling */}
      {badge && (
         isCollapsed ? (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
         ) : (
           typeof badge === 'number' ? (
             badge > 0 && <span className="ml-auto bg-slate-700 text-xs px-1.5 py-0.5 rounded-full">{badge}</span>
           ) : (
             <span className="ml-auto">{badge}</span>
           )
         )
      )}

      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700 hidden md:block">
          {label}
        </div>
      )}
    </button>
  );

  return (
    <div className={`bg-slate-900 text-slate-300 h-full flex flex-col border-r border-slate-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} max-w-[80vw]`}>
      
      {/* Brand area */}
      <div className={`h-14 md:h-16 flex items-center ${isCollapsed ? 'justify-center' : 'px-4 justify-between'} border-b border-slate-800 flex-shrink-0`}>
        {!isCollapsed ? (
          <div className="flex flex-col">
            <span className="font-bold text-xl text-white tracking-tight">VIP<span className="text-indigo-500">Tutor</span></span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5">© Harriss</span>
          </div>
        ) : (
          <div className="bg-indigo-600 p-1.5 rounded-lg">
             <GraduationCap className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button 
          onClick={onNewSession}
          title="New Chat"
          className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg transition-all font-medium shadow-lg shadow-indigo-900/20 active:scale-95 ${isCollapsed ? 'px-0' : 'px-4'}`}
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-4 md:space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
        
        <div className="space-y-1">
           {!isCollapsed && <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>}
           
           <NavButton 
             active={currentView === 'chat'} 
             onClick={() => setCurrentView('chat')} 
             icon={MessageSquare} 
             label="Chat" 
           />
           <NavButton 
             active={currentView === 'test-prep'} 
             onClick={() => setCurrentView('test-prep')} 
             icon={PenTool} 
             label="Test Prep System"
           />
           <NavButton 
             active={currentView === 'saved'} 
             onClick={() => setCurrentView('saved')} 
             icon={Book} 
             label="Knowledge Base"
             badge={savedItems.length}
           />
           <NavButton 
             active={currentView === 'notifications'} 
             onClick={() => setCurrentView('notifications')} 
             icon={Bell} 
             label="Notifications"
             badge={unreadNotificationsCount > 0 ? (
               <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                 {unreadNotificationsCount}
               </span>
             ) : undefined}
           />
        </div>

        {/* History */}
        <div className="space-y-1">
          {!isCollapsed && <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent History</p>}
          {isCollapsed && <div className="h-px bg-slate-800 my-2 mx-2"></div>}
          
          {sessions.slice().reverse().map(session => (
            <div 
              key={session.id}
              className={`group flex items-center gap-2 rounded-lg transition-colors w-full ${session.id === currentSessionId && currentView === 'chat' ? 'bg-slate-800 text-indigo-300' : 'hover:bg-slate-800/50'} ${isCollapsed ? 'justify-center p-2' : 'pr-2'}`}
            >
              <button
                onClick={() => {
                  onSelectSession(session.id);
                  setCurrentView('chat');
                }}
                title={session.title}
                className={`text-left text-sm truncate flex items-center gap-2 overflow-hidden ${isCollapsed ? 'w-auto' : 'flex-1 px-3 py-3'}`}
              >
                <Clock className="w-4 h-4 flex-shrink-0 opacity-50" />
                {!isCollapsed && <span className="truncate">{session.title}</span>}
              </button>
              
              {!isCollapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Toggle */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <NavButton 
           active={currentView === 'profile'} 
           onClick={() => setCurrentView('profile')} 
           icon={Settings} 
           label="Settings & Profile" 
        />
        <NavButton 
           active={false} 
           onClick={onOpenHelp} 
           icon={HelpCircle} 
           label="Help & Guide" 
        />

        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={onToggleCollapse}
          className="w-full hidden md:flex items-center justify-center p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
