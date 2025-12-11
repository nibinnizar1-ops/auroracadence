import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();
  const syncSession = useAuthStore((state) => state.syncSession);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback - Supabase handles the hash fragments automatically
        // But we need to wait for the session to be established
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Auth callback error:", sessionError);
          toast.error(`Authentication failed: ${sessionError.message}`);
          navigate("/");
          return;
        }

        if (session?.user) {
          // Sync the session with the auth store
          await syncSession();
          toast.success("Successfully signed in!");
          navigate("/");
        } else {
          // Try to get the session from URL hash if it exists
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const error = hashParams.get('error');
          const errorDescription = hashParams.get('error_description');

          if (error) {
            console.error("OAuth error:", error, errorDescription);
            toast.error(`Authentication failed: ${errorDescription || error}`);
            navigate("/");
            return;
          }

          if (accessToken) {
            // Session should be set automatically by Supabase, wait a bit and retry
            setTimeout(async () => {
              const { data: { session: retrySession } } = await supabase.auth.getSession();
              if (retrySession?.user) {
                await syncSession();
                toast.success("Successfully signed in!");
                navigate("/");
              } else {
                toast.error("No session found. Please try again.");
                navigate("/");
              }
            }, 500);
          } else {
            toast.error("No session found. Please try again.");
            navigate("/");
          }
        }
      } catch (error: any) {
        console.error("Unexpected error during auth callback:", error);
        toast.error(`An unexpected error occurred: ${error.message || "Please try again."}`);
        navigate("/");
      }
    };

    handleAuthCallback();
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

