
import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../constants';
import { Student, UserRole } from '../types';
import { Search, UserPlus, X, Camera, Edit2, Trash2, AlertCircle, Key, AlertTriangle, HeartOff, PartyPopper, MessageSquare, Mail } from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface StudentsProps {
  students: Student[];
  role: UserRole;
  currentStudentId: string;
  onAddStudent: (s: Student) => void;
  onUpdateStudent: (s: Student) => void;
  onRemoveStudent: (id: string) => void;
}

const Students: React.FC<StudentsProps> = ({ students, role, currentStudentId, onAddStudent, onUpdateStudent, onRemoveStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [successStudent, setSuccessStudent] = useState<Student | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [automationUrls, setAutomationUrls] = useState<{ wa: string; mail: string } | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    plan: 'Mensal - 1x/semana', 
    photo: '',
    password: '' 
  });

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const isManager = role === UserRole.MANAGER;

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const digitsOnly = formData.phone.replace(/\D/g, '');
    if (formData.phone.length > 0 && digitsOnly.length !== 11) {
        setPhoneError(`Use 11 dígitos: DDD + 9 + número`);
    } else {
        setPhoneError(null);
    }
  }, [formData.phone]);

  const sanitizePhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11 ? `55${cleaned}` : cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneError) return;

    if (editingStudent) {
      onUpdateStudent({ ...editingStudent, ...formData });
      setIsModalOpen(false);
    } else {
      const newStudent: Student = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        active: true,
        joinDate: new Date().toISOString().split('T')[0]
      };
      
      onAddStudent(newStudent);
      const baseUrl = window.location.origin + window.location.pathname;
      const accessLink = `${baseUrl}?studentId=${newStudent.id}`;
      const welcomeMsg = await geminiService.generateWelcomeMessage(newStudent.name, accessLink);
      const cleanPhone = sanitizePhoneNumber(newStudent.phone);
      
      setAutomationUrls({ 
        wa: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(welcomeMsg)}`, 
        mail: `mailto:${newStudent.email}?subject=Bem-vindo ao Studio&body=Acesse: ${accessLink}` 
      });
      setSuccessStudent(newStudent);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este aluno? Todos os registros de aulas e pagamentos serão excluídos.")) {
        onRemoveStudent(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: COLORS.secondary }} />
          <input 
            type="text" 
            placeholder="Buscar alunos..."
            className="w-full pl-12 pr-4 py-3 bg-white border rounded-2xl focus:outline-none focus:ring-1 transition-all text-sm font-medium"
            style={{ borderColor: 'rgba(1, 64, 64, 0.2)' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isManager && (
          <button 
            onClick={() => {
                setEditingStudent(null);
                setFormData({ name: '', email: '', phone: '', plan: 'Mensal - 1x/semana', photo: '', password: 'me' + Math.floor(1000 + Math.random() * 9000) });
                setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white shadow-xl hover:opacity-90 transition-opacity text-[10px] font-bold uppercase tracking-[0.2em]" 
            style={{ backgroundColor: COLORS.secondary }}
          >
            <UserPlus size={18} /> Novo Aluno
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden" style={{ borderColor: 'rgba(1, 64, 64, 0.15)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 border-b" style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest" style={{ color: COLORS.secondary }}>Membro</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-center" style={{ color: COLORS.secondary }}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'rgba(1, 64, 64, 0.05)' }}>
              {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                const canEdit = isManager || student.id === currentStudentId;
                return (
                  <tr key={student.id} className="hover:bg-[#F5F7F6] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-stone-100 overflow-hidden border-2 shadow-sm" style={{ borderColor: COLORS.secondary }}>
                          <img src={student.photo || `https://i.pravatar.cc/150?u=${student.id}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-stone-800 text-sm group-hover:text-[#3A8063] transition-colors">{student.name}</p>
                          <p className="text-[10px] text-stone-400 font-bold">{student.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        {canEdit && (
                          <button 
                            onClick={() => {
                              setEditingStudent(student);
                              setFormData({ 
                                name: student.name,
                                email: student.email,
                                phone: student.phone,
                                plan: student.plan,
                                photo: student.photo || '',
                                password: student.password || ''
                              });
                              setIsModalOpen(true);
                            }}
                            title="Editar"
                            className="p-2.5 bg-stone-50 rounded-xl border hover:bg-white transition-all" style={{ borderColor: 'rgba(1, 64, 64, 0.1)' }}>
                            <Edit2 size={16} style={{ color: COLORS.secondary }} />
                          </button>
                        )}
                        {isManager && (
                          <button 
                            onClick={() => handleDelete(student.id)}
                            title="Remover Aluno"
                            className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all"
                          >
                            <Trash2 size={16} className="text-rose-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              }) : (
                <tr>
                  <td colSpan={2} className="px-8 py-10 text-center text-stone-400 italic text-sm">Nenhum membro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border-2" style={{ borderColor: COLORS.secondary }}>
            {successStudent ? (
               <div className="p-12 text-center space-y-8">
                 <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: COLORS.accent, color: COLORS.secondary }}><PartyPopper size={40} /></div>
                 <h3 className="text-3xl font-serif font-bold text-stone-800">Membro Ativo!</h3>
                 <div className="grid grid-cols-1 gap-4 pt-4">
                   <a href={automationUrls?.wa} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg"><MessageSquare size={20} /> WhatsApp de Boas-vindas</a>
                 </div>
                 <button onClick={() => { setIsModalOpen(false); setSuccessStudent(null); }} className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pt-4">Fechar</button>
               </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-serif font-bold text-stone-800">{editingStudent ? 'Editar Perfil' : 'Novo Cadastro'}</h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-stone-400"><X size={24} /></button>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nome Completo</label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-2xl border outline-none text-stone-800" style={{ borderColor: 'rgba(1, 64, 64, 0.2)' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">E-mail</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 rounded-2xl border outline-none" style={{ borderColor: 'rgba(1, 64, 64, 0.2)' }} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">WhatsApp</label>
                      <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-3 rounded-2xl border outline-none" style={{ borderColor: phoneError ? COLORS.brandRed : 'rgba(1, 64, 64, 0.2)' }} />
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-4 rounded-2xl text-white font-bold uppercase tracking-[0.2em] shadow-xl hover:brightness-110 transition-all mt-4" style={{ backgroundColor: COLORS.secondary }}>
                  {editingStudent ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
