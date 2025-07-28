'use client';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { AdminStats } from '@/components/admin/AdminStats';
import { SpecialtiesTab } from '@/components/admin/SpecialtiesTab';
import { LecturesTab } from '@/components/admin/LecturesTab';
import { ReportsTab } from '@/components/admin/ReportsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AdminPage() {
  const router = useRouter();
  
  return (
    <ProtectedRoute requireAdmin>
      <AdminRoute>
        <AppLayout>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage specialties, lectures, questions, and reports
              </p>
            </div>

            <AdminStats />

            <div className="flex justify-between items-center mb-4">
              <Button 
                onClick={() => router.push('/admin/import')}
                variant="outline"
                className="btn-hover"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import QROC Questions
              </Button>
            </div>

            <Tabs defaultValue="specialties" className="space-y-4">
              <TabsList>
                <TabsTrigger value="specialties">Specialties</TabsTrigger>
                <TabsTrigger value="lectures">Lectures</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="specialties" className="space-y-4">
                <SpecialtiesTab />
              </TabsContent>
              <TabsContent value="lectures" className="space-y-4">
                <LecturesTab />
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <ReportsTab />
              </TabsContent>
            </Tabs>
          </div>
        </AppLayout>
      </AdminRoute>
    </ProtectedRoute>
  );
} 