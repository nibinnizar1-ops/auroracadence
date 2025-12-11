import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ShopifyProduct, createStorefrontCheckout } from '@/lib/shopify';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantity: number;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<void>;
  syncToDatabase: (userId: string) => Promise<void>;
  loadFromDatabase: (userId: string) => Promise<void>;
  mergeWithDatabase: (userId: string) => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        let updatedItems: CartItem[];
        if (existingItem) {
          updatedItems = items.map(i =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          updatedItems = [...items, item];
        }
        
        set({ items: updatedItems });
        
        // Sync to database if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          get().syncToDatabase(session.user.id).catch(console.error);
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        
        const updatedItems = get().items.map(item =>
          item.variantId === variantId ? { ...item, quantity } : item
        );
        
        set({ items: updatedItems });
        
        // Sync to database if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          get().syncToDatabase(session.user.id).catch(console.error);
        }
      },

      removeItem: async (variantId) => {
        const updatedItems = get().items.filter(item => item.variantId !== variantId);
        set({ items: updatedItems });
        
        // Remove from database if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', session.user.id)
            .eq('variant_id', variantId);
        }
      },

      clearCart: async () => {
        set({ items: [], cartId: null, checkoutUrl: null });
        
        // Clear from database if user is logged in
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', session.user.id);
          }
        } catch (error) {
          // Ignore errors when clearing (user might be logged out)
          console.error('Error clearing cart from database:', error);
        }
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return;

        setLoading(true);
        try {
          const checkoutUrl = await createStorefrontCheckout(items);
          setCheckoutUrl(checkoutUrl);
        } catch (error) {
          console.error('Failed to create checkout:', error);
        } finally {
          setLoading(false);
        }
      },

      // Sync current cart items to database
      syncToDatabase: async (userId: string) => {
        const { items } = get();
        if (items.length === 0) return;

        set({ isSyncing: true });
        try {
          // Delete existing cart items for this user
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

          // Insert current cart items
          const cartItemsToInsert = items.map(item => ({
            user_id: userId,
            product_id: item.product.node.id,
            variant_id: item.variantId,
            variant_title: item.variantTitle,
            quantity: item.quantity,
            price: item.price,
            product_data: item.product,
          }));

          if (cartItemsToInsert.length > 0) {
            await supabase
              .from('cart_items')
              .insert(cartItemsToInsert);
          }
        } catch (error) {
          console.error('Error syncing cart to database:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Load cart items from database
      loadFromDatabase: async (userId: string) => {
        set({ isSyncing: true });
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

          if (error) throw error;

          if (data && data.length > 0) {
            const cartItems: CartItem[] = data.map((item: any) => ({
              product: item.product_data as ShopifyProduct,
              variantId: item.variant_id,
              variantTitle: item.variant_title || '',
              price: item.price,
              quantity: item.quantity,
              selectedOptions: [], // Can be stored in product_data if needed
            }));

            set({ items: cartItems });
          }
        } catch (error) {
          console.error('Error loading cart from database:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Merge localStorage cart with database cart
      mergeWithDatabase: async (userId: string) => {
        const { items: localItems } = get();
        
        set({ isSyncing: true });
        try {
          // Load from database
          const { data: dbItems, error } = await supabase
            .from('cart_items')
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

          // Convert database items to CartItem format
          const dbCartItems: CartItem[] = dbItems.map((item: any) => ({
            product: item.product_data as ShopifyProduct,
            variantId: item.variant_id,
            variantTitle: item.variant_title || '',
            price: item.price,
            quantity: item.quantity,
            selectedOptions: [],
          }));

          // Merge: prefer database items, but keep local items not in database
          const mergedItems: CartItem[] = [...dbCartItems];
          
          localItems.forEach(localItem => {
            const existsInDb = dbCartItems.some(dbItem => dbItem.variantId === localItem.variantId);
            if (!existsInDb) {
              mergedItems.push(localItem);
            }
          });

          set({ items: mergedItems });
          
          // Sync merged cart back to database
          await get().syncToDatabase(userId);
        } catch (error) {
          console.error('Error merging cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
