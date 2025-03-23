
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Flag } from 'lucide-react';
import { Question } from '@/types';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

interface ReportQuestionDialogProps {
  question: Question;
  lectureId: string;
}

export function ReportQuestionDialog({ question, lectureId }: ReportQuestionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const handleSubmitReport = async () => {
    if (!reportMessage.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting report for question:', question.id);
      
      const { error } = await supabase
        .from('reports')
        .insert({
          question_id: question.id,
          lecture_id: lectureId,
          message: reportMessage,
          user_id: user?.id || null,
          status: 'pending'
        });
        
      if (error) {
        console.error('Error submitting report:', error);
        throw error;
      }
      
      toast({
        title: t('reports.reportSubmitted'),
        description: t('reports.thankYouForReport'),
      });
      
      setIsOpen(false);
      setReportMessage('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: t('common.error'),
        description: t('reports.errorSubmittingReport'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Flag className="h-3.5 w-3.5" />
          {t('reports.report')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('reports.reportQuestion')}</DialogTitle>
          <DialogDescription>
            {t('reports.reportDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm font-medium">
            <h3 className="mb-2">{t('reports.questionText')}:</h3>
            <p className="text-muted-foreground">{question.text}</p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="report-message" className="text-sm font-medium">
              {t('reports.reportMessage')}:
            </label>
            <Textarea
              id="report-message"
              placeholder={t('reports.reportPlaceholder')}
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
              rows={5}
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t('common.cancel')}</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmitReport}
            disabled={!reportMessage.trim() || isSubmitting}
          >
            {isSubmitting ? t('common.submitting') : t('reports.submitReport')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
