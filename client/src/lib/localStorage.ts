import { Task, Prayer, QuranGoal, LessonDay, Reminder, Quote, UserSettings } from '../types';

const STORAGE_KEYS = {
  tasks: (userId: string) => `namaa-tasks-${userId}`,
  prayers: (userId: string) => `namaa-prayers-${userId}`,
  quran: (userId: string) => `namaa-quran-${userId}`,
  lessons: (userId: string) => `namaa-lessons-${userId}`,
  reminders: (userId: string) => `namaa-reminders-${userId}`,
  quotes: 'namaa-quotes',
  settings: (userId: string) => `namaa-settings-${userId}`,
};

export const localStorageService = {
  getTasks: (userId: string): Task[] => {
    const data = localStorage.getItem(STORAGE_KEYS.tasks(userId));
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (userId: string, tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEYS.tasks(userId), JSON.stringify(tasks));
  },

  addTask: (userId: string, task: Omit<Task, 'id' | 'userId' | 'createdAt'>): Task => {
    const tasks = localStorageService.getTasks(userId);
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      userId,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    localStorageService.saveTasks(userId, tasks);
    return newTask;
  },

  updateTask: (userId: string, taskId: string, updates: Partial<Task>) => {
    const tasks = localStorageService.getTasks(userId);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      localStorageService.saveTasks(userId, tasks);
    }
  },

  deleteTask: (userId: string, taskId: string) => {
    const tasks = localStorageService.getTasks(userId);
    localStorageService.saveTasks(userId, tasks.filter(t => t.id !== taskId));
  },

  getPrayer: (userId: string, date: string): Prayer => {
    const data = localStorage.getItem(STORAGE_KEYS.prayers(userId));
    const prayers: Prayer[] = data ? JSON.parse(data) : [];
    const existing = prayers.find(p => p.date === date);
    if (existing) return existing;
    
    const newPrayer: Prayer = {
      id: Date.now().toString(),
      userId,
      date,
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
    };
    prayers.push(newPrayer);
    localStorage.setItem(STORAGE_KEYS.prayers(userId), JSON.stringify(prayers));
    return newPrayer;
  },

  updatePrayer: (userId: string, date: string, updates: Partial<Omit<Prayer, 'id' | 'userId' | 'date'>>) => {
    const data = localStorage.getItem(STORAGE_KEYS.prayers(userId));
    const prayers: Prayer[] = data ? JSON.parse(data) : [];
    const index = prayers.findIndex(p => p.date === date);
    if (index !== -1) {
      prayers[index] = { ...prayers[index], ...updates };
    } else {
      prayers.push({
        id: Date.now().toString(),
        userId,
        date,
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
        ...updates,
      });
    }
    localStorage.setItem(STORAGE_KEYS.prayers(userId), JSON.stringify(prayers));
  },

  getQuranGoal: (userId: string): QuranGoal | null => {
    const data = localStorage.getItem(STORAGE_KEYS.quran(userId));
    return data ? JSON.parse(data) : null;
  },

  saveQuranGoal: (userId: string, goal: Omit<QuranGoal, 'id' | 'userId' | 'createdAt' | 'progress'>) => {
    const quranGoal: QuranGoal = {
      ...goal,
      id: Date.now().toString(),
      userId,
      progress: [],
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.quran(userId), JSON.stringify(quranGoal));
    return quranGoal;
  },

  updateQuranProgress: (userId: string, progress: number[]) => {
    const goal = localStorageService.getQuranGoal(userId);
    if (goal) {
      goal.progress = progress;
      localStorage.setItem(STORAGE_KEYS.quran(userId), JSON.stringify(goal));
    }
  },

  getLessonDays: (userId: string): LessonDay[] => {
    const data = localStorage.getItem(STORAGE_KEYS.lessons(userId));
    return data ? JSON.parse(data) : [];
  },

  addLessonDay: (userId: string, lesson: Omit<LessonDay, 'id' | 'userId'>): LessonDay => {
    const lessons = localStorageService.getLessonDays(userId);
    const newLesson: LessonDay = {
      ...lesson,
      id: Date.now().toString(),
      userId,
    };
    lessons.push(newLesson);
    localStorage.setItem(STORAGE_KEYS.lessons(userId), JSON.stringify(lessons));
    return newLesson;
  },

  updateLessonDay: (userId: string, lessonId: string, updates: Partial<LessonDay>) => {
    const lessons = localStorageService.getLessonDays(userId);
    const index = lessons.findIndex(l => l.id === lessonId);
    if (index !== -1) {
      lessons[index] = { ...lessons[index], ...updates };
      localStorage.setItem(STORAGE_KEYS.lessons(userId), JSON.stringify(lessons));
    }
  },

  getReminders: (userId: string): Reminder[] => {
    const data = localStorage.getItem(STORAGE_KEYS.reminders(userId));
    return data ? JSON.parse(data) : [];
  },

  addReminder: (userId: string, reminder: Omit<Reminder, 'id' | 'userId'>): Reminder => {
    const reminders = localStorageService.getReminders(userId);
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      userId,
    };
    reminders.push(newReminder);
    localStorage.setItem(STORAGE_KEYS.reminders(userId), JSON.stringify(reminders));
    return newReminder;
  },

  deleteReminder: (userId: string, reminderId: string) => {
    const reminders = localStorageService.getReminders(userId);
    localStorage.setItem(STORAGE_KEYS.reminders(userId), JSON.stringify(reminders.filter(r => r.id !== reminderId)));
  },

  getQuotes: (): Quote[] => {
    const data = localStorage.getItem(STORAGE_KEYS.quotes);
    const defaultQuotes: Quote[] = [
      { id: '1', text: 'The best among you are those who have the best manners and character.', author: 'Prophet Muhammad (PBUH)', category: 'faith', isCustom: false },
      { id: '2', text: 'Verily, with hardship comes ease.', author: 'Quran 94:6', category: 'faith', isCustom: false },
      { id: '3', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'productivity', isCustom: false },
      { id: '4', text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', category: 'productivity', isCustom: false },
    ];
    return data ? JSON.parse(data) : defaultQuotes;
  },

  addQuote: (quote: Omit<Quote, 'id'>): Quote => {
    const quotes = localStorageService.getQuotes();
    const newQuote: Quote = {
      ...quote,
      id: Date.now().toString(),
    };
    quotes.push(newQuote);
    localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
    return newQuote;
  },

  getSettings: (userId: string): UserSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.settings(userId));
    const defaultSettings: UserSettings = {
      userId,
      theme: 'light',
      language: 'en',
      fontSize: 'medium',
      dailyIntention: '',
    };
    return data ? JSON.parse(data) : defaultSettings;
  },

  updateSettings: (userId: string, updates: Partial<UserSettings>) => {
    const settings = localStorageService.getSettings(userId);
    const newSettings = { ...settings, ...updates };
    localStorage.setItem(STORAGE_KEYS.settings(userId), JSON.stringify(newSettings));
    return newSettings;
  },

  exportData: (userId: string) => {
    return {
      tasks: localStorageService.getTasks(userId),
      prayers: localStorage.getItem(STORAGE_KEYS.prayers(userId)),
      quran: localStorageService.getQuranGoal(userId),
      lessons: localStorageService.getLessonDays(userId),
      reminders: localStorageService.getReminders(userId),
      settings: localStorageService.getSettings(userId),
    };
  },

  importData: (userId: string, data: any) => {
    if (data.tasks) localStorageService.saveTasks(userId, data.tasks);
    if (data.prayers) localStorage.setItem(STORAGE_KEYS.prayers(userId), data.prayers);
    if (data.quran) localStorage.setItem(STORAGE_KEYS.quran(userId), JSON.stringify(data.quran));
    if (data.lessons) localStorage.setItem(STORAGE_KEYS.lessons(userId), JSON.stringify(data.lessons));
    if (data.reminders) localStorage.setItem(STORAGE_KEYS.reminders(userId), JSON.stringify(data.reminders));
    if (data.settings) localStorage.setItem(STORAGE_KEYS.settings(userId), JSON.stringify(data.settings));
  },

  resetAllData: (userId: string) => {
    localStorage.removeItem(STORAGE_KEYS.tasks(userId));
    localStorage.removeItem(STORAGE_KEYS.prayers(userId));
    localStorage.removeItem(STORAGE_KEYS.quran(userId));
    localStorage.removeItem(STORAGE_KEYS.lessons(userId));
    localStorage.removeItem(STORAGE_KEYS.reminders(userId));
    localStorage.removeItem(STORAGE_KEYS.settings(userId));
  },
};
