
import React, { useEffect, useState } from 'react';
import { UserRole, PaymentStatus, Student, ClassSession, Payment } from '../types';
import { COLORS, STUDIO_INFO, ROBERTA_PHOTO_URL, ROBERTA_EXPRESSIVE_PHOTO_URL } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Users, Calendar, AlertCircle, CreditCard, Activity, BellRing, Heart, Sun, Moon, Coffee } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  role: UserRole;
  classes: ClassSession[];
  students: Student[];
  payments: Payment[];
  alerts: string[];
  currentStudentId?: string;
  onRemarcar: () => void;
  onUpdateStudent: (s: Student) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ role, classes, students, payments, alerts, currentStudentId }) => {
  const [summary, setSummary] = useState<string>('Personalizando seu espaço de saúde...');
  const currentStudent = students.find(s => s.id === currentStudentId) || students[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Bom dia', icon: <Coffee className="text-amber-500" size={24} /> };
    if (hour < 18) return { text: 'Boa tarde', icon: <Sun className="text-orange-400" size={24} /> };
    return { text: 'Boa noite', icon: <Moon className="text-indigo-400" size={24} /> };
  };

  const greeting = getGreeting();

  useEffect(() => {
    const fetchSummary = async () => {
      if (role === UserRole.MANAGER) {
        const text = await geminiService.summarizeSchedule(classes);
        setSummary(text);
      } else {
        setSummary('Olá! Estamos focados no seu Movimento Eficiente hoje. Menos dor, mais vida!');
      }
    };
    fetchSummary();
  }, [role, classes]);

  const stats = [
    { label: 'Alunos Ativos', value: students.length, icon: <Users size={20} />, color: COLORS.primary },
    { label: 'Sessões Hoje', value: classes.length, icon: <Activity size={20} />, color: COLORS.primary },
    { label: 'Avisos Pendentes', value: alerts.length, icon: <AlertCircle size={20} />, color: COLORS.brandRed },
    { label: 'Saldado (Mês)', value: `R$ ${(payments.filter(p => p.status === PaymentStatus.PAID).reduce((a, b) => a + b.amount, 0) / 1000).toFixed(1)}k`, icon: <TrendingUp size={20} />, color: COLORS.secondary },
  ];

  const chartData = [
    { name: 'Mar', value: 4800 },
    { name: 'Abr', value: 5200 },
    { name: 'Mai', value: payments.filter(p => p.status === PaymentStatus.PAID).reduce((a, b) => a + b.amount, 0) },
  ];

  if (role === UserRole.STUDENT) {
    const studentPayment = payments.find(p => p.studentId === currentStudent?.id);
    const studentClass = classes.find(c => c.studentId === currentStudent?.id);
    const hasWarning = alerts.some(a => a.includes(currentStudent?.name || ''));
    const isPaid = studentPayment?.status === PaymentStatus.PAID;

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {hasWarning && !isPaid && (
          <div className="flex items-center gap-4 p-5 bg-amber-50 border-2 rounded-[1.5rem] animate-pulse" style={{ borderColor: COLORS.accent }}>
            <BellRing className="text-amber-600" size={24} />
            <p className="text-sm font-bold text-amber-800">Lembrete: Sua fatura vence em breve. Regularize pelo link do financeiro! ✨</p>
          </div>
        )}

        {/* HERO DO ALUNO - APERTURA COM ROBERTA */}
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border-2 transition-all hover:shadow-2xl" style={{ borderColor: COLORS.secondary }}>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                <img src={ROBERTA_EXPRESSIVE_PHOTO_URL} alt="Roberta Chote" className="w-full h-full object-cover scale-110 object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#014140]/60 to-transparent md:hidden" />
            </div>
            <div className="md:w-2/3 p-10 flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-2 rounded-xl bg-emerald-50 text-[#3A8063]">{greeting.icon}</div>
                 <h2 className="text-3xl font-serif font-bold" style={{ color: COLORS.secondary }}>{greeting.text}, {currentStudent?.name}!</h2>
              </div>
              <p className="text-stone-600 font-medium italic">"Pronta para mais uma evolução no seu movimento hoje?" — Roberta Chote</p>
              <div className="flex flex-wrap gap-3 pt-2">
                 <span className="px-4 py-2 bg-stone-100 rounded-full text-[10px] font-bold text-stone-500 uppercase tracking-widest">Aluno VIP</span>
                 <span className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: COLORS.accent, color: COLORS.secondary }}>Plano Ativo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 hover:shadow-lg transition-all duration-500 group" style={{ borderColor: 'rgba(1, 64, 64, 0.15)' }}>
                <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLORS.secondary }}>
                    <Calendar size={20} style={{ color: COLORS.primary }} /> Próxima Sessão
                </h3>
                <div className="p-6 rounded-2xl border border-l-8 transition-transform group-hover:scale-[1.02]" style={{ backgroundColor: '#F9FBF4', borderLeftColor: COLORS.primary, borderColor: 'rgba(1, 64, 64, 0.1)' }}>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Confirmada</p>
                    <p className="text-xl font-bold text-stone-800">{studentClass ? `Hoje às ${studentClass.time}` : 'Sem aulas agendadas'}</p>
                    <p className="text-stone-600 font-medium mt-1">{STUDIO_INFO.address}</p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border-2 flex flex-col justify-between" style={{ borderColor: 'rgba(1, 64, 64, 0.15)' }}>
                <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2" style={{ color: COLORS.secondary }}>
                    <CreditCard size={20} style={{ color: COLORS.primary }} /> Financeiro
                </h3>
                <div className="p-7 rounded-[1.8rem] text-white relative overflow-hidden group shadow-xl transition-all" style={{ backgroundColor: isPaid ? COLORS.primary : COLORS.brandRed }}>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Valor Mensal</p>
                    <p className="text-3xl font-bold mt-1 font-serif">R$ {studentPayment?.amount.toFixed(2)}</p>
                    <div className="mt-8 flex items-center justify-between">
                        <div className="px-5 py-2.5 bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                           {isPaid ? 'Mês Liquidado' : 'Aguardando Pagamento'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HERO DA ROBERTA (ABERTURA DO APP) - MANAGER */}
      <div className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border-2 relative" style={{ borderColor: COLORS.secondary }}>
        <div className="flex flex-col md:flex-row h-full items-stretch">
          <div className="md:w-1/4 relative min-h-[300px] md:min-h-0">
             <img src={ROBERTA_EXPRESSIVE_PHOTO_URL} alt="Roberta" className="w-full h-full object-cover object-top scale-105" />
             <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
          </div>
          <div className="flex-1 p-12 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3">
               <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] bg-[#F5F7F6]" style={{ color: COLORS.secondary }}>Studio Manager</span>
               {greeting.icon}
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-serif font-bold" style={{ color: COLORS.secondary }}>{greeting.text}, Roberta!</h2>
              <p className="text-stone-500 font-medium italic text-lg leading-relaxed max-w-2xl">
                 "{summary}"
              </p>
            </div>
            <div className="pt-4 flex gap-4">
               <div className="flex items-center gap-2 px-6 py-3 bg-stone-50 rounded-2xl border" style={{ borderColor: COLORS.accent }}>
                  <Heart size={18} className="text-rose-500" fill="currentColor" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-700">{students.length} Alunos sob seus cuidados</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-sm border-2 hover:shadow-xl transition-all duration-500 group border-b-8" style={{ borderBottomColor: stat.color, borderColor: 'rgba(1, 64, 64, 0.15)' }}>
            <h3 className="text-stone-400 text-[9px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold text-stone-800 font-serif">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border-2" style={{ borderColor: 'rgba(1, 64, 64, 0.15)' }}>
          <h3 className="font-serif text-2xl font-bold text-stone-800 mb-10">Crescimento Financeiro</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#014140', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#014140', fontSize: 10, fontWeight: 700}} />
                <Tooltip cursor={{fill: '#FDFDFB'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? COLORS.primary : '#E7E5E4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border-2" style={{ borderColor: 'rgba(1, 64, 64, 0.15)' }}>
          <h3 className="font-serif text-2xl font-bold text-stone-800 mb-8">Próximos Alunos</h3>
          <div className="space-y-7">
            {classes.slice(0, 4).map(cls => (
              <div key={cls.id} className="flex items-center gap-5 group cursor-pointer transition-transform hover:translate-x-1">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 shadow-xl" style={{ borderColor: COLORS.secondary }}>
                  <img src={students.find(s => s.id === cls.studentId)?.photo || `https://i.pravatar.cc/150?u=${cls.studentId}`} alt={cls.studentName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-800 truncate group-hover:text-[#3A8063] transition-colors">{cls.studentName}</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{cls.time} — Pilates Clássico</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
