import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Task } from '../types';

interface PomodoroTimerProps {
  task: Task;
  onClose: () => void;
}

export function PomodoroTimer({ task, onClose }: PomodoroTimerProps) {
  const { language } = useLanguage();
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // شغل الصوت
      new Audio('/alarm.mp3').play();

      // الإشعار إذا متفعل
      if (Notification.permission === 'granted') {
        new Notification('نماء | Namaa', {
          body: isBreak 
            ? (language === 'ar' ? 'انتهى وقت الراحة!' : 'Break time is over!')
            : (language === 'ar' ? 'حان وقت الراحة!' : 'Time for a break!'),
        });
      }

      // تغيير الوضع وإعادة ضبط الوقت
      setIsBreak(!isBreak);
      setTimeLeft((isBreak ? focusMinutes : breakMinutes) * 60);
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, focusMinutes, breakMinutes, language]);

  const toggleTimer = () => {
    if (!isRunning && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(focusMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = isBreak 
    ? ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100
    : ((focusMinutes * 60 - timeLeft) / (focusMinutes * 60)) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium truncate">{task.title}</div>
        <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-pomodoro">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="relative w-48 h-48 mx-auto">
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
            className={isBreak ? 'text-chart-2' : 'text-primary'}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {isBreak 
              ? t('tasks.pomodoro')
              : t('tasks.pomodoro')
            }
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          size="icon"
          variant="outline"
          onClick={toggleTimer}
          className="h-12 w-12"
          data-testid="button-toggle-timer"
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={resetTimer}
          className="h-12 w-12"
          data-testid="button-reset-timer"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {!isRunning && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t('tasks.pomodoro')}</Label>
            <Input
              type="number"
              value={focusMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 25;
                setFocusMinutes(val);
                if (!isBreak) setTimeLeft(val * 60);
              }}
              min="1"
              max="60"
              data-testid="input-focus-minutes"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('common.loading')}</Label>
            <Input
              type="number"
              value={breakMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 5;
                setBreakMinutes(val);
                if (isBreak) setTimeLeft(val * 60);
              }}
              min="1"
              max="30"
              data-testid="input-break-minutes"
            />
          </div>
        </div>
      )}
    </div>
  );
}
