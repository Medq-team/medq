'use client'

import { useParams } from 'next/navigation'
import { useSpecialty } from '@/hooks/use-specialty'
import { AppLayout } from '@/components/layout/AppLayout'
import { SpecialtyActions } from '@/components/specialties/SpecialtyActions'
import { SpecialtyHeader } from '@/components/specialties/SpecialtyHeader'
import { LecturesList } from '@/components/specialties/LecturesList'
import { AddLectureDialog } from '@/components/specialties/AddLectureDialog'
import { AddQuestionDialog } from '@/components/specialties/AddQuestionDialog'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function SpecialtyPageRoute() {
  const params = useParams()
  
  if (!params?.specialtyId) {
    return <div>Specialty ID not found</div>
  }
  
  const specialtyId = params.specialtyId as string
  
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
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {specialty && (
            <SpecialtyActions 
              specialty={specialty}
              onEdit={() => {}}
              onDelete={() => {}}
              onLectureAdded={fetchSpecialtyAndLectures}
              onQuestionAdded={fetchSpecialtyAndLectures}
            />
          )}

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
    </ProtectedRoute>
  );
} 