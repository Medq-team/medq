
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSpecialty } from '@/hooks/use-specialty';
import { SpecialtyHeader } from '@/components/specialties/SpecialtyHeader';
import { SpecialtyActions } from '@/components/specialties/SpecialtyActions';
import { AddLectureDialog } from '@/components/specialties/AddLectureDialog';
import { AddQuestionDialog } from '@/components/specialties/AddQuestionDialog';
import { LecturesList } from '@/components/specialties/LecturesList';
import { Button } from '@/components/ui/button';
import { Grid2X2, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SpecialtyPage() {
  const { specialtyId } = useParams<{ specialtyId: string }>();
  const {
    specialty,
    lectures,
    isLoading,
    selectedLectureId,
    setSelectedLectureId,
    isAddQuestionOpen,
    setIsAddQuestionOpen,
    isAddLectureOpen,
    setIsAddLectureOpen,
    fetchSpecialtyAndLectures,
    handleOpenAddQuestion,
    viewType,
    toggleViewType,
  } = useSpecialty(specialtyId);
  
  const { t } = useTranslation();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
          <SpecialtyActions 
            onAddLectureClick={() => setIsAddLectureOpen(true)}
            onAddQuestionClick={() => lectures.length > 0 && setIsAddQuestionOpen(true)}
            hasLectures={lectures.length > 0}
          />
          
          {lectures.length > 0 && !isLoading && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{t('lectures.viewAs')}:</span>
              <div className="border rounded-md flex">
                <Button
                  variant={viewType === 'grid' ? "default" : "ghost"}
                  size="sm"
                  className="rounded-r-none h-9"
                  onClick={() => viewType !== 'grid' && toggleViewType()}
                >
                  <Grid2X2 className="h-4 w-4 mr-1" />
                  {t('lectures.grid')}
                </Button>
                <Button
                  variant={viewType === 'list' ? "default" : "ghost"}
                  size="sm"
                  className="rounded-l-none h-9"
                  onClick={() => viewType !== 'list' && toggleViewType()}
                >
                  <List className="h-4 w-4 mr-1" />
                  {t('lectures.list')}
                </Button>
              </div>
            </div>
          )}
        </div>

        <SpecialtyHeader 
          specialty={specialty} 
          isLoading={isLoading} 
        />

        <LecturesList 
          lectures={lectures} 
          isLoading={isLoading}
          viewType={viewType}
        />

        <AddLectureDialog 
          isOpen={isAddLectureOpen}
          onOpenChange={setIsAddLectureOpen}
          specialtyId={specialtyId || ''}
          onLectureAdded={fetchSpecialtyAndLectures}
        />

        <AddQuestionDialog 
          isOpen={isAddQuestionOpen}
          onOpenChange={setIsAddQuestionOpen}
          selectedLectureId={selectedLectureId}
          setSelectedLectureId={setSelectedLectureId}
          lectures={lectures}
        />
      </div>
    </AppLayout>
  );
}
