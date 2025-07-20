
import { Lecture } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

interface LecturesListViewProps {
  lectures: Lecture[];
  isLoading: boolean;
}

export function LecturesListView({ lectures, isLoading }: LecturesListViewProps) {
  const router = useRouter();
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
        <h3 className="text-lg font-semibold">{t('lectures.noLecturesAvailable')}</h3>
        <p className="text-muted-foreground mt-2">
          {t('lectures.noLecturesDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('lectures.title')}</TableHead>
            <TableHead className="hidden md:table-cell">{t('lectures.description')}</TableHead>
            <TableHead className="w-[100px]">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lectures.map((lecture) => (
            <TableRow 
              key={lecture.id}
              className="cursor-pointer hover:bg-muted/80"
              onClick={() => router.push(`/lecture/${lecture.id}`)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  {lecture.title}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                <div className="truncate max-w-[400px]">
                  {lecture.description}
                </div>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/lecture/${lecture.id}`);
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">{t('lectures.openLecture')}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
