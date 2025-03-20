
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SignupHelper } from "@/components/auth/SignupHelper";

const Index = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if not loading and user is logged in
    if (!isLoading && user) {
      navigate("/dashboard");
    }
  }, [user, navigate, isLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-foreground">MedEd Navigator</h1>
        <p className="text-muted-foreground">Your medical education platform</p>
      </div>
      
      {isLoading ? (
        <div className="text-center">
          <div className="animate-pulse-subtle">
            <div className="h-4 w-24 bg-muted rounded mx-auto"></div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-6">
          {!user && (
            <>
              <SignupHelper />
              <p className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <a 
                  href="/auth" 
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </a>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Index;
