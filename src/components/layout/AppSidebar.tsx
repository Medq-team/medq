
import React from 'react';
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
import { Home, Book, Settings, UserCircle, LogOut, LayoutDashboard, Users, Moon, Sun } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { state } = useSidebar();
  const { theme, setTheme } = useTheme();
  
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Profile', icon: UserCircle, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Admin', icon: Users, href: '/admin' });
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="flex h-14 items-center px-4 border-b relative">
        <Link to="/dashboard" className="flex items-center font-semibold text-primary">
          MedEd Navigator
        </Link>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
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
                    >
                      <Link to={item.href} className="transition-colors">
                        <item.icon className="text-foreground" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                {/* Night Mode Toggle */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2"
                      onClick={toggleTheme}
                    >
                      {theme === 'dark' ? <Sun /> : <Moon />}
                      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip="Sign Out"
                    className="text-destructive"
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-2"
                      onClick={handleSignOut}
                    >
                      <LogOut />
                      <span>Sign out</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="border-t py-2 px-2">
        {user?.email && (
          <div className={`text-xs text-muted-foreground ${state === 'collapsed' ? 'hidden' : 'block'} truncate px-2`}>
            {user.email}
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
