import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { localStorageService } from '../lib/localStorage';
import { QuranGoal, QuranGoalType } from '../types';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function Quran() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [goal, setGoal] = useState<QuranGoal | null>(null);
  const [goalType, setGoalType] = useState<QuranGoalType>('page');
  const [quantity, setQuantity] = useState(10);
  const [showSetup, setShowSetup] = useState(true);

  useEffect(() => {
    if (user) {
      const existingGoal = localStorageService.getQuranGoal(user.id);
      if (existingGoal) {
        setGoal(existingGoal);
        setShowSetup(false);
      }
    }
  }, [user]);

  const handleSetGoal = () => {
    if (!user) return;
    const newGoal = localStorageService.saveQuranGoal(user.id, { type: goalType, quantity });
    setGoal(newGoal);
    setShowSetup(false);
  };

  const handleToggleProgress = (index: number) => {
    if (!user || !goal) return;
    const newProgress = [...goal.progress];
    const idx = newProgress.indexOf(index);
    if (idx > -1) {
      newProgress.splice(idx, 1);
    } else {
      newProgress.push(index);
    }
    localStorageService.updateQuranProgress(user.id, newProgress);
    setGoal({ ...goal, progress: newProgress });
  };

  const resetGoal = () => {
    setShowSetup(true);
    setGoal(null);
  };

  if (!user) return null;

  const completionPercentage = goal ? (goal.progress.length / goal.quantity) * 100 : 0;
  const isComplete = goal && goal.progress.length === goal.quantity;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('quran.title')} {user.name}
        </h1>
        {goal && !showSetup && (
          <Button variant="outline" onClick={resetGoal} data-testid="button-reset-goal">
            {t('quran.goal')}
          </Button>
        )}
      </div>

      {showSetup || !goal ? (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {t('quran.goal')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>{t('quran.type')}</Label>
              <Select value={goalType} onValueChange={(value: QuranGoalType) => setGoalType(value)}>
                <SelectTrigger data-testid="select-goal-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page">{t('quran.type.page')}</SelectItem>
                  <SelectItem value="juz">{t('quran.type.juz')}</SelectItem>
                  <SelectItem value="quarter">{t('quran.type.quarter')}</SelectItem>
                  <SelectItem value="hizb">{t('quran.type.hizb')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('quran.quantity')}</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max="604"
                data-testid="input-quantity"
                className="h-12"
              />
            </div>

            <Button onClick={handleSetGoal} className="w-full" data-testid="button-set-goal">
              {t('common.save')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-lg">
            <CardContent className="py-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 mb-4">
                  <div className="text-4xl font-bold text-primary">{Math.round(completionPercentage)}%</div>
                </div>
                <div className="text-xl font-medium">
                  {goal.progress.length} / {goal.quantity} {t(`quran.type.${goal.type}`)}
                </div>
              </div>

              {isComplete && (
                <div className="p-6 bg-primary/10 rounded-lg text-center mb-6 animate-in fade-in-0 zoom-in-95 duration-500">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-3" />
                  <div className="text-xl font-semibold text-primary">
                    {t('quran.complete')}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>{t('quran.progress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {Array.from({ length: goal.quantity }, (_, i) => (
                  <div
                    key={i}
                    className="aspect-square flex items-center justify-center border rounded-lg hover-elevate transition-all duration-200 cursor-pointer"
                    onClick={() => handleToggleProgress(i)}
                    data-testid={`quran-item-${i}`}
                  >
                    <Checkbox
                      checked={goal.progress.includes(i)}
                      className="h-5 w-5 pointer-events-none"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
