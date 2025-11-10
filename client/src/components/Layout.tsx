import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  ListTodo, 
  CheckCircle2, 
  BookOpen, 
  GraduationCap, 
  CalendarDays, 
  TrendingUp, 
  Sparkles, 
  Bell,
  Settings, 
  Menu, 
  Sun, 
  Moon, 
  Languages 
} from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/tasks', icon: ListTodo, label: t('nav.tasks') },
    { path: '/prayers', icon: CheckCircle2, label: t('nav.prayers') },
    { path: '/quran', icon: BookOpen, label: t('nav.quran') },
    { path: '/lessons', icon: GraduationCap, label: t('nav.lessons') },
    { path: '/weekly', icon: CalendarDays, label: t('nav.weekly') },
    { path: '/statistics', icon: TrendingUp, label: t('nav.stats') },
    { path: '/motivation', icon: Sparkles, label: t('nav.motivation') },
    { path: '/alarms', icon: Bell, label: t('nav.alarms') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={language === 'ar' ? 'right' : 'left'} className="w-64">
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className="w-full justify-start gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`nav-mobile-${item.path}`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 flex-1">
            <div className="text-2xl font-bold text-primary">
              {language === 'ar' ? 'نماء' : 'Namaa'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              data-testid="button-toggle-language"
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-toggle-theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 border-r min-h-[calc(100vh-4rem)] sticky top-16 bg-background">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className="w-full justify-start gap-3"
                    data-testid={`nav-${item.path}`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="flex justify-around items-center h-16 px-2">
          {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[8]].map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  size="icon"
                  className="h-12 w-12"
                  data-testid={`nav-bottom-${item.path}`}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
