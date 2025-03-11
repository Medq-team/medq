
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Specialty, Lecture } from '@/types';

export function useSpecialty(specialtyId: string | undefined) {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false);

  const fetchSpecialtyAndLectures = async () => {
    if (!specialtyId) return;
    
    setIsLoading(true);
    
    try {
      // Fetch specialty
      const { data: specialtyData, error: specialtyError } = await supabase
        .from('specialties')
        .select('*')
        .eq('id', specialtyId)
        .single();

      if (specialtyError) {
        throw specialtyError;
      }

      setSpecialty(specialtyData);

      // Fetch lectures for this specialty
      const { data: lecturesData, error: lecturesError } = await supabase
        .from('lectures')
        .select('*')
        .eq('specialty_id', specialtyId)
        .order('title');

      if (lecturesError) {
        // Don't throw an error for empty lectures, just set empty array
        console.warn('Error fetching lectures:', lecturesError);
        setLectures([]);
      } else {
        setLectures(lecturesData || []);
        
        // Set the first lecture as default if available
        if (lecturesData && lecturesData.length > 0) {
          setSelectedLectureId(lecturesData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load specialty information. Please try again.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!specialtyId) return;
    
    fetchSpecialtyAndLectures();
  }, [specialtyId]);

  const handleOpenAddQuestion = (lectureId: string) => {
    setSelectedLectureId(lectureId);
    setIsAddQuestionOpen(true);
  };

  return {
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
  };
}
