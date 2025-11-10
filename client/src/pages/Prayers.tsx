import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { localStorageService } from '../lib/localStorage';
import { Prayer } from '../types';
import { format } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';

export default function Prayers() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (user) {
      loadPrayer();
    }
  }, [user]);

  const loadPrayer = () => {
    if (user) {
      const todayPrayer = localStorageService.getPrayer(user.id, today);
      setPrayer(todayPrayer);
    }
  };

  const handleTogglePrayer = (prayerName: keyof Omit<Prayer, 'id' | 'userId' | 'date'>) => {
    if (!user || !prayer) return;

    const newValue = !prayer[prayerName];
    localStorageService.updatePrayer(user.id, today, {
      [prayerName]: newValue,
    });
    loadPrayer();
  };

  const prayerNames: Array<{ key: keyof Omit<Prayer, 'id' | 'userId' | 'date'>; nameKey: string }> = [
    { key: 'fajr', nameKey: 'prayers.fajr' },
    { key: 'dhuhr', nameKey: 'prayers.dhuhr' },
    { key: 'asr', nameKey: 'prayers.asr' },
    { key: 'maghrib', nameKey: 'prayers.maghrib' },
    { key: 'isha', nameKey: 'prayers.isha' },
  ];

  const completedPrayers = prayer 
    ? prayerNames.filter(p => prayer[p.key]).length 
    : 0;

  const allCompleted = completedPrayers === 5;

  if (!user || !prayer) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('prayers.title')} {user.name}
        </h1>
        <p className="text-muted-foreground mt-2">
          {format(new Date(), language === 'ar' ? 'EEEE, d MMMM yyyy' : 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      <Card className="shadow-lg">
        <CardContent className="py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
              <div className="text-3xl font-bold text-primary">{completedPrayers}/5</div>
            </div>
            <div className="text-lg text-muted-foreground">
              {t('prayers.perfect')}
            </div>
          </div>

          <div className="space-y-4">
            {prayerNames.map(({ key, nameKey }) => (
              <div
                key={key}
                className="flex items-center gap-4 p-4 rounded-lg hover-elevate transition-all duration-200 border"
                data-testid={`prayer-item-${key}`}
              >
                <Checkbox
                  checked={prayer[key]}
                  onCheckedChange={() => handleTogglePrayer(key)}
                  className="h-6 w-6"
                  data-testid={`checkbox-prayer-${key}`}
                />
                <div className="flex-1 flex items-center gap-3">
                  {prayer[key] ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                  <span className={`text-xl font-medium ${prayer[key] ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {t(nameKey)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {allCompleted && (
            <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center animate-in fade-in-0 zoom-in-95 duration-500">
              <div className="text-xl font-semibold text-primary mb-2">
                {t('prayers.perfect')}
              </div>
              <div className="text-muted-foreground">
                {t('prayers.keep')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
