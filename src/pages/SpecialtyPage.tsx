
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useSpecialty } from '@/hooks/use-specialty';
import { SpecialtyHeader } from '@/components/specialties/SpecialtyHeader';
import { SpecialtyActions } from '@/components/specialties/SpecialtyActions';
import { AddLectureDialog } from '@/components/specialties/AddLectureDialog';
import { AddQuestionDialog } from '@/components/specialties/AddQuestionDialog';
import { LecturesList } from '@/components/specialties/LecturesList';

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
  } = useSpecialty(specialtyId);

  return (
    <AppLayout>
      <div className="space-y-6">
        <SpecialtyActions 
          onAddLectureClick={() => setIsAddLectureOpen(true)}
          onAddQuestionClick={() => lectures.length > 0 && setIsAddQuestionOpen(true)}
          hasLectures={lectures.length > 0}
        />

        <SpecialtyHeader 
          specialty={specialty} 
          isLoading={isLoading} 
        />

        <LecturesList 
          lectures={lectures} 
          isLoading={isLoading} 
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
