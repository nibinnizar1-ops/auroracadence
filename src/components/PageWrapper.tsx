import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBrowserNavigation } from "@/hooks/useBrowserNavigation";

/**
 * Wrapper component to ensure proper navigation history tracking
 * This enables trackpad swipe gestures to work correctly
 */
export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  useBrowserNavigation();

  useEffect(() => {
    // Ensure each route change creates a proper history entry
    // This is essential for trackpad swipe gestures to work
    // Only push state if we're not on the home page (home should be the entry point)
    if (location.pathname !== '/') {
      // Ensure history state exists for proper navigation
      const currentState = window.history.state;
      if (!currentState || !currentState.key) {
        // Create history state for this route
        window.history.replaceState(
          { key: location.key, pathname: location.pathname },
          '',
          window.location.href
        );
      }
    }

    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.key]);

  return <>{children}</>;
};

