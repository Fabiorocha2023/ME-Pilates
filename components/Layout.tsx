
import React, { useState } from 'react';
import { UserRole } from '../types';
import { NAVIGATION, COLORS, STUDIO_INFO, ROBERTA_PHOTO_URL } from '../constants';
import { LogOut, Menu, User, Bell } from 'lucide-react';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, role, setRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const filteredNav = NAVIGATION.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.background }}>
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl md:shadow-none border-r transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}>
        <div className="flex flex-col h-full">
          <div className="p-8 pb-2 flex flex-col items-center">
            <Logo className="h-10 mb-2 w-full" variant="dark" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: COLORS.secondary }}>Estúdio de Pilates</p>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNav.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                  ${activeTab === item.id 
                    ? `bg-[#F5F7F6] text-stone-900 border` 
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-700'}
                `}
                style={{ 
                  borderColor: activeTab === item.id ? COLORS.secondary : 'transparent',
                  color: activeTab === item.id ? COLORS.secondary : 'inherit'
                }}
              >
                <div style={{ color: activeTab === item.id ? COLORS.primary : 'inherit' }}>
                    {item.icon}
                </div>
                <span className={`text-sm ${activeTab === item.id ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t space-y-3" style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}>
             <div className="flex items-center gap-3 p-3 rounded-2xl border" style={{ backgroundColor: '#FBFBFB', borderColor: 'rgba(1, 64, 64, 0.1)' }}>
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden border-2" style={{ borderColor: COLORS.secondary }}>
                    {role === UserRole.MANAGER ? (
                      <img src={ROBERTA_PHOTO_URL} className="w-full h-full object-cover scale-110 object-top" alt="Roberta" />
                    ) : (
                      <div className="bg-stone-100 w-full h-full flex items-center justify-center"><User size={20} className="text-stone-400" /></div>
                    )}
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold truncate" style={{ color: COLORS.secondary }}>{role === UserRole.MANAGER ? 'Roberta Chote' : 'Área do Aluno'}</p>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">{role === UserRole.MANAGER ? 'Proprietária' : 'Acesso VIP'}</p>
                </div>
             </div>
             
             <button 
                onClick={() => setRole(role === UserRole.MANAGER ? UserRole.STUDENT : UserRole.MANAGER)}
                className="w-full text-[9px] uppercase font-bold tracking-widest text-center py-2 text-stone-400 hover:text-stone-600 border rounded-lg transition-colors"
                style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}
              >
                Trocar para {role === UserRole.MANAGER ? 'Aluno' : 'Admin'}
             </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-30" style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}>
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-stone-600"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Logo className="h-6 hidden md:block" variant="dark" />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-stone-400 hover:text-stone-600 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full absolute top-2.5 right-2.5 border border-white" style={{ backgroundColor: COLORS.primary }} />
                <Bell size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
