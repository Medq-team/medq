
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Specialty } from '@/types';
import { SpecialtyItem } from './SpecialtyItem';

interface SpecialtiesTabProps {
  specialties: Specialty[];
  isLoading: boolean;
  onDeleteSpecialty: (id: string) => void;
}

export function SpecialtiesTab({ 
  specialties, 
  isLoading, 
  onDeleteSpecialty 
}: SpecialtiesTabProps) {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Specialties</h3>
        <Button 
          onClick={() => navigate('/admin/specialty/new')}
          className="btn-hover"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Specialty
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg p-4">
              <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
              <div className="h-3 w-full bg-muted rounded mb-4"></div>
              <div className="h-9 w-24 bg-muted rounded"></div>
            </div>
          ))
        ) : specialties.length === 0 ? (
          <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="text-lg font-semibold">No specialties available</h3>
            <p className="text-muted-foreground mt-2">
              Click "Add Specialty" to create your first specialty.
            </p>
          </div>
        ) : specialties.map((specialty) => (
          <SpecialtyItem
            key={specialty.id}
            specialty={specialty}
            onDelete={onDeleteSpecialty}
          />
        ))}
      </div>
    </div>
  );
}
