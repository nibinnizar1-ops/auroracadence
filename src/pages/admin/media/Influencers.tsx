import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getAllInfluencerShowcaseItems,
  deleteInfluencerShowcaseItem,
  updateInfluencerShowcaseItem,
  createInfluencerShowcaseItem,
  uploadInfluencerImage,
  type InfluencerShowcaseItem
} from "@/lib/admin-influencers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { toast } from "sonner";

export default function Influencers() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<InfluencerShowcaseItem[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const defaultInfluencers = [
    {
      name: "Aparna Thomas",
      quote: "This design feels so elegant… I love how it completes my look instantly.",
      product_name: "Aurora 18k Gold Layered Necklace",
      product_description: "Minimal, graceful & perfect for elevated everyday styling.",
      image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
      position: 0,
    },
    {
      name: "Thanu",
      quote: "So premium, yet so effortless. It looks beautiful on camera too!",
      product_name: "Swarovski Shine Drop Earrings",
      product_description: "Bright, feminine brilliance for every mood.",
      image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
      position: 1,
    },
    {
      name: "Aziya",
      quote: "I didn't expect it to feel this lightweight. Absolutely love the finish!",
      product_name: "Everyday 18k Gold Hoops",
      product_description: "Soft curves, modern silhouette, zero irritation.",
      image_url: "https://images.unsplash.com/photo-1596944924591-4944e34a1f96?w=400&h=500&fit=crop",
      position: 2,
    },
    {
      name: "Chippy Devassy",
      quote: "This one's such a vibe!! Stylish, subtle and super classy.",
      product_name: "Celeste Gold Pendant",
      product_description: "Understated, timeless & beautifully crafted.",
      image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop",
      position: 3,
    },
    {
      name: "Anjan Sagar",
      quote: "Feels luxury… looks even better in real life.",
      product_name: "Signature 18k Gold Bracelet",
      product_description: "Elegant, chic & made for all-day wear.",
      image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop",
      position: 4,
    },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await getAllInfluencerShowcaseItems();
    setItems(data);
    setLoading(false);
  };

  const handleToggleActive = async (item: InfluencerShowcaseItem) => {
    const { error } = await updateInfluencerShowcaseItem(item.id, { is_active: !item.is_active });
    if (error) {
      toast.error("Failed to update influencer");
    } else {
      toast.success(`Influencer ${!item.is_active ? 'activated' : 'deactivated'}`);
      loadItems();
    }
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    const { error } = await deleteInfluencerShowcaseItem(itemId);
    if (error) {
      toast.error("Failed to delete influencer");
    } else {
      toast.success("Influencer deleted");
      loadItems();
    }
  };

  const handleImageReplace = async (influencer: InfluencerShowcaseItem | typeof defaultInfluencers[0], file: File) => {
    const key = 'id' in influencer ? `item-${influencer.id}` : `default-${influencer.position}`;
    setUploading(key);

    try {
      const { url, error: uploadError } = await uploadInfluencerImage(file);
      if (uploadError || !url) {
        const errorMessage = uploadError?.message || uploadError?.toString() || "Unknown error";
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload image: ${errorMessage}`);
        return;
      }

      // Check if it's an existing item or a default influencer
      if ('id' in influencer) {
        // Existing item - just update
        const { error } = await updateInfluencerShowcaseItem(influencer.id, { image_url: url });
        if (error) {
          toast.error("Failed to update influencer");
        } else {
          toast.success("Influencer updated!");
          loadItems();
        }
      } else {
        // Default influencer - check if exists or create
        const existingItem = items.find(i => i.name === influencer.name);
        
        if (existingItem) {
          const { error } = await updateInfluencerShowcaseItem(existingItem.id, { image_url: url });
          if (error) {
            toast.error("Failed to update influencer");
          } else {
            toast.success("Influencer updated!");
            loadItems();
          }
        } else {
          const { data, error } = await createInfluencerShowcaseItem({
            name: influencer.name,
            quote: influencer.quote,
            product_name: influencer.product_name,
            product_description: influencer.product_description,
            image_url: url,
            position: influencer.position,
            is_active: true,
          });
          if (error || !data) {
            toast.error("Failed to create influencer");
          } else {
            toast.success("Influencer created!");
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

  const handleFileSelect = (influencer: typeof defaultInfluencers[0], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageReplace(influencer, file);
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
            <h1 className="text-3xl font-bold">Influencer Showcase</h1>
            <p className="text-muted-foreground mt-1">
              Hover over images to replace them. Manage "Worn by Women. Who Inspire Us." section
            </p>
          </div>

          {/* Always show all default images, merge with database items */}
          <Card>
            <CardHeader>
              <CardTitle>Influencer Showcase Items</CardTitle>
              <p className="text-sm text-muted-foreground">Hover over any image to replace it</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {defaultInfluencers.map((influencer) => {
                  const existingItem = items.find(i => i.name === influencer.name);
                  const displayImage = existingItem?.image_url || influencer.image_url;
                  const key = existingItem ? `item-${existingItem.id}` : `default-${influencer.position}`;
                  const isUploading = uploading === key;
                  return (
                    <div key={influencer.position} className="relative group">
                      <input
                        ref={(el) => fileInputRefs.current[key] = el}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageReplace(existingItem || influencer, file);
                            e.target.value = "";
                          }
                        }}
                        className="hidden"
                      />
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-border">
                        <img 
                          src={displayImage} 
                          alt={influencer.name} 
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
                        <p className="text-xs text-muted-foreground text-center flex-1">{influencer.name}</p>
                        {existingItem && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                              <Link to={`/admin/influencers/${existingItem.id}/edit`}>
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

