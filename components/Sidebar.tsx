
import React from 'react';
import { 
  LayoutDashboard, Send, Zap, MessageSquare, Users, Settings, 
  ShieldCheck, PieChart, Users2, Image as ImageIcon, BarChart3, Gift 
} from 'lucide-react';
import { UserPermission } from '../types';

interface SidebarProps {
  currentView: string;
  setView: (view: any) => void;
  permissions: UserPermission[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, permissions }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Início', icon: <LayoutDashboard size={20} />, perm: 'view_dashboard' },
    { id: 'chat', label: 'Omnichat IA', icon: <MessageSquare size={20} />, perm: 'manage_chat' },
    { id: 'media', label: 'Media Studio', icon: <ImageIcon size={20} />, perm: 'manage_media' },
    { id: 'leads', label: 'Meus Leads', icon: <Users size={20} />, perm: 'view_leads' },
    { id: 'reports', label: 'ROI & Vendas', icon: <BarChart3 size={20} />, perm: 'view_reports' },
    { id: 'affiliates', label: 'Afiliados', icon: <Gift size={20} />, perm: 'view_affiliates' },
    { id: 'omnipost', label: 'Multi-Post', icon: <Send size={20} />, perm: 'manage_posts' },
    { id: 'automations', label: 'Automações', icon: <Zap size={20} />, perm: 'manage_automations' },
    { id: 'team', label: 'Minha Equipe', icon: <Users2 size={20} />, perm: 'manage_team' },
  ];

  const filteredItems = menuItems.filter(item => permissions.includes(item.perm as UserPermission));

  return (
    <aside className="w-20 lg:w-64 bg-slate-900 flex flex-col transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
          <ShieldCheck size={24} />
        </div>
        <span className="font-bold text-xl hidden lg:block text-white tracking-tight">SocialFlow<span className="text-indigo-400">AI</span></span>
      </div>

      <nav className="flex-1 px-3 mt-6">
        <ul className="space-y-1">
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={currentView === item.id ? 'text-white' : 'group-hover:text-indigo-400 transition-colors'}>
                  {item.icon}
                </span>
                <span className="font-medium hidden lg:block">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        {permissions.includes('manage_settings') && (
          <button 
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group mb-2 ${
              currentView === 'settings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium hidden lg:block">Configurações API</span>
          </button>
        )}
      </div>
    </aside>
  );
};
