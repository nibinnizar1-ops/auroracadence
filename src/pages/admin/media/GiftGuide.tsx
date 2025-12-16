import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getAllGiftGuideItems,
  deleteGiftGuideItem,
  updateGiftGuideItem,
  createGiftGuideItem,
  uploadGiftGuideImage,
  type GiftGuideItem
} from "@/lib/admin-gift-guide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { toast } from "sonner";
import realWife from "@/assets/real-wife.jpg";
import realGirlfriend from "@/assets/real-girlfriend.jpg";
import realMom from "@/assets/real-mom.jpg";
import realSister from "@/assets/real-sister.jpg";
import realFriend from "@/assets/real-friend.jpg";

export default function GiftGuide() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<GiftGuideItem[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const defaultItems = [
    { name: "WIFE", label: "Gifts for", image_url: realWife, href: "/collections", position: 0 },
    { name: "GIRLFRIEND", label: "Gifts for", image_url: realGirlfriend, href: "/collections", position: 1 },
    { name: "MOM", label: "Gifts for", image_url: realMom, href: "/collections", position: 2 },
    { name: "SISTER", label: "Gifts for", image_url: realSister, href: "/collections", position: 3 },
    { name: "BEST FRIEND", label: "Gifts for", image_url: realFriend, href: "/collections", position: 4 },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await getAllGiftGuideItems();
    setItems(data);
    setLoading(false);
  };

  const handleToggleActive = async (item: GiftGuideItem) => {
    const { error } = await updateGiftGuideItem(item.id, { is_active: !item.is_active });
    if (error) {
      toast.error("Failed to update item");
    } else {
      toast.success(`Item ${!item.is_active ? 'activated' : 'deactivated'}`);
      loadItems();
    }
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    const { error } = await deleteGiftGuideItem(itemId);
    if (error) {
      toast.error("Failed to delete item");
    } else {
      toast.success("Item deleted");
      loadItems();
    }
  };

  const handleImageReplace = async (item: GiftGuideItem | typeof defaultItems[0], file: File) => {
    const key = 'id' in item ? `item-${item.id}` : `default-${item.position}`;
    setUploading(key);

    try {
      const { url, error: uploadError } = await uploadGiftGuideImage(file);
      if (uploadError || !url) {
        const errorMessage = uploadError?.message || uploadError?.toString() || "Unknown error";
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload image: ${errorMessage}`);
        return;
      }

      // Check if it's an existing item or a default item
      if ('id' in item) {
        // Existing item - just update
        const { error } = await updateGiftGuideItem(item.id, { image_url: url });
        if (error) {
          toast.error("Failed to update item");
        } else {
          toast.success("Item updated!");
          loadItems();
        }
      } else {
        // Default item - check if exists or create
        const existingItem = items.find(i => i.name === item.name);
        
        if (existingItem) {
          const { error } = await updateGiftGuideItem(existingItem.id, { image_url: url });
          if (error) {
            toast.error("Failed to update item");
          } else {
            toast.success("Item updated!");
            loadItems();
          }
        } else {
          const { data, error } = await createGiftGuideItem({
            name: item.name,
            label: item.label,
            image_url: url,
            href: item.href,
            position: item.position,
            is_active: true,
          });
          if (error || !data) {
            toast.error("Failed to create item");
          } else {
            toast.success("Item created!");
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

  const handleFileSelect = (item: GiftGuideItem | typeof defaultItems[0], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageReplace(item, file);
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
            <h1 className="text-3xl font-bold">Gift Guide</h1>
            <p className="text-muted-foreground mt-1">
              Hover over images to replace them. Manage "Timeless Gifts For Every Relationship" section
            </p>
          </div>

          {/* Always show all default images, merge with database items */}
          <Card>
            <CardHeader>
              <CardTitle>Gift Guide Items</CardTitle>
              <p className="text-sm text-muted-foreground">Hover over any image to replace it</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {defaultItems.map((item) => {
                  const existingItem = items.find(i => i.name === item.name);
                  const displayImage = existingItem?.image_url || item.image_url;
                  const key = existingItem ? `item-${existingItem.id}` : `default-${item.position}`;
                  const isUploading = uploading === key;
                  return (
                    <div key={item.position} className="relative group">
                      <input
                        ref={(el) => fileInputRefs.current[key] = el}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(existingItem || item, e)}
                        className="hidden"
                      />
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                        <img 
                          src={displayImage} 
                          alt={item.name} 
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
                        <p className="text-xs text-muted-foreground text-center flex-1">{item.label} {item.name}</p>
                        {existingItem && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                              <Link to={`/admin/gift-guide/${existingItem.id}/edit`}>
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

