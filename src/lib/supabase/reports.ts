
import { supabase } from './client';
import { toast } from '../../hooks/use-toast';
import { Report } from '@/components/admin/reports/types';

/**
 * Fetches all report records with related data
 */
export async function fetchReports() {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        question:question_id(text, type),
        lecture:lecture_id(title),
        profile:user_id(email)
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
    
    return { data: data as Report[], error: null };
  } catch (error) {
    console.error('Error fetching reports:', error);
    return { data: null, error };
  }
}

/**
 * Updates the status of a report
 */
export async function updateReportStatus(reportId: string, newStatus: 'pending' | 'reviewed' | 'dismissed') {
  try {
    const { error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', reportId);
      
    if (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating report status:', error);
    return { success: false, error };
  }
}
