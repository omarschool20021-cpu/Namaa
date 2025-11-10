import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { localStorageService } from '../lib/localStorage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function Statistics() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [taskData, setTaskData] = useState<any[]>([]);
  const [prayerData, setPrayerData] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = () => {
    if (!user) return;

    const last7Days: any[] = [];
    const prayerLast7Days: any[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayName = format(date, 'EEE');

      const tasks = localStorageService.getTasks(user.id).filter(t => t.dueDate === dateStr);
      const completedTasks = tasks.filter(t => t.completed).length;

      last7Days.push({
        day: dayName,
        completed: completedTasks,
        total: tasks.length,
      });

      const prayers = localStorageService.getPrayer(user.id, dateStr);
      const completedPrayers = [prayers.fajr, prayers.dhuhr, prayers.asr, prayers.maghrib, prayers.isha].filter(Boolean).length;

      prayerLast7Days.push({
        day: dayName,
        completed: completedPrayers,
      });
    }

    setTaskData(last7Days);
    setPrayerData(prayerLast7Days);
  };

  if (!user) return null;

  const totalTasks = taskData.reduce((acc, day) => acc + day.total, 0);
  const completedTasks = taskData.reduce((acc, day) => acc + day.completed, 0);
  const totalPrayers = prayerData.reduce((acc, day) => acc + day.completed, 0);

  const pieData = [
    { name: language === 'ar' ? 'مكتملة' : 'Completed', value: completedTasks },
    { name: language === 'ar' ? 'معلقة' : 'Pending', value: totalTasks - completedTasks },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('nav.stats')}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.tasks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('tasks.completed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{completedTasks}</div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.prayers')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalPrayers}/35</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('dashboard.tasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('dashboard.prayers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prayerData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis domain={[0, 5]} className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.tasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
