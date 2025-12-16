import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getAllLuxuryMoodCategories,
  deleteLuxuryMoodCategory,
  updateLuxuryMoodCategory,
  createLuxuryMoodCategory,
  uploadLuxuryMoodImage,
  type LuxuryMoodCategory
} from "@/lib/admin-luxury-moods";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from "lucide-react";
import { toast } from "sonner";
import heroImage1 from "@/assets/hero-jewelry-1.jpg";
import heroImage2 from "@/assets/hero-jewelry-2.jpg";
import heroImage3 from "@/assets/hero-jewelry-3.jpg";

export default function LuxuryMoods() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<LuxuryMoodCategory[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const defaultCategories = [
    { name: "Office Wear", description: "Professional & Elegant", image_url: heroImage1, href: "/office-wear", position: 0 },
    { name: "Daily Wear", description: "Comfortable & Chic", image_url: heroImage2, href: "/daily-wear", position: 1 },
    { name: "Party Wear", description: "Bold & Glamorous", image_url: heroImage3, href: "/party-wear", position: 2 },
    { name: "Date Night", description: "Romantic & Sophisticated", image_url: heroImage1, href: "/date-night", position: 3 },
    { name: "Wedding Wear", description: "Timeless & Luxurious", image_url: heroImage2, href: "/wedding-wear", position: 4 },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await getAllLuxuryMoodCategories();
    setItems(data);
    setLoading(false);
  };

  const handleToggleActive = async (item: LuxuryMoodCategory) => {
    const { error } = await updateLuxuryMoodCategory(item.id, { is_active: !item.is_active });
    if (error) {
      toast.error("Failed to update category");
    } else {
      toast.success(`Category ${!item.is_active ? 'activated' : 'deactivated'}`);
      loadItems();
    }
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "${itemName}"?`)) return;
    const { error } = await deleteLuxuryMoodCategory(itemId);
    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
      loadItems();
    }
  };

  const handleImageReplace = async (category: LuxuryMoodCategory | typeof defaultCategories[0], file: File) => {
    const key = 'id' in category ? `item-${category.id}` : `default-${category.position}`;
    setUploading(key);

    try {
      const { url, error: uploadError } = await uploadLuxuryMoodImage(file);
      if (uploadError || !url) {
        const errorMessage = uploadError?.message || uploadError?.toString() || "Unknown error";
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload image: ${errorMessage}`);
        return;
      }

      // Check if it's an existing item or a default category
      if ('id' in category) {
        // Existing item - just update
        const { error } = await updateLuxuryMoodCategory(category.id, { image_url: url });
        if (error) {
          toast.error("Failed to update category");
        } else {
          toast.success("Category updated!");
          loadItems();
        }
      } else {
        // Default category - check if exists or create
        const existingItem = items.find(item => item.name === category.name);
        
        if (existingItem) {
          const { error } = await updateLuxuryMoodCategory(existingItem.id, { image_url: url });
          if (error) {
            toast.error("Failed to update category");
          } else {
            toast.success("Category updated!");
            loadItems();
          }
        } else {
          const { data, error } = await createLuxuryMoodCategory({
            name: category.name,
            description: category.description,
            image_url: url,
            href: category.href,
            position: category.position,
            is_active: true,
          });
          if (error || !data) {
            toast.error("Failed to create category");
          } else {
            toast.success("Category created!");
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

  const handleFileSelect = (category: LuxuryMoodCategory | typeof defaultCategories[0], e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageReplace(category, file);
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
            <h1 className="text-3xl font-bold">Luxury Moods</h1>
            <p className="text-muted-foreground mt-1">
              Hover over images to replace them. Manage "LUXURY MOODS" carousel categories
            </p>
          </div>

          {/* Always show all default images, merge with database items */}
          <Card>
            <CardHeader>
              <CardTitle>Luxury Mood Categories</CardTitle>
              <p className="text-sm text-muted-foreground">Hover over any image to replace it</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {defaultCategories.map((category) => {
                  const existingItem = items.find(item => item.name === category.name);
                  const displayImage = existingItem?.image_url || category.image_url;
                  const key = existingItem ? `item-${existingItem.id}` : `default-${category.position}`;
                  const isUploading = uploading === key;
                  return (
                    <div key={category.position} className="relative group">
                      <input
                        ref={(el) => fileInputRefs.current[key] = el}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(existingItem || category, e)}
                        className="hidden"
                      />
                      <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                        <img 
                          src={displayImage} 
                          alt={category.name} 
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
                        <div className="flex-1">
                          <p className="text-xs text-muted-foreground text-center">{category.name}</p>
                          {category.description && (
                            <p className="text-xs text-muted-foreground text-center">{category.description}</p>
                          )}
                        </div>
                        {existingItem && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                              <Link to={`/admin/luxury-moods/${existingItem.id}/edit`}>
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

