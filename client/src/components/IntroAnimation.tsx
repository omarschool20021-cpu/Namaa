import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const { t, language } = useLanguage();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 transition-opacity duration-500 ${show ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="text-center space-y-6 animate-in fade-in-0 zoom-in-95 duration-1000">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl opacity-30 bg-primary rounded-full"></div>
          <div className="relative">
            <div className="text-7xl md:text-8xl font-bold text-primary mb-4 tracking-tight">
              {language === 'ar' ? 'نماء' : 'نماء'}
            </div>
            <div className="text-3xl md:text-4xl font-light text-foreground tracking-wide">
              {language === 'ar' ? 'نماء' : 'Namaa'}
            </div>
          </div>
        </div>
        <div className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto px-4">
          {t('app.tagline')}
        </div>
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '400ms' }}></div>
        </div>
      </div>
    </div>
  );
}
