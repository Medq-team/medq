
import React from 'react';
import { AppHeader } from './AppHeader';
import { AppSidebar, AppSidebarProvider } from './AppSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppSidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <ScrollArea className="h-[calc(100vh-64px)]">
          <main className="px-4 py-6 md:px-6">
            {children}
          </main>
        </ScrollArea>
      </SidebarInset>
    </AppSidebarProvider>
  );
}
