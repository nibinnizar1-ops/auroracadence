import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getStoreLocationById,
  createStoreLocation,
  updateStoreLocation,
  uploadStoreImage,
} from "@/lib/admin-stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function StoreForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    image_url: "",
    position: 0,
    is_active: true,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      loadItem();
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const loadItem = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getStoreLocationById(id);
    if (data) {
      setFormData({
        name: data.name,
        location: data.location,
        description: data.description || "",
        image_url: data.image_url,
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
      const { url, error } = await uploadStoreImage(file);
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
        const { error } = await updateStoreLocation(id, formData);
        if (error) throw error;
        toast.success("Store updated!");
      } else {
        const { data, error } = await createStoreLocation(formData);
        if (error) throw error;
        if (!data) throw new Error("Failed to create store");
        toast.success("Store created!");
      }
      navigate("/admin/stores");
    } catch (error: any) {
      toast.error(error.message || "Failed to save store");
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
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" asChild>
                <Link to="/admin/stores">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">
                {isEdit ? "Edit Store Location" : "Create Store Location"}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Store Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Store Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="e.g., He & She"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                        placeholder="e.g., Madannada, Kollam"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        placeholder="e.g., A warm, curated space..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        type="number"
                        value={formData.position}
                        onChange={(e) => handleInputChange("position", parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Label htmlFor="is_active">Active</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Image</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {previewUrl ? (
                      <>
                        <div className="border rounded-lg overflow-hidden h-64">
                          <img
                            src={previewUrl}
                            alt={formData.name}
                            className="w-full h-full object-cover"
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
                          <p>• He & She: banner-collection.jpg</p>
                          <p>• Salon de R: banner-luxury.jpg</p>
                          <p>• Rock Paper: hero-jewelry-1.jpg</p>
                          <p>• Go Girl: hero-jewelry-2.jpg</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          These are shown on the frontend if no items are added in the database.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/stores">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving || !formData.image_url}>
                {saving ? "Saving..." : isEdit ? "Update Store" : "Create Store"}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

