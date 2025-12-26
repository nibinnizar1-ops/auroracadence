import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();
  const syncSession = useAuthStore((state) => state.syncSession);

  useEffect(() => {
    let isMounted = true;
    let redirectTimer: number | null = null;

    const handleAuthCallback = async () => {
      try {
        // Check for error in URL hash first
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          console.error("OAuth error:", error, errorDescription);
          toast.error(`Authentication failed: ${errorDescription || error}`);
          if (isMounted) {
            redirectTimer = window.setTimeout(() => navigate("/"), 2000);
          }
          return;
        }

        // Wait a moment for Supabase to process the OAuth callback
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Auth callback error:", sessionError);
          toast.error(`Authentication failed: ${sessionError.message}`);
          if (isMounted) {
            redirectTimer = window.setTimeout(() => navigate("/"), 2000);
          }
          return;
        }

        if (session?.user) {
          // Sync the session with the auth store
          await syncSession();
          
          // Clear any existing redirect timers
          if (redirectTimer) {
            clearTimeout(redirectTimer);
          }
          
          // Only navigate if component is still mounted
          if (isMounted) {
            toast.success("Successfully signed in!");
            // Use replace instead of navigate to prevent back button issues
            navigate("/", { replace: true });
          }
        } else {
          // No session found - might need to wait a bit more
          const accessToken = hashParams.get('access_token');
          if (accessToken) {
            // Wait a bit more for Supabase to process
            setTimeout(async () => {
              if (!isMounted) return;
              
              const { data: { session: retrySession } } = await supabase.auth.getSession();
              if (retrySession?.user) {
                await syncSession();
                toast.success("Successfully signed in!");
                navigate("/", { replace: true });
              } else {
                toast.error("No session found. Please try again.");
                navigate("/", { replace: true });
              }
            }, 1000);
          } else {
            toast.error("No session found. Please try again.");
            if (isMounted) {
              navigate("/", { replace: true });
            }
          }
        }
      } catch (error: any) {
        console.error("Unexpected error during auth callback:", error);
        toast.error(`An unexpected error occurred: ${error.message || "Please try again."}`);
        if (isMounted) {
          navigate("/", { replace: true });
        }
      }
    };

    handleAuthCallback();

    // Cleanup function to prevent memory leaks and multiple navigations
    return () => {
      isMounted = false;
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [navigate, syncSession]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

