
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Home, Book, Settings, UserCircle, LogOut } from 'lucide-react';

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppSidebarProvider({ children }: AppSidebarProps) {
  return (
    <SidebarProvider defaultOpen={true} className="w-full">
      <div className="flex min-h-screen w-full">
        {children}
      </div>
    </SidebarProvider>
  );
}

export function AppSidebar() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  
  const menuItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Profile', icon: UserCircle, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  if (isAdmin) {
    menuItems.push({ label: 'Admin', icon: Book, href: '/admin' });
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="flex h-14 items-center px-4 border-b">
        <Link to="/dashboard" className="flex items-center font-semibold">
          MedQ
        </Link>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
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
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
      </SidebarContent>
      
      <SidebarFooter className="border-t py-4">
        <p className="text-xs text-center text-muted-foreground">
          {user?.email}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
