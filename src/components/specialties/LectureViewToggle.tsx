
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface LectureViewToggleProps {
  onViewChange: (view: 'grid' | 'list') => void;
}

export function LectureViewToggle({ onViewChange }: LectureViewToggleProps) {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useLocalStorage<'grid' | 'list'>('lecture-view', 'grid');
  
  const handleViewChange = (view: 'grid' | 'list') => {
    setActiveView(view);
    onViewChange(view);
  };
  
  return (
    <div className="flex space-x-2">
      <Button
        variant={activeView === 'grid' ? 'default' : 'outline'}
        size="sm"
        className="rounded-l-md rounded-r-none"
        onClick={() => handleViewChange('grid')}
        aria-label={t('lectures.gridView')}
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="sr-only md:not-sr-only">{t('lectures.gridView')}</span>
      </Button>
      <Button
        variant={activeView === 'list' ? 'default' : 'outline'}
        size="sm"
        className="rounded-l-none rounded-r-md"
        onClick={() => handleViewChange('list')}
        aria-label={t('lectures.listView')}
      >
        <List className="h-4 w-4 mr-1" />
        <span className="sr-only md:not-sr-only">{t('lectures.listView')}</span>
      </Button>
    </div>
  );
}
