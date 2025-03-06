
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { LectureCard } from '@/components/lectures/LectureCard';
import { Specialty, Lecture } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function SpecialtyPage() {
  const { specialtyId } = useParams<{ specialtyId: string }>();
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState<Specialty | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSpecialtyAndLectures() {
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
          throw lecturesError;
        }

        setLectures(lecturesData || []);
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
    }

    fetchSpecialtyAndLectures();
  }, [specialtyId, navigate]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          className="group flex items-center mb-6" 
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Button>

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3 rounded" />
              <Skeleton className="h-5 w-2/3 rounded" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : specialty ? (
          <>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{specialty.name}</h2>
              <p className="text-muted-foreground mt-2">
                {specialty.description || `Select a lecture to view questions and start learning`}
              </p>
            </div>

            {lectures.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {lectures.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
                <h3 className="text-lg font-semibold">No lectures available</h3>
                <p className="text-muted-foreground mt-2">
                  There are no lectures available for this specialty yet.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">Specialty not found</h2>
            <p className="text-muted-foreground mt-2">
              The specialty you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
