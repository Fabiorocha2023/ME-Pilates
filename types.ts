
export enum UserRole {
  MANAGER = 'MANAGER',
  STUDENT = 'STUDENT'
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE'
}

export interface PlanConfig {
  id: string;
  name: string;
  price: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  active: boolean;
  joinDate: string;
  photo?: string;
  password?: string; // Campo para senha de acesso individual
}

export interface ClassSession {
  id: string;
  studentId: string;
  studentName: string;
  instructor: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  lastReminderSent?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'PAYMENT' | 'SCHEDULE' | 'SYSTEM';
}
