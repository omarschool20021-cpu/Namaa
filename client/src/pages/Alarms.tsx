import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { localStorageService } from '../lib/localStorage';
import { Reminder } from '../types';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Alarms() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '09:00',
    repeat: 'none' as 'none' | 'daily' | 'weekly',
    type: 'other' as 'task' | 'prayer' | 'lesson' | 'other',
    enabled: true,
  });

  useEffect(() => {
    if (user) {
      loadReminders();
      requestNotificationPermission();
    }
  }, [user]);

  useEffect(() => {
    if (user && reminders.length > 0) {
      scheduleNotifications();
    }
  }, [reminders, user]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const loadReminders = () => {
    if (user) {
      const allReminders = localStorageService.getReminders(user.id);
      setReminders(allReminders);
    }
  };

  const scheduleNotifications = () => {
    reminders.forEach(reminder => {
      if (!reminder.enabled) return;

      const [hours, minutes] = reminder.time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

      if (scheduledTime > now) {
        const timeUntil = scheduledTime.getTime() - now.getTime();
        setTimeout(() => {
          showNotification(reminder);
        }, timeUntil);
      }
    });
  };

  const showNotification = (reminder: Reminder) => {
    if (Notification.permission === 'granted') {
      new Notification('نماء | Namaa', {
        body: reminder.title,
        icon: '/favicon.png',
        tag: reminder.id,
      });
    }
  };

  const handleAddReminder = () => {
    if (!user || !newReminder.title.trim()) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    localStorageService.addReminder(user.id, newReminder);
    setNewReminder({
      title: '',
      time: '09:00',
      repeat: 'none',
      type: 'other',
      enabled: true,
    });
    setShowDialog(false);
    loadReminders();
    
    toast({
      title: language === 'ar' ? 'نجح' : 'Success',
      description: language === 'ar' ? 'تمت إضافة التذكير' : 'Reminder added successfully',
    });
  };

  const handleToggleReminder = (reminderId: string, enabled: boolean) => {
    if (!user) return;
    const updatedReminders = reminders.map(r => 
      r.id === reminderId ? { ...r, enabled } : r
    );
    setReminders(updatedReminders);
  };

  const handleDeleteReminder = (reminderId: string) => {
    if (!user) return;
    localStorageService.deleteReminder(user.id, reminderId);
    loadReminders();
    
    toast({
      title: language === 'ar' ? 'نجح' : 'Success',
      description: language === 'ar' ? 'تم حذف التذكير' : 'Reminder deleted',
    });
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">
            {t('nav.alarms')}
          </h1>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-reminder">
              <Plus className="h-4 w-4" />
              {language === 'ar' ? 'إضافة تذكير' : 'Add Reminder'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === 'ar' ? 'تذكير جديد' : 'New Reminder'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-title">{language === 'ar' ? 'العنوان' : 'Title'}</Label>
                <Input
                  id="reminder-title"
                  data-testid="input-reminder-title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  placeholder={language === 'ar' ? 'أدخل عنوان التذكير' : 'Enter reminder title'}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-time">{language === 'ar' ? 'الوقت' : 'Time'}</Label>
                <Input
                  id="reminder-time"
                  data-testid="input-reminder-time"
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label>{language === 'ar' ? 'التكرار' : 'Repeat'}</Label>
                <Select value={newReminder.repeat} onValueChange={(value: any) => setNewReminder({ ...newReminder, repeat: value })}>
                  <SelectTrigger data-testid="select-repeat">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{language === 'ar' ? 'بدون تكرار' : 'None'}</SelectItem>
                    <SelectItem value="daily">{language === 'ar' ? 'يومي' : 'Daily'}</SelectItem>
                    <SelectItem value="weekly">{language === 'ar' ? 'أسبوعي' : 'Weekly'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === 'ar' ? 'النوع' : 'Type'}</Label>
                <Select value={newReminder.type} onValueChange={(value: any) => setNewReminder({ ...newReminder, type: value })}>
                  <SelectTrigger data-testid="select-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">{t('dashboard.tasks')}</SelectItem>
                    <SelectItem value="prayer">{t('dashboard.prayers')}</SelectItem>
                    <SelectItem value="lesson">{t('dashboard.lessons')}</SelectItem>
                    <SelectItem value="other">{language === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddReminder} className="w-full" data-testid="button-save-reminder">
                {t('common.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {Notification.permission !== 'granted' && (
        <Card className="shadow-md border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {language === 'ar' 
                    ? 'يرجى تفعيل الإشعارات لتلقي التذكيرات' 
                    : 'Please enable notifications to receive reminders'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={requestNotificationPermission}
                  data-testid="button-enable-notifications"
                >
                  {language === 'ar' ? 'تفعيل الإشعارات' : 'Enable Notifications'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {reminders.length === 0 ? (
          <Card className="shadow-md">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {language === 'ar' ? 'لا توجد تذكيرات' : 'No reminders yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder.id} className="shadow-md hover-elevate transition-all duration-200" data-testid={`card-reminder-${reminder.id}`}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={reminder.enabled}
                    onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)}
                    data-testid={`switch-reminder-${reminder.id}`}
                  />
                  <div className="flex-1">
                    <div className="text-lg font-medium">{reminder.title}</div>
                    <div className="text-sm text-muted-foreground mt-1 flex items-center gap-3">
                      <span>{reminder.time}</span>
                      <span>•</span>
                      <span>
                        {reminder.repeat === 'none' && (language === 'ar' ? 'مرة واحدة' : 'Once')}
                        {reminder.repeat === 'daily' && (language === 'ar' ? 'يومي' : 'Daily')}
                        {reminder.repeat === 'weekly' && (language === 'ar' ? 'أسبوعي' : 'Weekly')}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{reminder.type}</span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteReminder(reminder.id)}
                    data-testid={`button-delete-reminder-${reminder.id}`}
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
