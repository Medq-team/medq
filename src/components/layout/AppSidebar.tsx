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
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, UserCircle, Settings, Users, Moon, Sun, LogOut, Stethoscope } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { toast } from '@/hooks/use-toast';

export function AppSidebar() {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpen } = useSidebar();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const isDashboard = pathname === '/dashboard';
    // Don't force sidebar state change on route change - only on initial load
    setOpen(isDashboard);
  }, [pathname, setOpen]);
  
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

  return (
    <>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-6 w-6" />
            <span className="font-semibold">{t('app.name')}</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
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
        <SidebarFooter className="border-t p-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  {t('theme.light')}
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  {t('theme.dark')}
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t('auth.signOut')}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger />
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
