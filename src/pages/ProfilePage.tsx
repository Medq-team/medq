'use client';
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      await refreshUser();
      setIsEditing(false);
      toast({
        title: t('profile.profileUpdated'),
        description: t('profile.updateSuccess')
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('common.tryAgain'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }
  
  return (
    <AppLayout>
      <div className="container max-w-3xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.profile')}</h1>
          <p className="text-muted-foreground">
            {t('profile.viewUpdateInfo')}
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.accountInfo')}</CardTitle>
            <CardDescription>
              {t('profile.personalInfo')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t('profile.emailCannotChange')}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  placeholder={t('profile.firstName')} 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  placeholder={t('profile.lastName')} 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing || isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">{t('profile.role')}</Label>
                <Input 
                  id="role" 
                  value={user?.role === 'admin' ? t('profile.administrator') : t('profile.student')} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {t('profile.accessLevel')}
                </p>
              </div>
              
              {isEditing ? (
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? t('profile.saving') : t('profile.saveChanges')}
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    {t('profile.editProfile')}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
