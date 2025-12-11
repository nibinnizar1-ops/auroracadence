import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';

interface WishlistStore {
  items: ShopifyProduct[];
  isSyncing: boolean;
  addItem: (product: ShopifyProduct) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncToDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
  mergeWithDatabase: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,

      addItem: async (product) => {
        const { items } = get();
        if (!items.find(item => item.node.id === product.node.id)) {
          const updatedItems = [...items, product];
          set({ items: updatedItems });
          
          // Sync to database if user is logged in
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            get().syncToDatabase(session.user.id).catch(console.error);
          }
        }
      },

      removeItem: async (productId) => {
        const updatedItems = get().items.filter(item => item.node.id !== productId);
        set({ items: updatedItems });
        
        // Remove from database if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', session.user.id)
            .eq('product_id', productId);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.node.id === productId);
      },

      clearWishlist: async () => {
        set({ items: [] });
        
        // Clear from database if user is logged in
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase
              .from('wishlist_items')
              .delete()
              .eq('user_id', session.user.id);
          }
        } catch (error) {
          // Ignore errors when clearing (user might be logged out)
          console.error('Error clearing wishlist from database:', error);
        }
      },

      // Sync current wishlist items to database
      syncToDatabase: async (userId: string) => {
        const { items } = get();
        if (items.length === 0) return;

        set({ isSyncing: true });
        try {
          // Delete existing wishlist items for this user
          await supabase
            .from('wishlist_items')
            .delete()
            .eq('user_id', userId);

          // Insert current wishlist items
          const wishlistItemsToInsert = items.map(item => ({
            user_id: userId,
            product_id: item.node.id,
            product_data: item,
          }));

          if (wishlistItemsToInsert.length > 0) {
            await supabase
              .from('wishlist_items')
              .insert(wishlistItemsToInsert);
          }
        } catch (error) {
          console.error('Error syncing wishlist to database:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Load wishlist items from database
      loadFromDatabase: async (userId: string) => {
        set({ isSyncing: true });
        try {
          const { data, error } = await supabase
            .from('wishlist_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            const wishlistItems: ShopifyProduct[] = data.map((item: any) => 
              item.product_data as ShopifyProduct
            );

            set({ items: wishlistItems });
          }
        } catch (error) {
          console.error('Error loading wishlist from database:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Merge localStorage wishlist with database wishlist
      mergeWithDatabase: async (userId: string) => {
        const { items: localItems } = get();
        
        set({ isSyncing: true });
        try {
          // Load from database
          const { data: dbItems, error } = await supabase
            .from('wishlist_items')
            .select('*')
            .eq('user_id', userId);

          if (error) throw error;

          if (!dbItems || dbItems.length === 0) {
            // No database items, sync local to database
            if (localItems.length > 0) {
              await get().syncToDatabase(userId);
            }
            return;
          }

          // Convert database items to ShopifyProduct format
          const dbWishlistItems: ShopifyProduct[] = dbItems.map((item: any) => 
            item.product_data as ShopifyProduct
          );

          // Merge: prefer database items, but keep local items not in database
          const mergedItems: ShopifyProduct[] = [...dbWishlistItems];
          
          localItems.forEach(localItem => {
            const existsInDb = dbWishlistItems.some(dbItem => dbItem.node.id === localItem.node.id);
            if (!existsInDb) {
              mergedItems.push(localItem);
            }
          });

          set({ items: mergedItems });
          
          // Sync merged wishlist back to database
          await get().syncToDatabase(userId);
        } catch (error) {
          console.error('Error merging wishlist:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
