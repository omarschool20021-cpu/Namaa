import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { localStorageService } from '../lib/localStorage';
import { WeeklyData } from '../types';
import { format, startOfWeek, addDays } from 'date-fns';
import { CheckCircle2, Circle, CalendarDays } from 'lucide-react';

export default function Weekly() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

  useEffect(() => {
    if (user) {
      loadWeeklyData();
    }
  }, [user]);

  const loadWeeklyData = () => {
    if (!user) return;

    const start = startOfWeek(new Date(), { weekStartsOn: 0 });
    const data: WeeklyData[] = [];

    for (let i = 0; i < 7; i++) {
      const date = addDays(start, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const tasks = localStorageService.getTasks(user.id).filter(t => t.dueDate === dateStr);
      const prayers = localStorageService.getPrayer(user.id, dateStr);
      const quranGoal = localStorageService.getQuranGoal(user.id);
      const quranProgress = quranGoal?.progress.filter(p => {
        return true;
      }).length || 0;
      const lessonDay = localStorageService.getLessonDays(user.id).find(l => l.date === dateStr);

      data.push({
        date: dateStr,
        tasks,
        prayers,
        quranProgress,
        lessonDay,
      });
    }

    setWeeklyData(data);
  };

  if (!user) return null;

  const completionStats = {
    tasks: weeklyData.reduce((acc, day) => acc + day.tasks.filter(t => t.completed).length, 0),
    totalTasks: weeklyData.reduce((acc, day) => acc + day.tasks.length, 0),
    prayers: weeklyData.reduce((acc, day) => {
      const completed = [day.prayers.fajr, day.prayers.dhuhr, day.prayers.asr, day.prayers.maghrib, day.prayers.isha].filter(Boolean).length;
      return acc + completed;
    }, 0),
    totalPrayers: 35,
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('weekly.title')} {user.name}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.tasks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {completionStats.tasks}/{completionStats.totalTasks}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.prayers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {completionStats.prayers}/{completionStats.totalPrayers}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.lessons')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {weeklyData.filter(d => d.lessonDay).length}/7
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.progress')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {Math.round((completionStats.tasks / Math.max(completionStats.totalTasks, 1)) * 100)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('weekly.summary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeklyData.map((day) => {
              const dayName = format(new Date(day.date), 'EEEE');
              const completedTasks = day.tasks.filter(t => t.completed).length;
              const totalTasks = day.tasks.length;
              const completedPrayers = [day.prayers.fajr, day.prayers.dhuhr, day.prayers.asr, day.prayers.maghrib, day.prayers.isha].filter(Boolean).length;

              return (
                <div key={day.date} className="border rounded-lg p-4 hover-elevate transition-all duration-200" data-testid={`weekly-day-${day.date}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold text-lg">{dayName}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(day.date), language === 'ar' ? 'd MMMM' : 'MMMM d')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-muted-foreground">{t('dashboard.tasks')}:</div>
                      <div className="text-sm font-bold">{completedTasks}/{totalTasks}</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-muted-foreground">{t('dashboard.prayers')}:</div>
                      <div className="text-sm font-bold">{completedPrayers}/5</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-muted-foreground">{t('dashboard.lessons')}:</div>
                      {day.lessonDay ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-muted-foreground">{t('dashboard.quran')}:</div>
                      {day.quranProgress > 0 ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
