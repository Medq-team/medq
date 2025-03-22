
import { Lecture } from '@/types';
import { LectureCard } from '@/components/lectures/LectureCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LecturesListProps {
  lectures: Lecture[];
  isLoading: boolean;
  viewType: 'grid' | 'list';
}

export function LecturesList({ lectures, isLoading, viewType }: LecturesListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return viewType === 'grid' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    ) : (
      <div className="mt-8">
        <Skeleton className="h-10 w-full rounded-lg mb-4" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg mb-2" />
        ))}
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
        <h3 className="text-lg font-semibold">{t('lectures.noLectures')}</h3>
        <p className="text-muted-foreground mt-2">
          {t('lectures.noLecturesDescription')}
        </p>
      </div>
    );
  }

  // Grid view
  if (viewType === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {lectures.map((lecture) => (
          <LectureCard key={lecture.id} lecture={lecture} />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="mt-8 border rounded-lg animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">{t('lectures.title')}</TableHead>
            <TableHead className="w-[15%]">{t('lectures.questionsCount')}</TableHead>
            <TableHead className="w-[20%]">{t('lectures.lastUpdate')}</TableHead>
            <TableHead className="w-[15%]">{t('lectures.duration')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectures.map((lecture) => {
            const updatedAt = lecture.updated_at 
              ? formatDistanceToNow(new Date(lecture.updated_at), { addSuffix: true })
              : t('common.unknown');
              
            return (
              <TableRow key={lecture.id} className="hover:bg-accent/20">
                <TableCell className="font-medium">
                  <Link 
                    to={`/lecture/${lecture.id}`}
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {lecture.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {lecture.questions_count || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {updatedAt}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {lecture.duration || t('common.unknown')}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
