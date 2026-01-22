
import React from 'react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  Bell, 
  LayoutDashboard,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { Student, ClassSession, Payment, PaymentStatus, PlanConfig } from './types';

// URLs das imagens originais enviadas pelo usuário
export const ROBERTA_PHOTO_URL = "https://i.postimg.cc/2ytYV5V3/roberta-oops.png";
export const ROBERTA_EXPRESSIVE_PHOTO_URL = "https://i.postimg.cc/2ytYV5V3/roberta-oops.png";
export const LOGO_IMAGE_URL = "https://i.postimg.cc/P5N8C0Yx/me-pilates-logo.png";

export const COLORS = {
  primary: '#5E7D43',    // Verde Oliva do Logo
  secondary: '#5D2A26',  // Marrom Terroso do Logo
  accent: '#DED8BE',     // Bege Oliva
  background: '#FFF5E9', // Creme Claro
  text: '#5D2A26',       // Marrom Profundo
  brandRed: '#7A302F',   // Vermelho Alerta
  softGreen: '#EBF2EE',
};

export const STUDIO_INFO = {
  address: 'Rua Carazinho, 299, Petrópolis, POA',
  phone: '(51) 98765-4321',
  instagram: '@mepilates.poa',
  slogan: 'Movimento Eficiente para fazer tudo que ama — sem dor!'
};

export const INITIAL_PLANS: PlanConfig[] = [
  { id: '1', name: 'Mensal - 1x/semana', price: 250 },
  { id: '2', name: 'Trimestral - 2x/semana', price: 420 },
  { id: '3', name: 'Fidelidade - 2x/semana', price: 380 },
  { id: '4', name: 'Anual - VIP', price: 650 },
];

export const MOCK_STUDENTS: Student[] = [
  { id: '1', name: 'Marina Fontoura', email: 'marina@me.com', phone: '(51) 98765-4321', plan: 'Fidelidade - 2x/semana', active: true, joinDate: '2023-10-15' },
  { id: '2', name: 'Ricardo Silveira', email: 'ricardo@me.com', phone: '(51) 91234-5678', plan: 'Trimestral - 2x/semana', active: true, joinDate: '2023-11-20' },
];

export const MOCK_CLASSES: ClassSession[] = [
  { id: 'c1', studentId: '1', studentName: 'Marina Fontoura', instructor: 'Roberta', date: '2024-05-20', time: '08:00', status: 'SCHEDULED' },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', studentId: '1', studentName: 'Marina Fontoura', amount: 380, dueDate: '2024-05-25', status: PaymentStatus.PENDING },
];

export const NAVIGATION = [
  { id: 'dashboard', label: 'Painel', icon: <LayoutDashboard size={20} />, roles: ['MANAGER', 'STUDENT'] },
  { id: 'help', label: 'Guia do Aluno', icon: <BookOpen size={20} />, roles: ['MANAGER', 'STUDENT'] },
  { id: 'calendar', label: 'Agenda', icon: <Calendar size={20} />, roles: ['MANAGER', 'STUDENT'] },
  { id: 'students', label: 'Comunidade', icon: <Users size={20} />, roles: ['MANAGER', 'STUDENT'] },
  { id: 'payments', label: 'Financeiro', icon: <CreditCard size={20} />, roles: ['MANAGER', 'STUDENT'] },
  { id: 'notifications', label: 'Avisos', icon: <Bell size={20} />, roles: ['MANAGER', 'STUDENT'] },
];
