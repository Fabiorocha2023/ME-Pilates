
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Students from './components/Students';
import Payments from './components/Payments';
import { Help } from './components/Help';
import { UserRole, Student, ClassSession, Payment, PaymentStatus, PlanConfig } from './types';
import { MOCK_STUDENTS, MOCK_CLASSES, MOCK_PAYMENTS, COLORS, INITIAL_PLANS } from './constants';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [role, setRole] = useState<UserRole>(UserRole.MANAGER);
  const [currentStudentId, setCurrentStudentId] = useState<string>('');
  
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('me_pilates_students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });
  
  const [classes, setClasses] = useState<ClassSession[]>(() => {
    const saved = localStorage.getItem('me_pilates_classes');
    return saved ? JSON.parse(saved) : MOCK_CLASSES;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('me_pilates_payments');
    return saved ? JSON.parse(saved) : MOCK_PAYMENTS;
  });

  const [plans, setPlans] = useState<PlanConfig[]>(() => {
    const saved = localStorage.getItem('me_pilates_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [alerts, setAlerts] = useState<string[]>([]);

  // Detect individual access link (e.g., ?studentId=123)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sId = params.get('studentId');
    if (sId) {
      const found = students.find(s => s.id === sId);
      if (found) {
        setRole(UserRole.STUDENT);
        setCurrentStudentId(sId);
        setActiveTab('dashboard');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [students]);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('me_pilates_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('me_pilates_classes', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('me_pilates_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('me_pilates_plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    const TODAY = new Date();
    TODAY.setHours(0, 0, 0, 0);
    
    const newAlerts: string[] = [];
    payments.forEach(p => {
      if (p.status !== PaymentStatus.PAID) {
        const dueDate = new Date(p.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffTime = dueDate.getTime() - TODAY.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 3) newAlerts.push(`Lembrete Preventivo: Fatura de ${p.studentName} vence em 3 dias.`);
        else if (diffDays === -1) newAlerts.push(`ALERTA DE ATRASO: Pagamento de ${p.studentName} venceu ontem.`);
        else if (diffDays < -1 && Math.abs(diffDays + 1) % 5 === 0) newAlerts.push(`RECOBRANÇA: Aluno ${p.studentName} está com ${Math.abs(diffDays)} dias de atraso.`);
      }
    });
    setAlerts(newAlerts);
  }, [payments]);

  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    const planPrice = plans.find(p => p.name === newStudent.plan)?.price || 0;
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const initialPayment: Payment = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: newStudent.id,
      studentName: newStudent.name,
      amount: planPrice,
      dueDate: nextMonth.toISOString().split('T')[0],
      status: PaymentStatus.PENDING
    };
    setPayments(prev => [...prev, initialPayment]);
  };

  const handleRemoveStudent = (id: string) => {
    // Exclui o aluno de todos os registros relacionados
    setStudents(prev => prev.filter(s => s.id !== id));
    setClasses(prev => prev.filter(c => c.studentId !== id));
    setPayments(prev => prev.filter(p => p.studentId !== id));
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleUpdatePlans = (newPlans: PlanConfig[]) => {
    setPlans(newPlans);
    alert('Valores atualizados com sucesso!');
  };

  const renderContent = () => {
    const studentUser = role === UserRole.STUDENT 
      ? (students.find(s => s.id === currentStudentId) || students.find(s => s.name === 'Marina Fontoura') || students[0])
      : null;

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard 
          role={role} 
          classes={classes} 
          students={students} 
          payments={payments} 
          alerts={alerts}
          currentStudentId={studentUser?.id || ''}
          onRemarcar={() => setActiveTab('calendar')}
          onUpdateStudent={handleUpdateStudent}
        />;
      case 'calendar':
        return <Calendar classes={classes} role={role} onReschedule={() => {}} />;
      case 'students':
        return <Students 
          students={students} 
          role={role} 
          currentStudentId={studentUser?.id || ''}
          onAddStudent={handleAddStudent} 
          onUpdateStudent={handleUpdateStudent}
          onRemoveStudent={handleRemoveStudent}
        />;
      case 'payments':
        return <Payments 
          payments={payments} 
          role={role} 
          onTogglePayment={(id) => setPayments(prev => prev.map(p => p.id === id ? {...p, status: p.status === PaymentStatus.PAID ? PaymentStatus.PENDING : PaymentStatus.PAID} : p))}
          onAddPayment={(p) => setPayments(prev => [...prev, p])}
          plans={plans}
          onUpdatePlans={handleUpdatePlans}
        />;
      case 'help':
        return <Help role={role} />;
      case 'notifications':
        return (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-stone-100 space-y-8">
            <h2 className="text-3xl font-serif font-bold text-stone-800 text-center">Alertas Inteligentes</h2>
            <div className="flex flex-col gap-4 max-w-2xl mx-auto">
               {alerts.length > 0 ? alerts.map((alert, idx) => (
                 <div key={idx} className="p-6 bg-white rounded-3xl border-l-8 shadow-sm flex items-center justify-between" 
                   style={{ borderLeftColor: alert.includes('ATRASO') ? COLORS.brandRed : COLORS.primary }}>
                    <p className="text-sm font-bold text-stone-800">{alert}</p>
                 </div>
               )) : (
                 <p className="text-center text-stone-400 italic font-medium">Não há pendências financeiras para hoje.</p>
               )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} role={role} setRole={(r) => { setRole(r); if (r === UserRole.MANAGER) setCurrentStudentId(''); }}>
      {renderContent()}
    </Layout>
  );
};

export default App;
