import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { localStorageService } from '../lib/localStorage';
import { Quote as QuoteType } from '../types';
import { Quote, Plus, RefreshCcw, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Motivation() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [quotes, setQuotes] = useState<QuoteType[]>([]);
  const [currentQuote, setCurrentQuote] = useState<QuoteType | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newQuote, setNewQuote] = useState('');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = () => {
    const allQuotes = localStorageService.getQuotes();
    setQuotes(allQuotes);
    if (!currentQuote && allQuotes.length > 0) {
      setCurrentQuote(allQuotes[Math.floor(Math.random() * allQuotes.length)]);
    }
  };

  const handleNewQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  };

  const handleAddQuote = () => {
    if (!newQuote.trim()) return;
    
    localStorageService.addQuote({
      text: newQuote,
      category: 'custom',
      isCustom: true,
    });
    
    setNewQuote('');
    setShowDialog(false);
    loadQuotes();
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">
            {t('motivation.title')} {user.name}
          </h1>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-add-quote">
              <Plus className="h-4 w-4" />
              {t('motivation.addQuote')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('motivation.addQuote')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="quote-text">{language === 'ar' ? 'الاقتباس' : 'Quote'}</Label>
                <Textarea
                  id="quote-text"
                  data-testid="textarea-quote"
                  value={newQuote}
                  onChange={(e) => setNewQuote(e.target.value)}
                  placeholder={t('motivation.quote.placeholder')}
                  className="min-h-32 resize-none"
                />
              </div>
              <Button onClick={handleAddQuote} className="w-full" data-testid="button-save-quote">
                {t('common.save')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {currentQuote && (
        <Card className="shadow-xl border-primary/20">
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <Quote className="h-16 w-16 text-primary/20" />
              <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-foreground max-w-2xl">
                "{currentQuote.text}"
              </p>
              {currentQuote.author && (
                <p className="text-lg text-muted-foreground">
                  — {currentQuote.author}
                </p>
              )}
              <Button
                variant="outline"
                className="gap-2 mt-6"
                onClick={handleNewQuote}
                data-testid="button-new-quote"
              >
                <RefreshCcw className="h-4 w-4" />
                {t('common.add')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{t('motivation.addQuote')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quotes.filter(q => q.isCustom).length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t('common.loading')}
              </p>
            ) : (
              quotes.filter(q => q.isCustom).map((quote) => (
                <div key={quote.id} className="p-4 border rounded-lg hover-elevate transition-all duration-200" data-testid={`quote-${quote.id}`}>
                  <p className="text-base italic">{quote.text}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
