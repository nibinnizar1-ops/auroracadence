import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  phone?: string;
  email?: string;
  name: string;
  avatar_url?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  signup: (phone: string, password: string, name: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  syncSession: () => Promise<void>;
}

// Helper function to map Supabase user to our User interface
const mapSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    phone: supabaseUser.phone,
    name: supabaseUser.user_metadata?.full_name || 
          supabaseUser.user_metadata?.name || 
          supabaseUser.email?.split('@')[0] || 
          'User',
    avatar_url: supabaseUser.user_metadata?.avatar_url || 
                supabaseUser.user_metadata?.picture,
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // Initialize auth state from Supabase session
      initializeAuth: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const user = mapSupabaseUser(session.user);
          set({ 
            user, 
            isAuthenticated: true 
          });
          
          // Sync cart and wishlist from database
          setTimeout(async () => {
            try {
              const cartStore = (await import('@/stores/cartStore')).useCartStore.getState();
              const wishlistStore = (await import('@/stores/wishlistStore')).useWishlistStore.getState();
              const addressStore = (await import('@/stores/addressStore')).useAddressStore.getState();
              
              await cartStore.mergeWithDatabase(session.user.id);
              await wishlistStore.mergeWithDatabase(session.user.id);
              await addressStore.loadAddresses(session.user.id);
            } catch (error) {
              console.error('Error syncing user data:', error);
            }
          }, 100);
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
          if (session?.user) {
            const user = mapSupabaseUser(session.user);
            set({ 
              user, 
              isAuthenticated: true 
            });
            
            // Sync cart and wishlist from database on login
            setTimeout(async () => {
              try {
                const cartStore = (await import('@/stores/cartStore')).useCartStore.getState();
                const wishlistStore = (await import('@/stores/wishlistStore')).useWishlistStore.getState();
                const addressStore = (await import('@/stores/addressStore')).useAddressStore.getState();
                
                await cartStore.mergeWithDatabase(session.user.id);
                await wishlistStore.mergeWithDatabase(session.user.id);
                await addressStore.loadAddresses(session.user.id);
              } catch (error) {
                console.error('Error syncing user data:', error);
              }
            }, 100);
          } else {
            set({ 
              user: null, 
              isAuthenticated: false 
            });
            
            // Clear address store on logout (cart/wishlist stay in localStorage)
            setTimeout(async () => {
              try {
                const addressStore = (await import('@/stores/addressStore')).useAddressStore.getState();
                if (addressStore.addresses.length > 0) {
                  (await import('@/stores/addressStore')).useAddressStore.setState({ addresses: [] });
                }
              } catch (error) {
                console.error('Error clearing addresses:', error);
              }
            }, 100);
          }
        });
      },

      // Sync session with Supabase
      syncSession: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const user = mapSupabaseUser(session.user);
          set({ 
            user, 
            isAuthenticated: true 
          });
          
          // Sync cart and wishlist from database
          setTimeout(async () => {
            try {
              const cartStore = (await import('@/stores/cartStore')).useCartStore.getState();
              const wishlistStore = (await import('@/stores/wishlistStore')).useWishlistStore.getState();
              const addressStore = (await import('@/stores/addressStore')).useAddressStore.getState();
              
              await cartStore.mergeWithDatabase(session.user.id);
              await wishlistStore.mergeWithDatabase(session.user.id);
              await addressStore.loadAddresses(session.user.id);
            } catch (error) {
              console.error('Error syncing user data:', error);
            }
          }, 100);
        } else {
          set({ 
            user: null, 
            isAuthenticated: false 
          });
        }
      },

      // Google OAuth sign in
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          throw error;
        }
      },

      login: async (phone: string, password: string) => {
        // Mock login - in production, this would call an API
        const storedUsers = localStorage.getItem('demo-users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        
        const user = users.find((u: any) => u.phone === phone && u.password === password);
        
        if (user) {
          set({ 
            user: { id: user.id, phone: user.phone, name: user.name },
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },

      signup: async (phone: string, password: string, name: string) => {
        // Mock signup - in production, this would call an API
        const storedUsers = localStorage.getItem('demo-users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Check if user exists
        if (users.find((u: any) => u.phone === phone)) {
          return false;
        }
        
        const newUser = {
          id: crypto.randomUUID(),
          phone,
          password,
          name,
        };
        
        users.push(newUser);
        localStorage.setItem('demo-users', JSON.stringify(users));
        
        set({ 
          user: { id: newUser.id, phone: newUser.phone, name: newUser.name },
          isAuthenticated: true 
        });
        return true;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
        
        // Clear cart and wishlist from localStorage on logout
        // (Data is saved in database, will be restored on login)
        setTimeout(async () => {
          try {
            const cartStore = (await import('@/stores/cartStore')).useCartStore.getState();
            const wishlistStore = (await import('@/stores/wishlistStore')).useWishlistStore.getState();
            
            // Clear from store (which also clears localStorage due to persist middleware)
            cartStore.clearCart();
            wishlistStore.clearWishlist();
          } catch (error) {
            console.error('Error clearing cart/wishlist on logout:', error);
          }
        }, 100);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
