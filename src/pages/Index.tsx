import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not loading
    if (!isLoading) {
      // If user is logged in, redirect to dashboard
      // Otherwise redirect to login page
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    }
  }, [user, navigate, isLoading]);

  // Simple loading state while redirection happens
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Loading...</h1>
        <div className="animate-pulse-subtle">
          <div className="h-4 w-24 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
