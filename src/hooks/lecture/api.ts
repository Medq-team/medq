
import { supabase } from '@/lib/supabase';
import { Lecture, Question } from '@/types';
import { toast } from '@/hooks/use-toast';

/**
 * Fetch lecture data by ID
 */
export const fetchLecture = async (lectureId: string): Promise<Lecture | null> => {
  try {
    const { data, error } = await supabase
      .from('lectures')
      .select('*')
      .eq('id', lectureId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lecture:', error);
    toast({
      title: "Error",
      description: "Failed to load lecture information.",
      variant: "destructive",
    });
    return null;
  }
};

/**
 * Get total question count for a lecture
 */
export const getQuestionCount = async (lectureId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('lecture_id', lectureId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching question count:', error);
    return 0;
  }
};

/**
 * Fetch all questions for a lecture
 */
export const fetchLectureQuestions = async (lectureId: string): Promise<Question[]> => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('lecture_id', lectureId)
      .order('type', { ascending: true })
      .order('number', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    toast({
      title: "Error",
      description: "Failed to load questions.",
      variant: "destructive",
    });
    return [];
  }
};
