'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { Moon, Sun, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PasswordChangeForm } from '@/components/settings/PasswordChangeForm'
import { PasswordInfo } from '@/components/settings/PasswordInfo'

export default function SettingsPageRoute() {
  const { logout, user } = useAuth()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
            <p className="text-muted-foreground">
              {t('settings.description')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                {t('settings.appearance')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{t('settings.theme')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.themeDescription')}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4 mr-2" />
                      {t('settings.lightMode')}
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 mr-2" />
                      {t('settings.darkMode')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <PasswordInfo 
            passwordUpdatedAt={user?.passwordUpdatedAt}
            hasPassword={!!user?.password}
          />

          <PasswordChangeForm />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                {t('settings.account')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('auth.signOut')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
} 