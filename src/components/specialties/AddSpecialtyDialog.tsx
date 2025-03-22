
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

interface AddSpecialtyDialogProps {
  onSpecialtyAdded: () => void;
  userId: string | undefined;
}

export function AddSpecialtyDialog({ onSpecialtyAdded, userId }: AddSpecialtyDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, user } = useAuth();
  const { t } = useTranslation();
  
  useEffect(() => {
    // For debugging
    console.log('AddSpecialtyDialog - Current auth state:', { 
      isAdmin, 
      userId, 
      userEmail: user?.email,
      userRole: user?.role
    });
  }, [isAdmin, userId, user]);

  const handleAddSpecialty = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: t('auth.signIn'),
        description: t('auth.enterCredentials'),
        variant: "destructive",
      });
      return;
    }
    
    if (!isAdmin) {
      toast({
        title: t('specialties.adminOnly'),
        description: t('specialties.adminOnly'),
        variant: "destructive",
      });
      return;
    }
    
    if (!newSpecialty.name.trim()) {
      toast({
        title: t('specialties.validationError'),
        description: t('specialties.nameRequired'),
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase
        .from('specialties')
        .insert([
          {
            name: newSpecialty.name,
            description: newSpecialty.description || null,
            imageurl: newSpecialty.imageUrl || null,
            created_by: userId
          }
        ])
        .select();
      
      if (error) {
        console.error('Error details:', error);
        throw error;
      }
      
      toast({
        title: t('specialties.success'),
        description: t('specialties.specialtyCreated'),
      });
      
      // Reset form and close dialog
      setNewSpecialty({
        name: '',
        description: '',
        imageUrl: ''
      });
      setIsOpen(false);
      
      // Inform parent component to refresh the list
      onSpecialtyAdded();
      
    } catch (error: any) {
      console.error('Error creating specialty:', error);
      let errorMessage = t('common.tryAgain');
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: t('common.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="relative" disabled={!isAdmin}>
          {!isAdmin && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
              <span className="text-xs text-white">{t('specialties.adminOnly')}</span>
            </div>
          )}
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('specialties.addSpecialty')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('specialties.addSpecialty')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleAddSpecialty} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('specialties.name')}</Label>
            <Input 
              id="name"
              value={newSpecialty.name}
              onChange={(e) => setNewSpecialty({...newSpecialty, name: e.target.value})}
              placeholder={t('specialties.name')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('specialties.description')}</Label>
            <Input 
              id="description"
              value={newSpecialty.description}
              onChange={(e) => setNewSpecialty({...newSpecialty, description: e.target.value})}
              placeholder={t('specialties.description')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUrl">{t('specialties.imageUrl')}</Label>
            <Input 
              id="imageUrl"
              value={newSpecialty.imageUrl}
              onChange={(e) => setNewSpecialty({...newSpecialty, imageUrl: e.target.value})}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('specialties.creating') : t('specialties.createSpecialty')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
