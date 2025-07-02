
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Specialty, Lecture } from '@/types';

export function useSpecialty(specialtyId: string | undefined) {
  const router = useRouter();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false);

  const fetchSpecialtyAndLectures = async () => {
    if (!specialtyId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Fetching specialty with ID:', specialtyId);
      
      // Fetch specialty
      const { data: specialtyData, error: specialtyError } = await supabase
        .from('specialties')
        .select('*')
        .eq('id', specialtyId)
        .maybeSingle();

      if (specialtyError) {
        console.error('Error fetching specialty:', specialtyError);
        throw specialtyError;
      }
      
      if (!specialtyData) {
        console.warn('No specialty found with ID:', specialtyId);
        setSpecialty(null);
        setLectures([]);
        toast({
          title: "Specialty not found",
          description: "The requested specialty could not be found.",
          variant: "destructive",
        });
      } else {
        console.log('Successfully fetched specialty:', specialtyData);
        setSpecialty(specialtyData);
        
        // Fetch lectures for this specialty
        const { data: lecturesData, error: lecturesError } = await supabase
          .from('lectures')
          .select('*')
          .eq('specialty_id', specialtyId)
          .order('title');

        if (lecturesError) {
          console.error('Error fetching lectures:', lecturesError);
          // Don't throw for lectures error, just set empty array
          setLectures([]);
        } else {
          console.log('Successfully fetched lectures:', lecturesData?.length || 0);
          setLectures(lecturesData || []);
          
          // Set the first lecture as default if available
          if (lecturesData && lecturesData.length > 0) {
            setSelectedLectureId(lecturesData[0].id);
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load specialty information. Please try again.",
        variant: "destructive",
      });
      // Only navigate away if we're on the specialty page
      if (window.location.pathname.includes('/specialty/')) {
        router.push('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
