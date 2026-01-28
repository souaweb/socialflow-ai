
import React, { useState, useEffect } from 'react';
import { User, UserPermission } from '../types';
import { dbService } from '../services/dbService';
import { Users2, UserPlus, Shield, ShieldAlert, Trash2, Mail, Check, X, ShieldCheck } from 'lucide-react';

interface TeamManagementProps {
  businessId: string;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ businessId }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [selectedPerms, setSelectedPerms] = useState<UserPermission[]>(['view_dashboard']);

  useEffect(() => {
    setMembers(dbService.getTeamMembers(businessId));
  }, [businessId]);

  const permissionsList: { id: UserPermission, label: string, desc: string }[] = [
    { id: 'view_dashboard', label: 'Ver Dashboard', desc: 'Acesso aos gráficos e estatísticas gerais.' },
    { id: 'manage_posts', label: 'Gerenciar Posts', desc: 'Pode criar e agendar publicações multi-rede.' },
    { id: 'manage_chat', label: 'Operar Chat', desc: 'Acesso ao Omnichat para responder clientes.' },
    { id: 'view_leads', label: 'Ver Leads', desc: 'Pode visualizar e gerenciar o CRM de Leads.' },
    { id: 'manage_automations', label: 'Configurar Automações', desc: 'Acesso ao treinamento da IA e gatilhos.' },
    { id: 'manage_team', label: 'Gerir Equipe', desc: 'Pode adicionar ou remover outros membros.' },
    { id: 'manage_settings', label: 'Configurações API', desc: 'Acesso às chaves secretas e webhooks.' },
  ];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = dbService.addTeamMember(businessId, newMember.name, newMember.email, selectedPerms);
    setMembers(updated);
    setNewMember({ name: '', email: '' });
    setShowAddModal(false);
  };

  const togglePerm = (perm: UserPermission) => {
    setSelectedPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><Users2 size={28} /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Minha Equipe</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Gerencie acessos e permissões do seu negócio</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
        >
          <UserPlus size={20} /> Adicionar Membro
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Membro</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Acessos Ativos</th>
              <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {members.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-8 py-20 text-center">
                   <p className="text-slate-400 text-sm">Ainda não há outros membros neste negócio.</p>
                </td>
              </tr>
            ) : (
              members.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 uppercase">{member.name[0]}</div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{member.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12}/> {member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {member.permissions.map(p => (
                        <span key={p} className="bg-indigo-50 text-indigo-600 text-[9px] px-2 py-0.5 rounded-full font-black uppercase border border-indigo-100">
                          {p.replace('manage_', '').replace('view_', '').replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setMembers(dbService.deleteTeamMember(member.id, businessId))}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><UserPlus /> Novo Membro</h2>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Defina as permissões de acesso</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors"><X /></button>
            </div>
            
            <form onSubmit={handleAddMember} className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Nome Completo</label>
                  <input required value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">E-mail de Acesso</label>
                  <input required type="email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase px-1 block mb-4">Selecione as Permissões</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {permissionsList.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => togglePerm(p.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${selectedPerms.includes(p.id) ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${selectedPerms.includes(p.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200'}`}>
                        {selectedPerms.includes(p.id) && <Check size={14} />}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${selectedPerms.includes(p.id) ? 'text-indigo-700' : 'text-slate-800'}`}>{p.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1 leading-tight">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <Check size={20}/> Convidar para Equipe
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
