
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Eye, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface Report {
  id: string;
  question_id: string;
  lecture_id: string;
  message: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
  question: {
    text: string;
    type: string;
  };
  lecture: {
    title: string;
  };
  profile: {
    email: string;
  } | null;
}

export function ReportsTab() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('question_reports')
        .select(`
          *,
          question:question_id(text, type),
          lecture:lecture_id(title),
          profile:user_id(email)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: t('common.error'),
        description: t('reports.errorFetchingReports'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateStatus = async (reportId: string, newStatus: 'pending' | 'reviewed' | 'dismissed') => {
    try {
      const { error } = await supabase
        .from('question_reports')
        .update({ status: newStatus })
        .eq('id', reportId);
        
      if (error) throw error;
      
      // Update the local state
      setReports(prev => 
        prev.map(report => 
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );
      
      toast({
        title: t('reports.statusUpdated'),
        description: 
          newStatus === 'reviewed' 
            ? t('reports.reportMarkedReviewed') 
            : newStatus === 'dismissed'
            ? t('reports.reportDismissed')
            : t('reports.reportMarkedPending'),
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        title: t('common.error'),
        description: t('reports.errorUpdatingStatus'),
        variant: "destructive",
      });
    }
  };
  
  const navigateToLecture = (lectureId: string) => {
    navigate(`/lecture/${lectureId}`);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">{t('reports.reportedQuestions')}</h3>
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }
  
  if (reports.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">{t('reports.reportedQuestions')}</h3>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-semibold">{t('reports.noReportsAvailable')}</h3>
          <p className="text-muted-foreground mt-2">
            {t('reports.noReportsDescription')}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">{t('reports.reportedQuestions')}</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{report.question?.text || t('reports.questionNotFound')}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{report.lecture?.title || t('reports.lectureNotFound')}</span>
                    {report.status && (
                      <Badge variant={
                        report.status === 'pending' ? 'outline' :
                        report.status === 'reviewed' ? 'default' : 'destructive'
                      }>
                        {report.status}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigateToLecture(report.lecture_id)}
                  className="flex items-center gap-1"
                >
                  {t('reports.viewQuestion')}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="rounded-md bg-muted p-3 mb-4 text-sm">
                <p className="font-medium mb-1">{t('reports.reportMessage')}:</p>
                <p className="text-muted-foreground">{report.message}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {new Date(report.created_at).toLocaleDateString()} - 
                  {report.profile ? report.profile.email : t('reports.anonymousUser')}
                </p>
                
                <div className="flex gap-2">
                  {report.status === 'pending' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => handleUpdateStatus(report.id, 'reviewed')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {t('reports.markAsReviewed')}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleUpdateStatus(report.id, 'dismissed')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        {t('reports.dismiss')}
                      </Button>
                    </>
                  )}
                  
                  {report.status !== 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(report.id, 'pending')}
                    >
                      {t('reports.reopenReport')}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
