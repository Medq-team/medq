'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  sexe: z.enum(['M', 'F'], { required_error: 'Please select your gender' }),
  niveauId: z.string().min(1, 'Please select your level'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Niveau {
  id: string;
  name: string;
  order: number;
}

export default function CompleteProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNiveaux, setIsLoadingNiveaux] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  // Load niveaux on component mount
  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const response = await fetch('/api/niveaux');
        if (response.ok) {
          const data = await response.json();
          setNiveaux(data.niveaux);
        }
      } catch (error) {
        console.error('Error fetching niveaux:', error);
        toast({
          title: t('common.error'),
          description: t('profile.failedToLoadLevels'),
          variant: 'destructive',
        });
      } finally {
        setIsLoadingNiveaux(false);
      }
    };

    fetchNiveaux();
  }, [toast]);

  // Redirect if profile is already complete
  useEffect(() => {
    if (user?.profileCompleted) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Don't show the form if user is not authenticated
  if (!user) {
    return null;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        updateUser(result.user);
              toast({
        title: t('common.success'),
        description: t('profile.profileCompleted'),
      });
        router.push('/dashboard');
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: t('profile.failedToUpdateProfile'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingNiveaux) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-card py-12 px-4 sm:px-6 lg:px-8">
              <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t('profile.completeProfile')}</CardTitle>
            <CardDescription>
              {t('profile.completeProfileDescription')}
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.fullName')}</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder={t('profile.enterFullName')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <Label>{t('profile.gender')}</Label>
              <RadioGroup
                onValueChange={(value) => setValue('sexe', value as 'M' | 'F')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="male" />
                  <Label htmlFor="male">{t('profile.male')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="F" id="female" />
                  <Label htmlFor="female">{t('profile.female')}</Label>
                </div>
              </RadioGroup>
              {errors.sexe && (
                <p className="text-sm text-red-500">{errors.sexe.message}</p>
              )}
            </div>

            {/* Niveau Field */}
            <div className="space-y-2">
              <Label htmlFor="niveau">{t('profile.level')}</Label>
              <Select onValueChange={(value) => setValue('niveauId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('profile.selectLevel')} />
                </SelectTrigger>
                <SelectContent>
                  {niveaux.map((niveau) => (
                    <SelectItem key={niveau.id} value={niveau.id}>
                      {niveau.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.niveauId && (
                <p className="text-sm text-red-500">{errors.niveauId.message}</p>
              )}
            </div>



            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('profile.completingProfile')}
                </>
              ) : (
                t('profile.completeProfile')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </ProtectedRoute>
  );
} 