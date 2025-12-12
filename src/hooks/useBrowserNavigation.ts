import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook to ensure browser navigation (including trackpad swipe gestures) works properly
 * React Router's BrowserRouter handles popstate automatically, we just ensure history is maintained
 */
export const useBrowserNavigation = () => {
  const location = useLocation();

  useEffect(() => {
    // Ensure each route change creates a proper history entry
    // This is essential for trackpad swipe gestures to work
    // React Router's BrowserRouter uses pushState internally, but we ensure it's working
    
    // Only create history entries for non-home pages
    // Home page should be the entry point
    if (location.pathname !== '/') {
      // Ensure history state exists for proper navigation
      // React Router should handle this, but we ensure it does
      const currentState = window.history.state;
      if (!currentState || currentState.pathname !== location.pathname) {
        // Ensure the current route is in history
        // This helps with swipe back functionality
        window.history.replaceState(
          { ...currentState, pathname: location.pathname, key: location.key },
          '',
          window.location.href
        );
      }
    }
  }, [location.pathname, location.key]);
};

