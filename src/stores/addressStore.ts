import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface UserAddress {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface AddressStore {
  addresses: UserAddress[];
  isLoading: boolean;
  loadAddresses: (userId: string) => Promise<void>;
  addAddress: (userId: string, address: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAddress: (addressId: string, address: Partial<UserAddress>) => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  setDefaultAddress: (addressId: string, userId: string) => Promise<void>;
  getDefaultAddress: () => UserAddress | null;
}

export const useAddressStore = create<AddressStore>()((set, get) => ({
  addresses: [],
  isLoading: false,

  loadAddresses: async (userId: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ addresses: (data as UserAddress[]) || [] });
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (userId: string, addressData) => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: userId,
          ...addressData,
        })
        .select()
        .single();

      if (error) throw error;

      set({ addresses: [...get().addresses, data as UserAddress] });
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  updateAddress: async (addressId: string, addressData: Partial<UserAddress>) => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .update(addressData)
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;

      set({
        addresses: get().addresses.map(addr =>
          addr.id === addressId ? (data as UserAddress) : addr
        ),
      });
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  deleteAddress: async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      set({
        addresses: get().addresses.filter(addr => addr.id !== addressId),
      });
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  setDefaultAddress: async (addressId: string, userId: string) => {
    try {
      // First, unset all default addresses
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Then set the selected address as default
      const { data, error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;

      set({
        addresses: get().addresses.map(addr => ({
          ...addr,
          is_default: addr.id === addressId,
        })),
      });
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  },

  getDefaultAddress: () => {
    const addresses = get().addresses;
    return addresses.find(addr => addr.is_default) || addresses[0] || null;
  },
}));

