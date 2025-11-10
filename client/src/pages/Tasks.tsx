import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { localStorageService } from '../lib/localStorage';
import { Task } from '../types';
import { Plus, Clock, Trash2, Flag } from 'lucide-react';
import { format, isToday, isThisWeek } from 'date-fns';
import { PomodoroTimer } from '../components/PomodoroTimer';

export default function Tasks() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'today' | 'week'>('today');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = () => {
    if (user) {
      const allTasks = localStorageService.getTasks(user.id);
      setTasks(allTasks);
    }
  };

  const handleAddTask = () => {
    if (!user || !newTaskTitle.trim()) return;

    localStorageService.addTask(user.id, {
      title: newTaskTitle,
      completed: false,
      priority: newTaskPriority,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
    });

    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setShowDialog(false);
    loadTasks();
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    if (!user) return;
    localStorageService.updateTask(user.id, taskId, { completed });
    loadTasks();
  };

  const handleDeleteTask = (taskId: string) => {
    if (!user) return;
    localStorageService.deleteTask(user.id, taskId);
    loadTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'today') {
      return task.dueDate ? isToday(new Date(task.dueDate)) : true;
    }
    return task.dueDate ? isThisWeek(new Date(task.dueDate)) : true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('tasks.title')} {user.name}
        </h1>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-task">
              <Plus className="h-4 w-4" />
              {t('tasks.add')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('tasks.add')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">{t('tasks.add')}</Label>
                <Input
                  id="task-title"
                  data-testid="input-task-title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder={t('tasks.add')}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('tasks.priority')}</Label>
                <Select value={newTaskPriority} onValueChange={(value: any) => setNewTaskPriority(value)}>
                  <SelectTrigger data-testid="select-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('tasks.priority.low')}</SelectItem>
                    <SelectItem value="medium">{t('tasks.priority.medium')}</SelectItem>
                    <SelectItem value="high">{t('tasks.priority.high')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddTask} className="w-full" data-testid="button-save-task">
                {t('common.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'today' ? 'default' : 'outline'}
          onClick={() => setFilter('today')}
          data-testid="button-filter-today"
        >
          {t('tasks.today')}
        </Button>
        <Button
          variant={filter === 'week' ? 'default' : 'outline'}
          onClick={() => setFilter('week')}
          data-testid="button-filter-week"
        >
          {t('tasks.week')}
        </Button>
      </div>

      {selectedTask && (
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {t('tasks.pomodoro')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PomodoroTimer task={selectedTask} onClose={() => setSelectedTask(null)} />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {t('common.loading')}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className="shadow-md hover-elevate transition-all duration-200" data-testid={`card-task-${task.id}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => handleToggleTask(task.id, checked as boolean)}
                    data-testid={`checkbox-task-${task.id}`}
                    className="h-6 w-6"
                  />
                  <div className="flex-1">
                    <div className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </div>
                    {task.dueDate && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                  <Flag className={`h-5 w-5 ${getPriorityColor(task.priority)}`} />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setSelectedTask(task)}
                    data-testid={`button-pomodoro-${task.id}`}
                  >
                    <Clock className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteTask(task.id)}
                    data-testid={`button-delete-${task.id}`}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
