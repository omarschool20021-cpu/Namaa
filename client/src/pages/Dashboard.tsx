import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { localStorageService } from '../lib/localStorage';
import { BookOpen, CheckCircle2, ListTodo, GraduationCap, Bell, Quote } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [intention, setIntention] = useState('');
  const [progress, setProgress] = useState({ tasks: 0, prayers: 0, quran: 0, lessons: 0 });
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (user) {
      const settings = localStorageService.getSettings(user.id);
      setIntention(settings.dailyIntention);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const tasks = localStorageService.getTasks(user.id);
      const todayTasks = tasks.filter(t => t.dueDate === today || !t.dueDate);
      const completedTasks = todayTasks.filter(t => t.completed).length;
      const taskProgress = todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0;
      
      const prayer = localStorageService.getPrayer(user.id, today);
      const completedPrayers = [prayer.fajr, prayer.dhuhr, prayer.asr, prayer.maghrib, prayer.isha].filter(Boolean).length;
      const prayerProgress = (completedPrayers / 5) * 100;
      
      const quranGoal = localStorageService.getQuranGoal(user.id);
      const quranProgress = quranGoal ? (quranGoal.progress.length / quranGoal.quantity) * 100 : 0;
      
      const quotes = localStorageService.getQuotes();
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote.text);
      
      setProgress({
        tasks: taskProgress,
        prayers: prayerProgress,
        quran: quranProgress,
        lessons: 0,
      });
    }
  }, [user]);

  const handleIntentionChange = (value: string) => {
    setIntention(value);
    if (user) {
      localStorageService.updateSettings(user.id, { dailyIntention: value });
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          {t('dashboard.greeting')} {user.name}
        </h1>
        <p className="text-muted-foreground">{format(new Date(), language === 'ar' ? 'EEEE, d MMMM yyyy' : 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{t('dashboard.intention')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={intention}
            onChange={(e) => handleIntentionChange(e.target.value)}
            placeholder={t('dashboard.intention.placeholder')}
            className="min-h-24 resize-none text-base"
            data-testid="textarea-intention"
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">{t('dashboard.progress')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.tasks')}</CardTitle>
              <ListTodo className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(progress.tasks)}%</div>
              <Progress value={progress.tasks} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.prayers')}</CardTitle>
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(progress.prayers)}%</div>
              <Progress value={progress.prayers} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.quran')}</CardTitle>
              <BookOpen className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(progress.quran)}%</div>
              <Progress value={progress.quran} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="shadow-md hover-elevate transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('dashboard.lessons')}</CardTitle>
              <GraduationCap className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{Math.round(progress.lessons)}%</div>
              <Progress value={progress.lessons} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{t('dashboard.quote')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg italic text-card-foreground leading-relaxed">{quote}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{t('dashboard.reminders')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.no.reminders')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
