'use client'

import { useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { User, Mail, GraduationCap, Calendar, Shield } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ProfileCompletionGuard } from '@/components/ProfileCompletionGuard'

export default function ProfilePageRoute() {
  const { user } = useAuth()
  const { t } = useTranslation()

  return (
    <ProtectedRoute>
      <ProfileCompletionGuard>
        <AppLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
              <p className="text-muted-foreground">
                {t('profile.description')}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Personal Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('profile.personalInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.image} alt={user?.name || user?.email} />
                      <AvatarFallback>
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user?.name || t('profile.noName')}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{t('profile.name')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.name || t('profile.noName')}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">{t('profile.email')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">{t('profile.gender')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {user?.sexe === 'M' ? t('profile.male') : 
                           user?.sexe === 'F' ? t('profile.female') : 
                           t('profile.noName')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">{t('profile.level')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{user?.niveau?.name || t('profile.noName')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {t('profile.accountInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">{t('profile.role')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {user?.role === 'admin' ? t('profile.administrator') : t('profile.student')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">{t('profile.profileStatus')}</div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user?.profileCompleted ? 'default' : 'destructive'}>
                          {user?.profileCompleted ? t('profile.complete') : t('profile.incomplete')}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">{t('settings.lastPasswordChange')}</div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {user?.passwordUpdatedAt ? 
                            new Date(user.passwordUpdatedAt).toLocaleDateString('fr-FR') : 
                            t('settings.noPasswordSetMessage')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AppLayout>
      </ProfileCompletionGuard>
    </ProtectedRoute>
  )
} 