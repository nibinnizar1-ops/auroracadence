import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getAllStoreLocations,
  deleteStoreLocation,
  updateStoreLocation,
  createStoreLocation,
  uploadStoreImage,
  type StoreLocation
} from "@/lib/admin-stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { toast } from "sonner";
import bannerCollection from "@/assets/banner-collection.jpg";
import bannerLuxury from "@/assets/banner-luxury.jpg";
import heroImage1 from "@/assets/hero-jewelry-1.jpg";
import heroImage2 from "@/assets/hero-jewelry-2.jpg";

export default function Stores() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<StoreLocation[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const defaultStores = [
    { name: "He & She", location: "Madannada, Kollam", description: "A warm, curated space where everyday elegance meets effortless style.", image_url: bannerCollection, position: 0 },
    { name: "Salon de R", location: "Polayathode, Kollam", description: "A boutique experience blending fashion, beauty and contemporary jewellery.", image_url: bannerLuxury, position: 1 },
    { name: "Rock Paper", location: "Polayathode, Kollam", description: "Youthful, modern and expressive — perfect for trend-led, stylish finds.", image_url: heroImage1, position: 2 },
    { name: "Go Girl", location: "Trivandrum / Kollam", description: "A chic destination crafted for women who love sparkle, confidence and self-expression.", image_url: heroImage2, position: 3 },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await getAllStoreLocations();
    setItems(data);
    setLoading(false);
  };

  const handleToggleActive = async (item: StoreLocation) => {
    const { error } = await updateStoreLocation(item.id, { is_active: !item.is_active });
    if (error) {
      toast.error("Failed to update store");
    } else {
      toast.success(`Store ${!item.is_active ? 'activated' : 'deactivated'}`);
      loadItems();
    }
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    const { error } = await deleteStoreLocation(itemId);
    if (error) {
      toast.error("Failed to delete store");
    } else {
      toast.success("Store deleted");
      loadItems();
    }
  };

  const handleImageReplace = async (store: StoreLocation | typeof defaultStores[0], file: File) => {
    const key = 'id' in store ? `item-${store.id}` : `default-${store.position}`;
    setUploading(key);

    try {
      const { url, error: uploadError } = await uploadStoreImage(file);
      if (uploadError || !url) {
        const errorMessage = uploadError?.message || uploadError?.toString() || "Unknown error";
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload image: ${errorMessage}`);
        return;
      }

      // Check if it's an existing item or a default store
      if ('id' in store) {
        // Existing item - just update
        const { error } = await updateStoreLocation(store.id, { image_url: url });
        if (error) {
          toast.error("Failed to update store");
        } else {
          toast.success("Store updated!");
          loadItems();
        }
      } else {
        // Default store - check if exists or create
        const existingItem = items.find(i => i.name === store.name);
        
        if (existingItem) {
          const { error } = await updateStoreLocation(existingItem.id, { image_url: url });
          if (error) {
            toast.error("Failed to update store");
          } else {
            toast.success("Store updated!");
            loadItems();
          }
        } else {
          const { data, error } = await createStoreLocation({
            name: store.name,
            location: store.location,
            description: store.description,
            image_url: url,
            position: store.position,
            is_active: true,
          });
          if (error || !data) {
            toast.error("Failed to create store");
          } else {
            toast.success("Store created!");
            loadItems();
          }
        }
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setUploading(null);
    }
  };

  const handleFileSelect = (store: StoreLocation | typeof defaultStores[0], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageReplace(store, file);
    e.target.value = "";
  };

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="text-center py-8">Loading...</div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Store Locations</h1>
            <p className="text-muted-foreground mt-1">
              Hover over images to replace them. Manage "Try Love. Take Home." section
            </p>
          </div>

          {/* Always show all default images, merge with database items */}
          <Card>
            <CardHeader>
              <CardTitle>Store Locations</CardTitle>
              <p className="text-sm text-muted-foreground">Hover over any image to replace it</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {defaultStores.map((store) => {
                  const existingItem = items.find(i => i.name === store.name);
                  const displayImage = existingItem?.image_url || store.image_url;
                  const key = existingItem ? `item-${existingItem.id}` : `default-${store.position}`;
                  const isUploading = uploading === key;
                  return (
                    <div key={store.position} className="relative group">
                      <input
                        ref={(el) => fileInputRefs.current[key] = el}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(existingItem || store, e)}
                        className="hidden"
                      />
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                        <img 
                          src={displayImage} 
                          alt={store.name} 
                          className="w-full h-full object-cover"
                        />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                            <p className="text-white text-sm">Uploading...</p>
                          </div>
                        )}
                        {existingItem && !existingItem.is_active && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-5">
                            <span className="text-white font-semibold text-sm">Inactive</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => fileInputRefs.current[key]?.click()}
                            disabled={isUploading}
                            className="bg-white text-black hover:bg-white/90"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Replace
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex-1 text-center">
                          <p className="text-xs text-muted-foreground">{store.name}</p>
                          <p className="text-xs text-muted-foreground">{store.location}</p>
                        </div>
                        {existingItem && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                              <Link to={`/admin/stores/${existingItem.id}/edit`}>
                                <Edit className="h-3 w-3" />
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

