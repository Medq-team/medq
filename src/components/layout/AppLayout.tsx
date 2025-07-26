
import React from 'react';
import { AppHeader } from './AppHeader';
import { AppSidebar, AppSidebarProvider } from './AppSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <AppSidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <ScrollArea className="flex-1">
          <div className="px-3 py-4 sm:px-4 md:px-6 max-w-7xl mx-auto transition-all duration-300 animate-fade-in overflow-x-hidden">
            {children}
          </div>
        </ScrollArea>
      </SidebarInset>
    </AppSidebarProvider>
  );
}
