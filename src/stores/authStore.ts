import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock login - in production, this would call an API
        const storedUsers = localStorage.getItem('demo-users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        
        const user = users.find((u: any) => u.email === email && u.password === password);
        
        if (user) {
          set({ 
            user: { id: user.id, email: user.email, name: user.name },
            isAuthenticated: true 
          });
          return true;
        }
        return false;
      },

      signup: async (email: string, password: string, name: string) => {
        // Mock signup - in production, this would call an API
        const storedUsers = localStorage.getItem('demo-users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        
        // Check if user exists
        if (users.find((u: any) => u.email === email)) {
          return false;
        }
        
        const newUser = {
          id: crypto.randomUUID(),
          email,
          password,
          name,
        };
        
        users.push(newUser);
        localStorage.setItem('demo-users', JSON.stringify(users));
        
        set({ 
          user: { id: newUser.id, email: newUser.email, name: newUser.name },
          isAuthenticated: true 
        });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
