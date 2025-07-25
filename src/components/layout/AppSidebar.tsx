import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
import { LayoutDashboard, UserCircle, Settings, Users, Moon, Sun, LogOut, X, Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function AppSidebar() {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpen, setOpenMobile, isMobile: sidebarIsMobile, open, openMobile, toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { label: t('sidebar.dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('sidebar.profile'), icon: UserCircle, href: '/profile' },
    { label: t('sidebar.settings'), icon: Settings, href: '/settings' },
  ];

  if (isAdmin) {
    menuItems.push({ label: t('sidebar.admin'), icon: Users, href: '/admin' });
  }

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

  return (
    <>
      <Sidebar className="border-r" collapsible="icon">
        <SidebarHeader className="border-b p-3">
          <div className="flex items-center">
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
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <Link href={item.href} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="border-t p-1">
          <div className="space-y-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  title={theme === 'dark' ? t('theme.light') : t('theme.dark')}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4" />
                      {state === "expanded" && <span className="ml-2">{t('theme.light')}</span>}
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      {state === "expanded" && <span className="ml-2">{t('theme.dark')}</span>}
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p>{theme === 'dark' ? t('theme.light') : t('theme.dark')}</p>
              </TooltipContent>
            </Tooltip>
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

export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} className="w-full">
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </SidebarProvider>
  );
}
