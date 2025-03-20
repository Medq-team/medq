
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Users } from 'lucide-react';

interface AdminStatsProps {
  specialtiesCount: number;
  lecturesCount: number;
  questionsCount: number;
  usersCount: number;
}

export function AdminStats({ 
  specialtiesCount, 
  lecturesCount, 
  questionsCount, 
  usersCount 
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Specialties
          </CardTitle>
          <BookOpen className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{specialtiesCount}</div>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Lectures
          </CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lecturesCount}</div>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Total Questions
          </CardTitle>
          <FileText className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{questionsCount}</div>
        </CardContent>
      </Card>
      
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Registered Users
          </CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{usersCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
