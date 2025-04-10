
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { BackgroundTasksProvider } from "@/contexts/BackgroundTasksContext";
import { TaskIndicator } from "@/components/tasks/TaskIndicator";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import SpecialtyPage from "./pages/SpecialtyPage";
import LecturePage from "./pages/LecturePage";
import AdminPage from "./pages/AdminPage";
import AdminLecturePage from "./pages/AdminLecturePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BackgroundTasksProvider>
        <Toaster />
        <Sonner />
        <TaskIndicator />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/specialty/:specialtyId" element={<SpecialtyPage />} />
          <Route path="/lecture/:lectureId" element={<LecturePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/lecture/:lectureId" element={<AdminLecturePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BackgroundTasksProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
