
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { signOut } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Home, Book, Settings, UserCircle, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      navigate('/auth');
    }
  };

  const menuItems = [
    { label: 'Dashboard', icon: <Home className="mr-2 h-4 w-4" />, href: '/dashboard' },
    { label: 'Profile', icon: <UserCircle className="mr-2 h-4 w-4" />, href: '/profile' },
    { label: 'Settings', icon: <Settings className="mr-2 h-4 w-4" />, href: '/settings' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ label: 'Admin', icon: <Book className="mr-2 h-4 w-4" />, href: '/admin' });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      
      <div className="flex flex-1">
        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full shadow-lg"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                <div className="flex h-14 items-center px-4 border-b">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center font-semibold"
                    onClick={() => setOpen(false)}
                  >
                    MedQ
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="ml-auto" 
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>
                <ScrollArea className="flex-1">
                  <div className="px-2 py-4">
                    <nav className="space-y-1">
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted"
                          onClick={() => setOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}
                      <button
                        className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-muted text-destructive"
                        onClick={() => {
                          setOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </button>
                    </nav>
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <aside className="w-64 border-r bg-background flex-shrink-0">
            <div className="flex h-full flex-col">
              <div className="px-2 py-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                  <button
                    className="flex w-full items-center px-3 py-2 text-sm rounded-md hover:bg-muted text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </nav>
              </div>
            </div>
          </aside>
        )}
        
        <main className="flex-1 px-4 py-6 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
