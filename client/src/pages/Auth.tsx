import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || (!isLogin && !name)) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    const success = isLogin 
      ? await login(username, password)
      : await signup(username, password, name);

    if (!success) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: isLogin 
          ? (language === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة' : 'Invalid username or password')
          : (language === 'ar' ? 'اسم المستخدم موجود بالفعل' : 'Username already exists'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="text-5xl font-bold text-primary mb-2">
            {language === 'ar' ? 'نماء' : 'Namaa'}
          </div>
          <CardTitle className="text-2xl">{t('auth.welcome')}</CardTitle>
          <CardDescription className="text-base">{t('auth.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" data-testid="label-name">{t('auth.name')}</Label>
                <Input
                  id="name"
                  data-testid="input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                  className="h-12"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" data-testid="label-username">{t('auth.username')}</Label>
              <Input
                id="username"
                data-testid="input-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل اسم المستخدم' : 'Enter your username'}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" data-testid="label-password">{t('auth.password')}</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                className="h-12"
              />
            </div>

            <Button type="submit" className="w-full h-12 text-base" data-testid="button-submit">
              {isLogin ? t('auth.login') : t('auth.signup')}
            </Button>

            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
                data-testid="button-toggle-auth"
              >
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
