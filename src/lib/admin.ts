import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Error in isAdmin:', error);
    return false;
  }
}

/**
 * Get admin status for current user (cached)
 */
let adminStatusCache: { isAdmin: boolean; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getAdminStatus(forceRefresh = false): Promise<boolean> {
  const now = Date.now();
  
  if (!forceRefresh && adminStatusCache && (now - adminStatusCache.timestamp) < CACHE_DURATION) {
    return adminStatusCache.isAdmin;
  }

  const isAdminUser = await isAdmin();
  adminStatusCache = { isAdmin: isAdminUser, timestamp: now };
  return isAdminUser;
}

/**
 * Clear admin status cache (useful after logout)
 */
export function clearAdminCache(): void {
  adminStatusCache = null;
}



