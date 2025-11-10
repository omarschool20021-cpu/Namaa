import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { localStorageService } from '../lib/localStorage';
import { Download, Upload, RefreshCcw, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  useEffect(() => {
    if (user) {
      const settings = localStorageService.getSettings(user.id);
      setFontSize(settings.fontSize);
      
      const root = document.documentElement;
      if (settings.fontSize === 'small') {
        root.style.fontSize = '14px';
      } else if (settings.fontSize === 'large') {
        root.style.fontSize = '18px';
      } else {
        root.style.fontSize = '16px';
      }
    }
  }, [user]);

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    if (!user) return;
    setFontSize(size);
    localStorageService.updateSettings(user.id, { fontSize: size });
    
    const root = document.documentElement;
    if (size === 'small') {
      root.style.fontSize = '14px';
    } else if (size === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  };

  const handleBackup = () => {
    if (!user) return;
    const data = localStorageService.exportData(user.id);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `namaa-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: language === 'ar' ? 'نجح' : 'Success',
      description: language === 'ar' ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully',
    });
  };

  const handleRestore = () => {
    if (!user) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            localStorageService.importData(user.id, data);
            toast({
              title: language === 'ar' ? 'نجح' : 'Success',
              description: language === 'ar' ? 'تم استيراد البيانات بنجاح' : 'Data imported successfully',
            });
            window.location.reload();
          } catch (error) {
            toast({
              title: language === 'ar' ? 'خطأ' : 'Error',
              description: language === 'ar' ? 'فشل استيراد البيانات' : 'Failed to import data',
              variant: 'destructive',
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (!user) return;
    localStorageService.resetAllData(user.id);
    toast({
      title: language === 'ar' ? 'نجح' : 'Success',
      description: language === 'ar' ? 'تم إعادة تعيين جميع البيانات' : 'All data has been reset',
    });
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl md:text-4xl font-bold">
          {t('settings.title')} {user.name}
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'المظهر' : 'Appearance'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.theme')}</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {theme === 'light' ? t('settings.theme.light') : t('settings.theme.dark')}
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              data-testid="switch-theme"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.language')}</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'en' ? t('settings.language.en') : t('settings.language.ar')}
              </p>
            </div>
            <Switch
              checked={language === 'ar'}
              onCheckedChange={toggleLanguage}
              data-testid="switch-language"
            />
          </div>

          <div className="space-y-2">
            <Label>{t('settings.fontSize')}</Label>
            <Select value={fontSize} onValueChange={(value: any) => handleFontSizeChange(value)}>
              <SelectTrigger data-testid="select-font-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t('settings.fontSize.small')}</SelectItem>
                <SelectItem value="medium">{t('settings.fontSize.medium')}</SelectItem>
                <SelectItem value="large">{t('settings.fontSize.large')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'البيانات' : 'Data Management'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleBackup} data-testid="button-backup">
            <Download className="h-4 w-4" />
            {t('settings.backup')}
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleRestore} data-testid="button-restore">
            <Upload className="h-4 w-4" />
            {t('settings.restore')}
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" data-testid="button-reset">
                <RefreshCcw className="h-4 w-4" />
                {t('settings.reset')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('settings.reset')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('settings.reset.confirm')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} data-testid="button-confirm-reset">
                  {t('common.confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-destructive/20">
        <CardContent className="pt-6">
          <Button variant="destructive" className="w-full gap-2" onClick={logout} data-testid="button-logout">
            <LogOut className="h-4 w-4" />
            {t('auth.logout')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
