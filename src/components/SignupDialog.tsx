import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { Chrome } from "lucide-react";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export const SignupDialog = ({ open, onOpenChange, onSwitchToLogin }: SignupDialogProps) => {
  const signInWithGoogle = useAuthStore(state => state.signInWithGoogle);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      // The redirect will happen automatically, so we don't need to close the dialog here
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Up</DialogTitle>
          <DialogDescription>Create a new account to get started with Google</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            type="button"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            {isGoogleLoading ? "Signing up..." : "Sign up with Google"}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onSwitchToLogin();
              }}
              className="text-primary hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
