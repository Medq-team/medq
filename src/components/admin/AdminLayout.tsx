import React from 'react';
import { AdminSidebar, AdminSidebarProvider } from './AdminSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppHeader } from '@/components/layout/AppHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <AdminSidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AppHeader />
        <ScrollArea className="flex-1">
          <div className="px-3 py-4 sm:px-4 md:px-6 max-w-7xl mx-auto transition-all duration-300 animate-fade-in overflow-x-hidden">
            {children}
          </div>
        </ScrollArea>
      </SidebarInset>
    </AdminSidebarProvider>
  );
} 