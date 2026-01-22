
import React, { useState } from 'react';
import { COLORS } from '../constants';
import { UserRole, ClassSession } from '../types';
import { ChevronLeft, ChevronRight, Plus, Clock, User, Repeat, X } from 'lucide-react';

interface CalendarProps {
  classes: ClassSession[];
  role: UserRole;
  onReschedule: (id: string, date: string, time: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ classes, role, onReschedule }) => {
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const hours = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden flex flex-col h-full min-h-[700px]" style={{ borderColor: 'rgba(1, 64, 64, 0.15)' }}>
      <div className="p-8 border-b flex flex-col md:flex-row items-center justify-between bg-white sticky top-0 z-10 gap-4" style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}>
        <div className="flex items-center gap-6">
          <h3 className="text-3xl font-serif font-bold" style={{ color: COLORS.secondary }}>Maio, 2024</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-stone-50 rounded-xl transition-all" style={{ color: COLORS.secondary }}><ChevronLeft size={20} /></button>
            <button className="p-2 hover:bg-stone-50 rounded-xl transition-all" style={{ color: COLORS.secondary }}><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white shadow-xl hover:opacity-90 transition-all text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: COLORS.secondary }}>
                <Plus size={18} /> Novo Horário
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-[120px_repeat(6,1fr)] bg-stone-50/30">
            <div className="h-16 border-b" style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}></div>
            {days.map((day, idx) => (
              <div key={day} className="h-16 flex flex-col items-center justify-center border-l border-b" style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.primary }}>{day}</span>
                <span className="text-lg font-serif font-bold" style={{ color: COLORS.secondary }}>{20 + idx}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-[120px_repeat(6,1fr)] border-b h-32 group" style={{ borderColor: 'rgba(1, 64, 64, 0.08)' }}>
                <div className="flex items-start justify-center pt-5 text-[11px] font-bold" style={{ color: COLORS.secondary }}>
                  {hour}
                </div>
                {days.map((_, dayIdx) => {
                  const dayDate = `2024-05-${20 + dayIdx}`;
                  const session = classes.find(c => c.time === hour && c.date === dayDate);
                  
                  return (
                    <div key={dayIdx} className="border-l relative group-hover:bg-stone-50/20 transition-colors" style={{ borderColor: 'rgba(1, 64, 64, 0.08)' }}>
                      {session && (
                        <div className="absolute inset-2 p-4 bg-white border rounded-2xl shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all border-l-8" style={{ borderLeftColor: COLORS.primary, borderColor: 'rgba(1, 64, 64, 0.15)' }}>
                          <p className="text-xs font-bold text-stone-800 truncate mb-1">{session.studentName}</p>
                          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest mt-1" style={{ color: COLORS.secondary }}>
                            <Clock size={12} /> {session.time}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
