import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getInfluencerShowcaseItemById,
  createInfluencerShowcaseItem,
  updateInfluencerShowcaseItem,
  uploadInfluencerImage,
} from "@/lib/admin-influencers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function InfluencerForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    quote: "",
    product_name: "",
    product_description: "",
    image_url: "",
    instagram_reel_url: "",
    product_price: null as number | null,
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
    const data = await getInfluencerShowcaseItemById(id);
    if (data) {
      setFormData({
        name: data.name,
        quote: data.quote,
        product_name: data.product_name,
        product_description: data.product_description || "",
        image_url: data.image_url,
        instagram_reel_url: data.instagram_reel_url || "",
        product_price: data.product_price,
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
      const { url, error } = await uploadInfluencerImage(file);
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
        const { error } = await updateInfluencerShowcaseItem(id, formData);
        if (error) throw error;
        toast.success("Influencer updated!");
      } else {
        const { data, error } = await createInfluencerShowcaseItem(formData);
        if (error) throw error;
        if (!data) throw new Error("Failed to create influencer");
        toast.success("Influencer created!");
      }
      navigate("/admin/influencers");
    } catch (error: any) {
      toast.error(error.message || "Failed to save influencer");
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
                <Link to="/admin/influencers">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">
                {isEdit ? "Edit Influencer" : "Create Influencer"}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Influencer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        placeholder="e.g., Aparna Thomas"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quote">Quote *</Label>
                      <Textarea
                        id="quote"
                        value={formData.quote}
                        onChange={(e) => handleInputChange("quote", e.target.value)}
                        required
                        rows={2}
                        placeholder="e.g., This design feels so elegant..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_name">Product Name *</Label>
                      <Input
                        id="product_name"
                        value={formData.product_name}
                        onChange={(e) => handleInputChange("product_name", e.target.value)}
                        required
                        placeholder="e.g., Aurora 18k Gold Layered Necklace"
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_description">Product Description</Label>
                      <Textarea
                        id="product_description"
                        value={formData.product_description}
                        onChange={(e) => handleInputChange("product_description", e.target.value)}
                        rows={2}
                        placeholder="e.g., Minimal, graceful & perfect..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_price">Product Price (₹)</Label>
                      <Input
                        id="product_price"
                        type="number"
                        step="0.01"
                        value={formData.product_price || ""}
                        onChange={(e) => handleInputChange("product_price", e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="e.g., 4999"
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram_reel_url">Instagram Reel URL</Label>
                      <Input
                        id="instagram_reel_url"
                        value={formData.instagram_reel_url}
                        onChange={(e) => handleInputChange("instagram_reel_url", e.target.value)}
                        placeholder="e.g., https://www.instagram.com/reel/..."
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
                        <p className="text-xs font-semibold mb-2">Current Default Images (Unsplash):</p>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <p>• Aparna Thomas: Unsplash jewelry image</p>
                          <p>• Thanu: Unsplash jewelry image</p>
                          <p>• Aziya: Unsplash jewelry image</p>
                          <p>• Chippy Devassy: Unsplash jewelry image</p>
                          <p>• Anjan Sagar: Unsplash jewelry image</p>
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
                <Link to="/admin/influencers">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving || !formData.image_url}>
                {saving ? "Saving..." : isEdit ? "Update Influencer" : "Create Influencer"}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

