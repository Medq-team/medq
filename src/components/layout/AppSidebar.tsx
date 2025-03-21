
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { LayoutDashboard, UserCircle, Settings, Users, Moon, Sun, LogOut } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppSidebarProvider({ children }: AppSidebarProps) {
  return (
    <SidebarProvider className="w-full">
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </SidebarProvider>
  );
}

export function AppSidebar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const { state, setOpen } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  
  // Set sidebar state based on route
  useEffect(() => {
    const isDashboard = location.pathname === '/dashboard';
    setOpen(isDashboard);
  }, [location.pathname, setOpen]);
  
  const menuItems = [
    { label: t('sidebar.dashboard'), icon: LayoutDashboard, href: '/dashboard' },
    { label: t('sidebar.profile'), icon: UserCircle, href: '/profile' },
    { label: t('sidebar.settings'), icon: Settings, href: '/settings' },
  ];

  if (isAdmin) {
    menuItems.push({ label: t('sidebar.admin'), icon: Users, href: '/admin' });
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar className="border-r dark:border-gray-800 dark:bg-[#1A1F2C]" collapsible="icon">
      <SidebarHeader className="flex h-14 items-center px-4 border-b dark:border-gray-800 relative">
        <div className="flex items-center">
          <span className={`font-bold text-primary ${state === 'collapsed' ? 'hidden' : 'block'}`}>{t('app.name')}</span>
        </div>
        <SidebarTrigger className="absolute right-2 top-1/2 transform -translate-y-1/2 z-50" />
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
                      isActive={location.pathname === item.href}
                      tooltip={item.label}
                      className="dark:hover:bg-gray-800/60"
                    >
                      <Link to={item.href} className="transition-colors dark:text-gray-300">
                        <item.icon className="text-foreground dark:text-gray-300" />
                        <span className="dark:text-gray-300">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                {/* Night Mode Toggle */}
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
