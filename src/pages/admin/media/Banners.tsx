import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getAllBannersForAdmin,
  deleteBanner,
  updateBanner,
  createBanner,
  uploadBannerImage,
  type Banner
} from "@/lib/admin-banners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  X
} from "lucide-react";
import { toast } from "sonner";
import heroImage1 from "@/assets/hero-jewelry-1.jpg";
import heroImage2 from "@/assets/hero-jewelry-2.jpg";
import heroImage3 from "@/assets/hero-jewelry-3.jpg";
import bannerCollection from "@/assets/banner-collection.jpg";
import bannerLuxury from "@/assets/banner-luxury.jpg";

export default function Banners() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [sectionFilter, setSectionFilter] = useState<'all' | 'hero' | 'collection' | 'luxury'>('all');
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    loadBanners();
  }, [sectionFilter]);

  const loadBanners = async () => {
    setLoading(true);
    const filters: any = {};
    if (sectionFilter !== 'all') {
      filters.section = sectionFilter;
    }
    const data = await getAllBannersForAdmin(filters);
    setBanners(data);
    setLoading(false);
  };

  const handleToggleActive = async (banner: Banner) => {
    const { error } = await updateBanner(banner.id, { is_active: !banner.is_active });
    if (error) {
      toast.error("Failed to update banner");
    } else {
      toast.success(`Banner ${!banner.is_active ? 'activated' : 'deactivated'}`);
      loadBanners();
    }
  };

  const handleDelete = async (bannerId: string, bannerName: string) => {
    if (!confirm(`Are you sure you want to delete "${bannerName}"?`)) return;

    const { error } = await deleteBanner(bannerId);
    if (error) {
      toast.error("Failed to delete banner");
    } else {
      toast.success("Banner deleted");
      loadBanners();
    }
  };

  const handleImageReplace = async (section: string, position: number, file: File) => {
    const sectionKey = `${section}-${position}`;
    setUploading(sectionKey);

    try {
      // Upload image
      const { url, error: uploadError } = await uploadBannerImage(file);
      if (uploadError || !url) {
        const errorMessage = uploadError?.message || uploadError?.toString() || "Unknown error";
        console.error("Upload error:", uploadError);
        toast.error(`Failed to upload image: ${errorMessage}`);
        return;
      }

      // Check if banner exists for this section/position
      const existingBanner = banners.find(b => b.section === section && b.position === position);
      
      if (existingBanner) {
        // Update existing banner
        const { error } = await updateBanner(existingBanner.id, { image_url: url });
        if (error) {
          toast.error("Failed to update banner");
        } else {
          toast.success("Banner updated!");
          loadBanners();
        }
      } else {
        // Create new banner
        const { data, error } = await createBanner({
          name: `${section} Banner ${position + 1}`,
          section: section as "hero" | "collection" | "luxury",
          image_url: url,
          position,
          is_active: true,
        });
        if (error || !data) {
          toast.error("Failed to create banner");
        } else {
          toast.success("Banner created!");
          loadBanners();
        }
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setUploading(null);
    }
  };

  const handleFileSelect = (section: string, position: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageReplace(section, position, file);
    e.target.value = ""; // Reset input
  };

  const groupedBanners = banners.reduce((acc, banner) => {
    if (!acc[banner.section]) {
      acc[banner.section] = [];
    }
    acc[banner.section].push(banner);
    return acc;
  }, {} as Record<string, Banner[]>);

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
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Banner Management</h1>
            <p className="text-muted-foreground mt-1">
              Hover over images to replace them. Manage website banners for hero, collection, and luxury sections
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">Filter by Section:</label>
                <Select value={sectionFilter} onValueChange={(value: any) => setSectionFilter(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    <SelectItem value="hero">Hero Carousel</SelectItem>
                    <SelectItem value="collection">Collection Banner</SelectItem>
                    <SelectItem value="luxury">Luxury Banner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Banners - Always show default images, merge with database items */}
          <div className="space-y-6">
            {/* Hero Carousel */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Carousel Banners</CardTitle>
                <p className="text-sm text-muted-foreground">Hover over any image to replace it</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { image: heroImage1, section: "hero", position: 0, name: "Hero 1" },
                    { image: heroImage2, section: "hero", position: 1, name: "Hero 2" },
                    { image: heroImage3, section: "hero", position: 2, name: "Hero 3" },
                  ].map((item) => {
                    const key = `${item.section}-${item.position}`;
                    const existingBanner = banners.find(b => b.section === item.section && b.position === item.position);
                    const displayImage = existingBanner?.image_url || item.image;
                    const isUploading = uploading === key;
                    return (
                      <div key={key} className="relative group">
                        <input
                          ref={(el) => fileInputRefs.current[key] = el}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(item.section, item.position, e)}
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
                          {existingBanner && !existingBanner.is_active && (
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
                          <p className="text-xs text-muted-foreground">{item.name}</p>
                          {existingBanner && (
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" asChild className="h-6 w-6 p-0">
                                <Link to={`/admin/banners/${existingBanner.id}/edit`}>
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

            {/* Collection Banner */}
            <Card>
              <CardHeader>
                <CardTitle>Collection Banner</CardTitle>
                <p className="text-sm text-muted-foreground">Hover over image to replace it</p>
              </CardHeader>
              <CardContent>
                <div className="relative group max-w-2xl">
                  <input
                    ref={(el) => fileInputRefs.current['collection-0'] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect("collection", 0, e)}
                    className="hidden"
                  />
                  {(() => {
                    const existingBanner = banners.find(b => b.section === "collection" && b.position === 0);
                    const displayImage = existingBanner?.image_url || bannerCollection;
                    const isUploading = uploading === 'collection-0';
                    return (
                      <>
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                          <img 
                            src={displayImage} 
                            alt="Collection Banner" 
                            className="w-full h-full object-cover"
                          />
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                              <p className="text-white text-sm">Uploading...</p>
                            </div>
                          )}
                          {existingBanner && !existingBanner.is_active && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-5">
                              <span className="text-white font-semibold">Inactive</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => fileInputRefs.current['collection-0']?.click()}
                              disabled={isUploading}
                              className="bg-white text-black hover:bg-white/90"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Replace
                            </Button>
                          </div>
                        </div>
                        {existingBanner && (
                          <div className="mt-2 flex items-center justify-end">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/admin/banners/${existingBanner.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </Link>
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Luxury Banner */}
            <Card>
              <CardHeader>
                <CardTitle>Luxury Banner</CardTitle>
                <p className="text-sm text-muted-foreground">Hover over image to replace it</p>
              </CardHeader>
              <CardContent>
                <div className="relative group max-w-2xl">
                  <input
                    ref={(el) => fileInputRefs.current['luxury-0'] = el}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect("luxury", 0, e)}
                    className="hidden"
                  />
                  {(() => {
                    const existingBanner = banners.find(b => b.section === "luxury" && b.position === 0);
                    const displayImage = existingBanner?.image_url || bannerLuxury;
                    const isUploading = uploading === 'luxury-0';
                    return (
                      <>
                        <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-border">
                          <img 
                            src={displayImage} 
                            alt="Luxury Banner" 
                            className="w-full h-full object-cover"
                          />
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                              <p className="text-white text-sm">Uploading...</p>
                            </div>
                          )}
                          {existingBanner && !existingBanner.is_active && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-5">
                              <span className="text-white font-semibold">Inactive</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => fileInputRefs.current['luxury-0']?.click()}
                              disabled={isUploading}
                              className="bg-white text-black hover:bg-white/90"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Replace
                            </Button>
                          </div>
                        </div>
                        {existingBanner && (
                          <div className="mt-2 flex items-center justify-end">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/admin/banners/${existingBanner.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Details
                              </Link>
                            </Button>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

