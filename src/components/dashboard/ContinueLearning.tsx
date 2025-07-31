'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { Play, BookOpen, Clock } from 'lucide-react';
import Link from 'next/link';

interface ContinueLearningProps {
  lastLecture?: {
    id: string;
    title: string;
    specialty: {
      name: string;
    };
    progress: number;
    totalQuestions: number;
    completedQuestions: number;
    lastAccessed: string;
  };
  isLoading?: boolean;
}

export function ContinueLearning({ lastLecture, isLoading = false }: ContinueLearningProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!lastLecture) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {t('dashboard.continueLearning.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {t('dashboard.continueLearning.noProgress')}
            </p>
            <Link href="/specialty">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                {t('dashboard.continueLearning.startLearning')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return t('dashboard.continueLearning.yesterday');
    } else if (diffDays < 7) {
      return t('dashboard.continueLearning.daysAgo', { days: diffDays });
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t('dashboard.continueLearning.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg">{lastLecture.title}</h3>
          <Badge variant="secondary" className="mt-1">
            {lastLecture.specialty.name}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t('dashboard.continueLearning.progress')}</span>
            <span>{lastLecture.completedQuestions}/{lastLecture.totalQuestions}</span>
          </div>
          <Progress value={lastLecture.progress} className="h-2" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{t('dashboard.continueLearning.lastAccessed')}: {formatDate(lastLecture.lastAccessed)}</span>
        </div>

        <Link href={`/lecture/${lastLecture.id}`}>
          <Button className="w-full mt-4">
            <Play className="h-4 w-4 mr-2" />
            {t('dashboard.continueLearning.continue')}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
} 