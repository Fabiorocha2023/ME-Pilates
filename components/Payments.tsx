
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { PaymentStatus, UserRole, Payment, PlanConfig } from '../types';
import { CreditCard, Send, CheckCircle, Plus, Settings2, DollarSign, X } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface PaymentsProps {
  payments: Payment[];
  role: UserRole;
  onTogglePayment: (id: string) => void;
  onAddPayment: (p: Payment) => void;
  plans: PlanConfig[];
  onUpdatePlans: (plans: PlanConfig[]) => void;
}

const Payments: React.FC<PaymentsProps> = ({ payments, role, onTogglePayment, onAddPayment, plans, onUpdatePlans }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localPlans, setLocalPlans] = useState<PlanConfig[]>(plans);

  const handleSavePlans = () => {
    onUpdatePlans(localPlans);
    setIsSettingsOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 border-t-8" style={{ borderTopColor: COLORS.primary }}>
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Saldado (Mês)</p>
          <p className="text-3xl font-bold text-stone-800 mt-2 font-serif">R$ {payments.filter(p => p.status === PaymentStatus.PAID).reduce((a, b) => a + b.amount, 0).toFixed(2)}</p>
        </div>
        {role === UserRole.MANAGER && (
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-stone-900 text-white p-8 rounded-[2rem] shadow-xl flex items-center justify-between hover:scale-[1.02] transition-transform"
          >
            <div className="text-left">
              <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Configurações</p>
              <p className="text-xl font-bold font-serif">Ajustar Preços</p>
            </div>
            <Settings2 size={32} className="opacity-40" />
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-8 border-b flex items-center justify-between bg-stone-50/20">
          <h3 className="font-serif text-2xl font-bold text-stone-800">Financeiro do Studio</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest">Aluno</th>
                <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">Valor</th>
                <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">Vencimento</th>
                <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="px-8 py-6"><p className="font-bold text-stone-800 text-sm">{payment.studentName}</p></td>
                  <td className="px-8 py-6 text-sm text-stone-700 font-bold text-center">R$ {payment.amount.toFixed(2)}</td>
                  <td className="px-8 py-6 text-center"><span className="text-[10px] text-stone-500 font-bold">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</span></td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold border ${payment.status === PaymentStatus.PAID ? 'bg-[#F1F8E9] text-[#88B04B]' : 'bg-[#7A302F] text-white'}`}>
                      {payment.status === PaymentStatus.PAID ? 'LIQUIDADO' : 'PENDENTE'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-3">
                      {role === UserRole.MANAGER && (
                        <button onClick={() => onTogglePayment(payment.id)} className="p-2.5 bg-[#F1F8E9] text-[#88B04B] rounded-xl"><CheckCircle size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-serif font-bold text-stone-800">Preços dos Planos</h3>
                <button onClick={() => setIsSettingsOpen(false)}><X /></button>
             </div>
             <div className="space-y-4">
                {localPlans.map((plan, idx) => (
                  <div key={plan.id} className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{plan.name}</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <input 
                        type="number" 
                        value={plan.price} 
                        onChange={e => {
                          const newPlans = [...localPlans];
                          newPlans[idx].price = parseFloat(e.target.value);
                          setLocalPlans(newPlans);
                        }}
                        className="w-full pl-10 pr-4 py-3 bg-stone-50 rounded-xl border border-stone-200 outline-none" 
                      />
                    </div>
                  </div>
                ))}
             </div>
             <button onClick={handleSavePlans} className="w-full py-4 rounded-2xl text-white font-bold uppercase tracking-widest shadow-lg" style={{ backgroundColor: COLORS.primary }}>Atualizar Sistema</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
