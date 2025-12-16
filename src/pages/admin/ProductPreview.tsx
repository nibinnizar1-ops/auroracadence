import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getProductByIdForAdmin,
  updateProduct,
  uploadProductImage,
  addProductImage,
  deleteProductImage,
  type Product,
  type ProductImage
} from "@/lib/admin-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowLeft,
  Upload,
  Trash2,
  Eye,
  Save,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function ProductPreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [status, setStatus] = useState<"active" | "draft" | "archived">("draft");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getProductByIdForAdmin(id);
    if (data) {
      setProduct(data.product);
      setImages(data.images);
      setStatus(data.product.status);
    }
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !id) return;

    const fileArray = Array.from(files).slice(0, 3); // Limit to 3 files at a time
    if (fileArray.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = fileArray.map(async (file) => {
        const { url, error: uploadError } = await uploadProductImage(file, id);
        if (uploadError || !url) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { data, error: addError } = await addProductImage(id, {
          url,
          alt_text: file.name,
        });

        if (addError || !data) {
          throw new Error(`Failed to add ${file.name}`);
        }

        return data;
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error: any) {
      toast.error(error.message || "Error uploading images");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const { error } = await deleteProductImage(imageId);
    if (error) {
      toast.error("Failed to delete image");
    } else {
      toast.success("Image deleted");
      setImages(images.filter(img => img.id !== imageId));
    }
  };

  const handleSaveStatus = async () => {
    if (!id || !product) return;
    setSaving(true);
    try {
      const { error } = await updateProduct(id, { status });
      if (error) throw error;
      toast.success("Product status updated!");
      navigate("/admin/products");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
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

  if (!product) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="text-center py-8">Product not found</div>
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
                <Link to={`/admin/products/${id}/edit`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Edit
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">Product Preview</h1>
              <p className="text-muted-foreground mt-1">{product.title}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Column - Preview */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Product Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Product Preview - Similar to ProductDetail page */}
                  <div className="space-y-6">
                    {/* Images */}
                    <div>
                      {images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                          {images.map((image, index) => (
                            <div key={image.id} className="relative group aspect-square">
                              <img
                                src={image.url}
                                alt={image.alt_text || product.title}
                                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setSelectedImageIndex(index)}
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="h-8 w-8 text-white drop-shadow-lg" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center border-2 border-dashed">
                          <p className="text-muted-foreground">No images uploaded</p>
                        </div>
                      )}
                    </div>

                    {/* Image Gallery Modal */}
                    <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
                      <DialogContent className="max-w-4xl w-full p-0">
                        <DialogHeader className="p-6 pb-0">
                          <DialogTitle className="flex items-center justify-between">
                            <span>Product Images ({selectedImageIndex !== null ? selectedImageIndex + 1 : 0} / {images.length})</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedImageIndex(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </DialogTitle>
                        </DialogHeader>
                        {selectedImageIndex !== null && (
                          <div className="relative">
                            <img
                              src={images[selectedImageIndex].url}
                              alt={images[selectedImageIndex].alt_text || product.title}
                              className="w-full h-[70vh] object-contain"
                            />
                            {images.length > 1 && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                                  onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1)}
                                >
                                  <ChevronLeft className="h-6 w-6" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                                  onClick={() => setSelectedImageIndex(selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0)}
                                >
                                  <ChevronRight className="h-6 w-6" />
                                </Button>
                              </>
                            )}
                            {/* Thumbnail strip */}
                            <div className="flex gap-2 p-4 overflow-x-auto bg-background border-t">
                              {images.map((image, index) => (
                                <button
                                  key={image.id}
                                  onClick={() => setSelectedImageIndex(index)}
                                  className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                                    index === selectedImageIndex ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'
                                  }`}
                                >
                                  <img
                                    src={image.url}
                                    alt={image.alt_text || product.title}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {/* Product Info */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{product.title}</h2>
                        {product.category && (
                          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                        )}
                      </div>
                      {product.description && (
                        <div>
                          <p className="text-foreground whitespace-pre-line">{product.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Upload Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="image-upload">Add Product Images (Up to 3 at a time)</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="mt-2"
                    />
                    {uploading && <p className="text-sm text-muted-foreground mt-2">Uploading...</p>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can select up to 3 images at a time. Minimum 3 images required. The first image will be used as the main product image.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current: {images.length}/3 images
                  </p>
                </CardContent>
              </Card>

              {/* Status & Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Product Status</Label>
                    <Select value={status} onValueChange={(value: "active" | "draft" | "archived") => setStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      {status === "draft" && "Product is hidden from customers"}
                      {status === "active" && "Product is visible to customers"}
                      {status === "archived" && "Product is archived"}
                    </p>
                  </div>
                  <Button 
                    onClick={handleSaveStatus} 
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? "Saving..." : <><Save className="mr-2 h-4 w-4" />Save Status</>}
                  </Button>
                  <Button 
                    variant="outline" 
                    asChild
                    className="w-full"
                  >
                    <Link to="/admin/products">Back to Products</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

