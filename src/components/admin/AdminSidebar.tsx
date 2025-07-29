import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  X, 
  Menu, 
  BookOpen, 
  FileText, 
  Upload, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpen, setOpenMobile, isMobile: sidebarIsMobile, open, openMobile, toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  
  const adminMenuItems = [
    { 
      label: t('admin.dashboard'), 
      icon: LayoutDashboard, 
      href: '/admin',
      description: t('admin.manageContent')
    },
    { 
      label: t('admin.specialties'), 
      icon: BookOpen, 
      href: '/admin?tab=specialties',
      description: 'Manage specialties'
    },
    { 
      label: t('admin.lectures'), 
      icon: FileText, 
      href: '/admin?tab=lectures',
      description: 'Manage lectures'
    },
    { 
      label: t('admin.users'), 
      icon: Users, 
      href: '/admin?tab=users',
      description: 'Manage users'
    },
    { 
      label: t('admin.importQuestions'), 
      icon: Upload, 
      href: '/admin/import',
      description: 'Import QROC questions'
    },
    { 
      label: t('admin.reports'), 
      icon: AlertTriangle, 
      href: '/admin?tab=reports',
      description: 'View reports'
    },
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/auth');
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      toast({
        title: t('auth.signOutError'),
        description: t('auth.unexpectedError'),
        variant: "destructive",
      });
    }
  };

  const handleCloseSidebar = () => {
    if (sidebarIsMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
  };

  const handleToggleSidebar = () => {
    toggleSidebar();
  };

  const handleBackToMain = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader className="border-b p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleSidebar}
                  className="hidden md:flex"
                >
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              )}
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseSidebar}
                  className="md:hidden"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close sidebar</span>
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToMain}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                {state === "expanded" && (
                  <span className="font-semibold text-sm">Admin Panel</span>
                )}
              </div>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map((item) => {
                    const isActive = pathname === item.href || 
                      (item.href.includes('?tab=') && pathname === '/admin' && 
                       new URLSearchParams(item.href.split('?')[1]).get('tab') === 
                       new URLSearchParams(window.location.search).get('tab')) ||
                      (pathname.startsWith('/admin/import') && item.href === '/admin/import') ||
                      (pathname.startsWith('/admin/lecture/') && item.href === '/admin?tab=lectures');
                    
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton 
                          asChild 
                          tooltip={item.label}
                          className={isActive ? "bg-primary text-primary-foreground" : ""}
                        >
                          <Link href={item.href} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
        
        <SidebarFooter className="border-t p-3">
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                  title={t('auth.signOut')}
                >
                  <LogOut className="h-4 w-4" />
                  {state === "expanded" && <span className="ml-2">{t('auth.signOut')}</span>}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>{t('auth.signOut')}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
    </>
  );
}

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} className="w-full">
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </SidebarProvider>
  );
} 