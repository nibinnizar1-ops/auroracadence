import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getBannerById,
  createBanner,
  updateBanner,
  uploadBannerImage,
  type Banner
} from "@/lib/admin-banners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  Upload,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function BannerForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    section: "hero" as "hero" | "collection" | "luxury",
    image_url: "",
    alt_text: "",
    link_url: "",
    position: 0,
    is_active: true,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadBanner();
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const loadBanner = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getBannerById(id);
    if (data) {
      setFormData({
        name: data.name,
        section: data.section,
        image_url: data.image_url,
        alt_text: data.alt_text || "",
        link_url: data.link_url || "",
        position: data.position,
        is_active: data.is_active,
      });
      setPreviewUrl(data.image_url);
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url, error } = await uploadBannerImage(file);
      if (error || !url) {
        toast.error("Failed to upload image");
        return;
      }

      handleInputChange("image_url", url);
      setPreviewUrl(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit && id) {
        const { error } = await updateBanner(id, formData);
        if (error) throw error;
        toast.success("Banner updated!");
      } else {
        const { data, error } = await createBanner(formData);
        if (error) throw error;
        if (!data) throw new Error("Failed to create banner");
        toast.success("Banner created!");
      }
      navigate("/admin/banners");
    } catch (error: any) {
      toast.error(error.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" asChild>
                <Link to="/admin/banners">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">
                {isEdit ? "Edit Banner" : "Create Banner"}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Form */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Banner Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="e.g., Summer Collection 2025"
                      />
                    </div>

                    <div>
                      <Label htmlFor="section">Section *</Label>
                      <Select
                        value={formData.section}
                        onValueChange={(value: "hero" | "collection" | "luxury") => handleInputChange("section", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hero">Hero Carousel</SelectItem>
                          <SelectItem value="collection">Collection Banner</SelectItem>
                          <SelectItem value="luxury">Luxury Banner</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formData.section === 'hero' && "Multiple hero banners create a carousel"}
                        {formData.section === 'collection' && "Single banner for collection section"}
                        {formData.section === 'luxury' && "Single banner for luxury section"}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="link_url">Link URL</Label>
                      <Input
                        id="link_url"
                        value={formData.link_url}
                        onChange={(e) => handleInputChange("link_url", e.target.value)}
                        placeholder="e.g., /collections or https://..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Where the banner should link to (optional)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="alt_text">Alt Text</Label>
                      <Textarea
                        id="alt_text"
                        value={formData.alt_text}
                        onChange={(e) => handleInputChange("alt_text", e.target.value)}
                        rows={2}
                        placeholder="Description for accessibility"
                      />
                    </div>

                    {formData.section === 'hero' && (
                      <div>
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          type="number"
                          value={formData.position}
                          onChange={(e) => handleInputChange("position", parseInt(e.target.value) || 0)}
                          min="0"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Lower numbers appear first in the carousel
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <Label htmlFor="is_active">Active</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Only active banners are shown on the website
                        </p>
                      </div>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Image */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Banner Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {previewUrl ? (
                      <>
                        <div className="border rounded-lg overflow-hidden">
                          <img
                            src={previewUrl}
                            alt={formData.alt_text || formData.name}
                            className="w-full h-auto"
                          />
                        </div>
                        <div>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                          <Label htmlFor="image-upload" className="cursor-pointer">
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                              disabled={uploading}
                              onClick={() => document.getElementById('image-upload')?.click()}
                            >
                              {uploading ? "Uploading..." : "Replace Image"}
                            </Button>
                          </Label>
                        </div>
                      </>
                    ) : (
                      <div>
                        <Label htmlFor="image-upload">Upload Image *</Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="mt-2"
                        />
                        {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                      </div>
                    )}
                    
                    {/* Current Default Images Info */}
                    {!isEdit && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-xs font-semibold mb-2">Current Default Images:</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {formData.section === 'hero' && (
                            <>
                              <p>• hero-jewelry-1.jpg</p>
                              <p>• hero-jewelry-2.jpg</p>
                              <p>• hero-jewelry-3.jpg</p>
                            </>
                          )}
                          {formData.section === 'collection' && (
                            <p>• banner-collection.jpg</p>
                          )}
                          {formData.section === 'luxury' && (
                            <p>• banner-luxury.jpg</p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          These are shown on the frontend if no banners are added in the database.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/banners">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving || !formData.image_url}>
                {saving ? "Saving..." : isEdit ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

