
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { ReportCard } from './ReportCard';
import { Report } from './types';
import { fetchReports, updateReportStatus } from '@/lib/supabase';

export function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  
  useEffect(() => {
    loadReports();
  }, []);
  
  const loadReports = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching reports from the database...');
      const { data, error } = await fetchReports();
        
      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }
      
      console.log('Reports fetched:', data);
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
      console.log(`Updating report ${reportId} status to ${newStatus}`);
      const { error } = await updateReportStatus(reportId, newStatus);
        
      if (error) {
        console.error('Error updating report status:', error);
        throw error;
      }
      
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
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }
  
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">{t('reports.noReportsAvailable')}</h3>
        <p className="text-muted-foreground mt-2">
          {t('reports.noReportsDescription')}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {reports.map((report) => (
        <ReportCard 
          key={report.id} 
          report={report} 
          onUpdateStatus={handleUpdateStatus} 
        />
      ))}
    </div>
  );
}
