
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    newContent: true,
    reminders: false
  });
  const { t } = useTranslation();

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: t('settings.passwordsNotMatch'),
        description: t('settings.passwordsNotMatch'),
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast({
        title: t('settings.passwordChangeSuccess'),
        description: t('settings.passwordChangeSuccess')
      });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: t('settings.passwordChangeFailed'),
        description: error.message || t('settings.passwordChangeFailed'),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  function handlePasswordInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  }
  
  function handleNotificationChange(key: keyof typeof notifications) {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
    
    toast({
      title: t('settings.preferencesUpdated'),
      description: t('settings.preferencesUpdated')
    });
  }
  
  return (
    <AppLayout>
      <div className="container max-w-3xl py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('settings.settings')}</h1>
          <p className="text-muted-foreground">
            {t('settings.controlNotifications')}
          </p>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">{t('profile.accountInfo')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.changePassword')}</CardTitle>
                <CardDescription>
                  {t('settings.updatePasswordDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label>
                    <Input 
                      id="currentPassword" 
                      name="currentPassword"
                      type="password" 
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInput}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('settings.newPassword')}</Label>
                    <Input 
                      id="newPassword" 
                      name="newPassword"
                      type="password" 
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInput}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('settings.confirmPassword')}</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password" 
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInput}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? t('settings.updating') : t('settings.updatePassword')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.notificationPreferences')}</CardTitle>
                <CardDescription>
                  {t('settings.controlNotifications')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">{t('settings.emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.emailNotificationsDesc')}
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={() => handleNotificationChange('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="content-notifications">{t('settings.contentAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.contentAlertsDesc')}
                    </p>
                  </div>
                  <Switch 
                    id="content-notifications"
                    checked={notifications.newContent}
                    onCheckedChange={() => handleNotificationChange('newContent')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminder-notifications">{t('settings.studyReminders')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.studyRemindersDesc')}
                    </p>
                  </div>
                  <Switch 
                    id="reminder-notifications"
                    checked={notifications.reminders}
                    onCheckedChange={() => handleNotificationChange('reminders')}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
