import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAddressStore } from "@/stores/addressStore";
import { useNavigate } from "react-router-dom";
import { User, Heart, ShoppingBag, LogOut, Package, MapPin, Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore(state => state.items);
  const wishlistItems = useWishlistStore(state => state.items);
  const { addresses, loadAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddressStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    full_name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
      loadAddresses(user.id);
    }
  }, [isAuthenticated, user, loadAddresses]);

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true);
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      // Query by user_id if available, otherwise by email
      if (user?.id) {
        query = query.eq('user_id', user.id);
      } else if (user?.email) {
        query = query.eq('customer_email', user.email);
      } else {
        setIsLoadingOrders(false);
        return;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleAddAddress = async () => {
    if (!user?.id) return;

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, addressForm);
        toast.success("Address updated!");
      } else {
        await addAddress(user.id, {
          ...addressForm,
          is_default: addresses.length === 0,
        });
        toast.success("Address saved!");
      }
      setIsAddressDialogOpen(false);
      setEditingAddress(null);
      setAddressForm({
        label: "",
        full_name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label || "",
      full_name: address.full_name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setIsAddressDialogOpen(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      await deleteAddress(addressId);
      toast.success("Address deleted");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user?.id) return;
    
    try {
      await setDefaultAddress(addressId, user.id);
      toast.success("Default address updated");
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Profile</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              {user?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
              {user?.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
              </div>
              )}
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Shopping Summary
              </CardTitle>
              <CardDescription>Your current activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cart Items</span>
                <span className="font-semibold">{cartItems.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Wishlist Items</span>
                <span className="font-semibold">{wishlistItems.length}</span>
              </div>
              <Button onClick={() => navigate("/wishlist")} variant="outline" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                View Wishlist
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Saved Addresses */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Saved Addresses
                </CardTitle>
                <CardDescription>Manage your delivery addresses</CardDescription>
              </div>
              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        label: "",
                        full_name: user?.name || "",
                        phone: "",
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                    <DialogDescription>Save an address for faster checkout</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="label">Label (Optional)</Label>
                      <Input
                        id="label"
                        placeholder="Home, Work, etc."
                        value={addressForm.label}
                        onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={addressForm.full_name}
                        onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        required
                      />
                    </div>
                    <Button onClick={handleAddAddress} className="w-full">
                      {editingAddress ? "Update Address" : "Save Address"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {addresses.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No saved addresses</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">
                            {address.label || "Address"}
                            {address.is_default && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </span>
                        </div>
                        <p className="text-sm">{address.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.address}, {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-muted-foreground">Phone: {address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        {!address.is_default && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAddress(address)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order History
            </CardTitle>
            <CardDescription>Your recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingOrders ? (
              <p className="text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">Order #{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.status}
                        </p>
                      </div>
                    </div>
                    {order.shipping_address && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {typeof order.shipping_address === 'object' 
                          ? `${order.shipping_address.address}, ${order.shipping_address.city}`
                          : 'Address on file'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
