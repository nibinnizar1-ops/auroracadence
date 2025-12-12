import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Component to handle trackpad swipe back gestures
 * Works on all pages except home page
 */
export const SwipeBackHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle browser back/forward navigation (including trackpad swipes)
    const handlePopState = (event: PopStateEvent) => {
      // Don't allow going back from home page
      if (location.pathname === '/') {
        // If user swipes back from home, prevent it by pushing home again
        window.history.pushState(null, '', '/');
        return;
      }

      // For all other pages, navigate back
      // Check if we have history to go back to
      if (window.history.length > 1) {
        // Use React Router's navigate to go back
        // This ensures React Router's state is updated
        navigate(-1);
      } else {
        // No history, go to home
        navigate('/', { replace: true });
      }
    };

    // Add listener for browser navigation events (including trackpad swipes)
    // Use capture phase and non-passive to ensure we can handle it
    window.addEventListener("popstate", handlePopState, false);

    return () => {
      window.removeEventListener("popstate", handlePopState, false);
    };
  }, [location.pathname, navigate]);

  return null; // This component doesn't render anything
};

