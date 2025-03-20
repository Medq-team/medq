
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
      <SidebarInset className="bg-background/95 backdrop-blur-sm">
        <AppHeader />
        <ScrollArea className="h-[calc(100vh-64px)]">
          <main className="px-4 py-6 md:px-6 max-w-7xl mx-auto transition-all duration-300 animate-fade-in">
            {children}
          </main>
        </ScrollArea>
      </SidebarInset>
    </AppSidebarProvider>
  );
}
