
import { useTranslation } from 'react-i18next';
import { ReportsList } from './reports/ReportsList';

export function ReportsTab() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">{t('reports.reportedQuestions')}</h3>
      <ReportsList />
    </div>
  );
}
