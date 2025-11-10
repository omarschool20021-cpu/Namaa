import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Common
    'app.name': 'Namaa',
    'app.tagline': 'Faith & Productivity Tracker',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.welcome': 'Welcome to Namaa',
    'auth.subtitle': 'Track your faith and productivity journey',
    'auth.hasAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.logout': 'Logout',
    
    // Navigation
    'nav.home': 'Home',
    'nav.tasks': 'Tasks',
    'nav.prayers': 'Prayers',
    'nav.quran': 'Quran',
    'nav.lessons': 'Lessons',
    'nav.weekly': 'Weekly',
    'nav.stats': 'Statistics',
    'nav.motivation': 'Motivation',
    'nav.alarms': 'Reminders',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.greeting': 'Peace be upon you,',
    'dashboard.intention': 'Daily Intention',
    'dashboard.intention.placeholder': 'What do you want to achieve today?',
    'dashboard.progress': 'Today\'s Progress',
    'dashboard.tasks': 'Tasks',
    'dashboard.prayers': 'Prayers',
    'dashboard.quran': 'Quran',
    'dashboard.lessons': 'Lessons',
    'dashboard.quote': 'Daily Inspiration',
    'dashboard.verse': 'Quranic Verse',
    'dashboard.reminders': 'Upcoming Reminders',
    'dashboard.no.reminders': 'No upcoming reminders',
    
    // Tasks
    'tasks.title': 'Welcome to your tasks,',
    'tasks.add': 'Add Task',
    'tasks.today': 'Today',
    'tasks.week': 'This Week',
    'tasks.priority': 'Priority',
    'tasks.priority.low': 'Low',
    'tasks.priority.medium': 'Medium',
    'tasks.priority.high': 'High',
    'tasks.pomodoro': 'Start Pomodoro',
    'tasks.completed': 'Completed',
    'tasks.pending': 'Pending',
    
    // Prayers
    'prayers.title': 'Time for your prayers,',
    'prayers.fajr': 'Fajr',
    'prayers.dhuhr': 'Dhuhr',
    'prayers.asr': 'Asr',
    'prayers.maghrib': 'Maghrib',
    'prayers.isha': 'Isha',
    'prayers.perfect': 'Perfect! All prayers completed today!',
    'prayers.keep': 'Keep up the good work!',
    
    // Quran
    'quran.title': 'Keep up your Quran reading,',
    'quran.goal': 'Set Your Goal',
    'quran.type': 'Goal Type',
    'quran.type.page': 'Pages',
    'quran.type.juz': 'Juz',
    'quran.type.quarter': 'Quarter',
    'quran.type.hizb': 'Hizb',
    'quran.quantity': 'Quantity',
    'quran.progress': 'Progress',
    'quran.complete': 'Completed!',
    
    // Lessons
    'lessons.title': 'Ready to learn,',
    'lessons.addDay': 'Add New Day',
    'lessons.focus': 'Focus',
    'lessons.interaction': 'Interaction',
    'lessons.homework': 'Homework',
    'lessons.mistakes': 'Mistake Reduction',
    'lessons.respect': 'Respect & Discipline',
    'lessons.weekly': 'Weekly Average',
    
    // Weekly
    'weekly.title': 'Here\'s your week at a glance,',
    'weekly.summary': 'Weekly Summary',
    'weekly.missing': 'Items Needing Attention',
    
    // Motivation
    'motivation.title': 'Your daily motivation,',
    'motivation.addQuote': 'Add Custom Quote',
    'motivation.quote.placeholder': 'Enter your motivational quote...',
    
    // Settings
    'settings.title': 'Welcome to settings,',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.language': 'Language',
    'settings.language.en': 'English',
    'settings.language.ar': 'العربية',
    'settings.fontSize': 'Font Size',
    'settings.fontSize.small': 'Small',
    'settings.fontSize.medium': 'Medium',
    'settings.fontSize.large': 'Large',
    'settings.backup': 'Backup Data',
    'settings.restore': 'Restore Data',
    'settings.reset': 'Reset All Data',
    'settings.reset.confirm': 'Are you sure? This will delete all your data.',
  },
  ar: {
    // Common
    'app.name': 'نماء',
    'app.tagline': 'متتبع الإيمان والإنتاجية',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.close': 'إغلاق',
    'common.confirm': 'تأكيد',
    'common.loading': 'جاري التحميل...',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.username': 'اسم المستخدم',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.welcome': 'مرحباً بك في نماء',
    'auth.subtitle': 'تتبع رحلتك الإيمانية والإنتاجية',
    'auth.hasAccount': 'هل لديك حساب بالفعل؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.logout': 'تسجيل الخروج',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.tasks': 'المهام',
    'nav.prayers': 'الصلوات',
    'nav.quran': 'القرآن',
    'nav.lessons': 'الدروس',
    'nav.weekly': 'أسبوعي',
    'nav.stats': 'الإحصائيات',
    'nav.motivation': 'التحفيز',
    'nav.alarms': 'التذكيرات',
    'nav.settings': 'الإعدادات',
    
    // Dashboard
    'dashboard.greeting': 'السلام عليكم،',
    'dashboard.intention': 'نية اليوم',
    'dashboard.intention.placeholder': 'ماذا تريد أن تحقق اليوم؟',
    'dashboard.progress': 'تقدم اليوم',
    'dashboard.tasks': 'المهام',
    'dashboard.prayers': 'الصلوات',
    'dashboard.quran': 'القرآن',
    'dashboard.lessons': 'الدروس',
    'dashboard.quote': 'إلهام اليوم',
    'dashboard.verse': 'آية قرآنية',
    'dashboard.reminders': 'التذكيرات القادمة',
    'dashboard.no.reminders': 'لا توجد تذكيرات قادمة',
    
    // Tasks
    'tasks.title': 'مرحباً بك في مهامك،',
    'tasks.add': 'إضافة مهمة',
    'tasks.today': 'اليوم',
    'tasks.week': 'هذا الأسبوع',
    'tasks.priority': 'الأولوية',
    'tasks.priority.low': 'منخفضة',
    'tasks.priority.medium': 'متوسطة',
    'tasks.priority.high': 'عالية',
    'tasks.pomodoro': 'بدء بومودورو',
    'tasks.completed': 'مكتملة',
    'tasks.pending': 'معلقة',
    
    // Prayers
    'prayers.title': 'حان وقت صلواتك،',
    'prayers.fajr': 'الفجر',
    'prayers.dhuhr': 'الظهر',
    'prayers.asr': 'العصر',
    'prayers.maghrib': 'المغرب',
    'prayers.isha': 'العشاء',
    'prayers.perfect': 'ممتاز! جميع الصلوات مكتملة اليوم!',
    'prayers.keep': 'استمر في العمل الجيد!',
    
    // Quran
    'quran.title': 'واصل قراءة القرآن،',
    'quran.goal': 'حدد هدفك',
    'quran.type': 'نوع الهدف',
    'quran.type.page': 'صفحات',
    'quran.type.juz': 'أجزاء',
    'quran.type.quarter': 'أرباع',
    'quran.type.hizb': 'أحزاب',
    'quran.quantity': 'الكمية',
    'quran.progress': 'التقدم',
    'quran.complete': 'مكتمل!',
    
    // Lessons
    'lessons.title': 'جاهز للتعلم،',
    'lessons.addDay': 'إضافة يوم جديد',
    'lessons.focus': 'التركيز',
    'lessons.interaction': 'التفاعل',
    'lessons.homework': 'الواجبات',
    'lessons.mistakes': 'تقليل الأخطاء',
    'lessons.respect': 'الاحترام والانضباط',
    'lessons.weekly': 'المتوسط الأسبوعي',
    
    // Weekly
    'weekly.title': 'نظرة سريعة على أسبوعك،',
    'weekly.summary': 'ملخص الأسبوع',
    'weekly.missing': 'العناصر التي تحتاج اهتمام',
    
    // Motivation
    'motivation.title': 'تحفيزك اليومي،',
    'motivation.addQuote': 'إضافة اقتباس',
    'motivation.quote.placeholder': 'أدخل اقتباسك التحفيزي...',
    
    // Settings
    'settings.title': 'مرحباً بك في الإعدادات،',
    'settings.theme': 'المظهر',
    'settings.theme.light': 'فاتح',
    'settings.theme.dark': 'داكن',
    'settings.language': 'اللغة',
    'settings.language.en': 'English',
    'settings.language.ar': 'العربية',
    'settings.fontSize': 'حجم الخط',
    'settings.fontSize.small': 'صغير',
    'settings.fontSize.medium': 'متوسط',
    'settings.fontSize.large': 'كبير',
    'settings.backup': 'نسخ احتياطي للبيانات',
    'settings.restore': 'استعادة البيانات',
    'settings.reset': 'إعادة تعيين جميع البيانات',
    'settings.reset.confirm': 'هل أنت متأكد؟ سيؤدي هذا إلى حذف جميع بياناتك.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('namaa-language');
    if (stored === 'en' || stored === 'ar') return stored;
    return 'en';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('namaa-language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguageState(prev => prev === 'en' ? 'ar' : 'en');
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
