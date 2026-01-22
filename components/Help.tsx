
import React from 'react';
import { COLORS } from '../constants';
import { UserRole } from '../types';
import { 
  Calendar, 
  CreditCard, 
  Users, 
  Bell, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Logo } from './Logo';

export const Help: React.FC<{ role: UserRole }> = ({ role }) => {
  const isManager = role === UserRole.MANAGER;

  const tools = [
    {
      title: 'Painel (Dashboard)',
      icon: <Sparkles className="text-[#88B04B]" />,
      content: 'O seu ponto de partida. Aqui você vê um resumo rápido da sua próxima aula, o status do seu último pagamento e avisos urgentes da Roberta. É o coração do seu Movimento Eficiente.',
      steps: [
        'Resumo inteligente das sessões.',
        'Acesso rápido ao seu perfil.',
        'Destaque para avisos de vencimento.'
      ]
    },
    {
      title: 'Agenda & Trocas',
      icon: <Calendar className="text-[#88B04B]" />,
      content: 'Imprevistos acontecem! Se você não puder vir em seu horário normal, pode solicitar uma troca diretamente aqui. Lembre-se de fazer com antecedência para que possamos liberar sua vaga para outro colega.',
      steps: [
        'Visualize o calendário semanal completo.',
        'Clique no seu horário para abrir a opção "Trocar Horário".',
        'Escolha uma nova data disponível e confirme.',
        'Aguarde a confirmação automática do sistema.'
      ]
    },
    {
      title: 'Financeiro & Pagamentos',
      icon: <CreditCard className="text-[#5D4037]" />,
      content: 'Mantenha sua saúde financeira tão em dia quanto sua coluna. Nesta aba, você confere o valor da sua mensalidade, a data de vencimento e se há pendências.',
      steps: [
        'Verifique pagamentos "LIQUIDADOS" e "PENDENTES".',
        'Confira o valor exato conforme seu plano (Mensal, Trimestral, etc).',
        'Veja a data de vencimento e evite multas de atraso.',
        'Administradores podem ajustar valores de planos aqui.'
      ]
    },
    {
      title: 'Central de Avisos',
      icon: <Bell className="text-[#7A302F]" />,
      content: 'Você nunca mais vai esquecer uma fatura ou uma aula. Nosso sistema de inteligência dispara lembretes em momentos cruciais.',
      steps: [
        '3 dias antes do vencimento: Lembrete preventivo.',
        '1 dia após o vencimento: Alerta de atraso.',
        'A cada 5 dias de atraso: Recobrança automática.',
        'Avisos de feriados e eventos do Studio.'
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full">
           <ShieldCheck size={16} style={{ color: COLORS.primary }} />
           <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Manual do Usuário ME Pilates</span>
        </div>
        <h2 className="text-4xl font-serif font-bold text-stone-800">Sua jornada guiada no App</h2>
        <p className="text-stone-500 max-w-lg mx-auto italic font-medium">
          Entenda como cada funcionalidade ajuda você a manter o foco no seu bem-estar.
        </p>
      </div>

      {/* Tools Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tools.map((tool, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-stone-100 flex flex-col hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center shadow-inner">
                {tool.icon}
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800">{tool.title}</h3>
            </div>
            
            <p className="text-stone-600 text-sm leading-relaxed mb-6">
              {tool.content}
            </p>

            <div className="mt-auto space-y-3">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Funcionalidades principais:</p>
              <div className="space-y-2">
                {tool.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-3 text-sm text-stone-500">
                    <CheckCircle2 size={16} className="text-[#88B04B] mt-0.5 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Specific FAQ for students */}
      <div className="bg-[#F9FBF4] p-10 rounded-[3rem] border border-stone-100">
        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-8 flex items-center gap-3">
          <AlertCircle className="text-[#7A302F]" /> Perguntas Frequentes
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 flex items-center gap-2">
              <Clock size={16} className="text-[#88B04B]" /> Como troco meu horário?
            </h4>
            <p className="text-sm text-stone-500 leading-relaxed">
              Vá na aba <strong>Agenda</strong>, localize sua aula e clique nela. O sistema mostrará as datas disponíveis para a semana. Selecione e confirme. A Roberta será notificada na hora!
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 flex items-center gap-2">
              <CreditCard size={16} className="text-[#5D4037]" /> Esqueci de pagar, e agora?
            </h4>
            <p className="text-sm text-stone-500 leading-relaxed">
              Não se preocupe! O App mostrará o status como <strong>PENDENTE</strong> ou <strong>EM ATRASO</strong> em vermelho. Você receberá lembretes via WhatsApp para regularizar e manter seu acesso ativo.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-12 bg-stone-900 rounded-[3.5rem] text-white relative overflow-hidden text-center md:text-left">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Logo className="h-48" variant="light" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <h4 className="text-3xl font-serif font-bold">Ainda tem dúvidas?</h4>
            <p className="opacity-70 text-sm max-w-md">O App foi criado para facilitar sua vida. Se algo não estiver claro, a Roberta está a um clique de distância no WhatsApp!</p>
          </div>
          <button className="flex items-center gap-3 px-10 py-5 bg-[#88B04B] rounded-[2rem] font-bold uppercase text-xs tracking-widest hover:brightness-110 transition-all shadow-2xl shrink-0">
             Falar com o Suporte <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
