
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from '@/lib/supabase';
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
  const { user, isAdmin, refreshUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { state, setOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  
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
      const { error } = await signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: t('auth.signOutError'),
          description: (error as any)?.message || t('auth.unexpectedError'),
          variant: "destructive",
        });
        return;
      }
      
      // Force refresh the user state to ensure UI updates
      await refreshUser();
      
      // Navigate to auth page after successful sign out
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar className="border-r dark:border-gray-800 dark:bg-[#1A1F2C] shadow-sm transition-all duration-200" collapsible="icon">
      <SidebarHeader className="flex h-14 items-center px-4 border-b dark:border-gray-800 relative">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center bg-primary text-primary-foreground rounded-md w-8 h-8">
              <Stethoscope className="h-5 w-5" />
            </span>
            <span className={`font-bold text-primary ${state === 'collapsed' ? 'hidden' : 'block'}`}>{t('app.name')}</span>
          </div>
        </div>
        <SidebarTrigger className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50 shadow-sm" />
      </SidebarHeader>
      
      <SidebarContent className="dark:bg-[#1A1F2C]">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                      className="dark:hover:bg-gray-800/60"
                    >
                      <Link href={item.href} className="transition-colors dark:text-gray-300">
                        <item.icon className="text-foreground dark:text-gray-300" />
                        <span className="dark:text-gray-300">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={theme === 'dark' ? t('sidebar.lightMode') : t('sidebar.darkMode')}
                    className="dark:hover:bg-gray-800/60"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 dark:hover:bg-gray-800/60"
                      onClick={toggleTheme}
                    >
                      {theme === 'dark' ? <Sun className="text-gray-300" /> : <Moon />}
                      <span className="dark:text-gray-300">{theme === 'dark' ? t('sidebar.lightMode') : t('sidebar.darkMode')}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={t('auth.signOut')}
                    className="text-destructive dark:hover:bg-gray-800/60"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2 dark:hover:bg-gray-800/60"
                      onClick={handleSignOut}
                    >
                      <LogOut className="dark:text-gray-300" />
                      <span className="dark:text-gray-300">{t('auth.signOut')}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="border-t dark:border-gray-800 py-2 px-2 dark:bg-[#1A1F2C]">
        {user?.email && (
          <div className={`text-xs text-muted-foreground dark:text-gray-400 ${state === 'collapsed' ? 'hidden' : 'block'} truncate px-2`}>
            {user.email}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
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
