import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { localStorageService } from '../lib/localStorage';
import { LessonDay } from '../types';
import { Plus, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function Lessons() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [lessons, setLessons] = useState<LessonDay[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newLesson, setNewLesson] = useState({
    focus: 3,
    interaction: 3,
    homework: 3,
    mistakeReduction: 3,
    respectDiscipline: 3,
  });

  useEffect(() => {
    if (user) {
      loadLessons();
    }
  }, [user]);

  const loadLessons = () => {
    if (user) {
      const allLessons = localStorageService.getLessonDays(user.id);
      setLessons(allLessons.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const handleAddLesson = () => {
    if (!user) return;
    localStorageService.addLessonDay(user.id, {
      date: format(new Date(), 'yyyy-MM-dd'),
      ...newLesson,
      tasks: [],
    });
    setShowDialog(false);
    setNewLesson({
      focus: 3,
      interaction: 3,
      homework: 3,
      mistakeReduction: 3,
      respectDiscipline: 3,
    });
    loadLessons();
  };

  const metrics = [
    { key: 'focus' as const, label: t('lessons.focus') },
    { key: 'interaction' as const, label: t('lessons.interaction') },
    { key: 'homework' as const, label: t('lessons.homework') },
    { key: 'mistakeReduction' as const, label: t('lessons.mistakes') },
    { key: 'respectDiscipline' as const, label: t('lessons.respect') },
  ];

  const weeklyAverage = lessons.slice(0, 7).reduce((acc, lesson) => {
    metrics.forEach(m => {
      acc[m.key] = (acc[m.key] || 0) + lesson[m.key];
    });
    return acc;
  }, {} as Record<string, number>);

  const avgCount = Math.min(lessons.length, 7);
  if (avgCount > 0) {
    metrics.forEach(m => {
      weeklyAverage[m.key] = weeklyAverage[m.key] / avgCount;
    });
  }

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('lessons.title')} {user.name}
        </h1>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-lesson">
              <Plus className="h-4 w-4" />
              {t('lessons.addDay')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('lessons.addDay')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {metrics.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>{label}</Label>
                    <span className="text-sm font-medium text-primary">{newLesson[key]}/5</span>
                  </div>
                  <Slider
                    value={[newLesson[key]]}
                    onValueChange={([value]) => setNewLesson({ ...newLesson, [key]: value })}
                    min={1}
                    max={5}
                    step={1}
                    data-testid={`slider-${key}`}
                  />
                </div>
              ))}
              <Button onClick={handleAddLesson} className="w-full" data-testid="button-save-lesson">
                {t('common.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {avgCount > 0 && (
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('lessons.weekly')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {metrics.map(({ key, label }) => (
                <div key={key} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {weeklyAverage[key]?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {lessons.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {t('lessons.addDay')}
              </p>
            </CardContent>
          </Card>
        ) : (
          lessons.map((lesson) => (
            <Card key={lesson.id} className="shadow-md hover-elevate transition-all duration-200" data-testid={`card-lesson-${lesson.id}`}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(new Date(lesson.date), language === 'ar' ? 'd MMMM yyyy' : 'MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {metrics.map(({ key, label }) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-lg font-bold text-primary">{lesson[key]}/5</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
