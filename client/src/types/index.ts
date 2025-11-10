export interface User {
  id: string;
  username: string;
  name: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export interface Prayer {
  id: string;
  userId: string;
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export type QuranGoalType = 'page' | 'juz' | 'quarter' | 'hizb';

export interface QuranGoal {
  id: string;
  userId: string;
  type: QuranGoalType;
  quantity: number;
  progress: number[];
  createdAt: string;
}

export interface LessonDay {
  id: string;
  userId: string;
  date: string;
  focus: number;
  interaction: number;
  homework: number;
  mistakeReduction: number;
  respectDiscipline: number;
  tasks: string[];
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  time: string;
  repeat: 'none' | 'daily' | 'weekly';
  type: 'task' | 'prayer' | 'lesson' | 'other';
  enabled: boolean;
}

export interface Quote {
  id: string;
  text: string;
  author?: string;
  category: 'faith' | 'productivity' | 'custom';
  isCustom: boolean;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark';
  language: 'en' | 'ar';
  fontSize: 'small' | 'medium' | 'large';
  dailyIntention: string;
}

export interface DailyProgress {
  tasks: number;
  prayers: number;
  quran: number;
  lessons: number;
}

export interface WeeklyData {
  date: string;
  tasks: Task[];
  prayers: Prayer;
  quranProgress: number;
  lessonDay?: LessonDay;
}
