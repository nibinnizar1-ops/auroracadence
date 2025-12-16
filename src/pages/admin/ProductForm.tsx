import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getProductByIdForAdmin,
  createProduct,
  updateProduct,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  uploadProductImage,
  addProductImage,
  deleteProductImage,
} from "@/lib/admin-products";
import type { Product, ProductVariant, ProductImage } from "@/lib/products";
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";
// import { getActiveProductTypes, getActiveCategories } from "@/lib/admin-settings"; // Deferred - will use static lists for now
import { supabase } from "@/integrations/supabase/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    handle: "",
    product_type: "",
    status: "draft" as "active" | "draft" | "archived",
    featured: false,
    category: "",
    tags: [] as string[],
    meta_title: "",
    meta_description: "",
    discount_type: null as "percentage" | "fixed" | null,
    discount_value: null as number | null,
    discount_valid_from: null as string | null,
    discount_valid_until: null as string | null,
    eligible_for_coupons: true,
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [productTypes, setProductTypes] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [coupons, setCoupons] = useState<{ id: string; code: string; name: string }[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddType, setShowAddType] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Multiple categories
  const [autoAddedCategories, setAutoAddedCategories] = useState<string[]>([]); // Track auto-added categories

  useEffect(() => {
    const initialize = async () => {
      try {
        setError(null);
        await loadDropdowns();
      } catch (error: any) {
        console.error('Error loading dropdowns:', error);
        setError(error?.message || 'Failed to load form data');
        // Continue even if dropdowns fail to load
      }
      
      try {
        if (isEdit && id) {
          await loadProduct();
        } else {
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error loading product:', error);
        setError(error?.message || 'Failed to load product');
        setLoading(false);
      }
    };
    
    initialize();
  }, [id, isEdit]);

  // Static product types - will be replaced with database later
  const staticProductTypes = [
    "Necklace", "Earrings", "Ring", "Bracelet", "Anklet", "Brooch", "Pendant", "Chain"
  ];

  // Static categories - will be replaced with database later
  const staticCategories = [
    "Office Wear", "Daily Wear", "Party Wear", "Date Night", "Wedding Wear",
    "New Arrivals", "Bestseller", "Necklaces", "Rings", "Earrings", "Bracelets"
  ];

  const loadDropdowns = async () => {
    try {
      // Use static lists for now - database management deferred
      setProductTypes(staticProductTypes.map(t => ({ id: t, name: t })));
      setCategories(staticCategories.map(c => ({ id: c, name: c })));
      
      // Load coupons from database (optional - don't block if it fails)
      try {
        // @ts-ignore - coupons table exists but not in generated types yet
        const { data: couponsData, error } = await (supabase as any)
          .from('coupons')
          .select('id, code, name')
          .eq('is_active', true)
          .order('code');
        if (couponsData && !error) {
          setCoupons(couponsData.map((c: any) => ({ id: c.id, code: c.code, name: c.name })));
        }
      } catch (err) {
        console.error('Error loading coupons (non-blocking):', err);
        // Continue even if coupons fail to load
      }
    } catch (error) {
      console.error('Error in loadDropdowns:', error);
      throw error;
    }
  };

  const loadProduct = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getProductByIdForAdmin(id);
    if (data) {
      setFormData({
        title: data.product.title,
        description: data.product.description || "",
        handle: data.product.handle,
        product_type: data.product.product_type || "",
        status: data.product.status,
        featured: data.product.featured,
        category: data.product.category || "",
        tags: data.product.tags || [],
        meta_title: data.product.meta_title || "",
        meta_description: data.product.meta_description || "",
        discount_type: data.product.discount_type || null,
        discount_value: data.product.discount_value || null,
        discount_valid_from: data.product.discount_valid_from || null,
        discount_valid_until: data.product.discount_valid_until || null,
        eligible_for_coupons: data.product.eligible_for_coupons !== undefined ? data.product.eligible_for_coupons : true,
      });
      setSelectedCouponId(data.product.default_coupon_id || null);
      setVariants(data.variants);
      setImages(data.images);
    }
    setLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    const prevData = formData;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate handle from title when title changes (if handle is empty or just created)
    if (field === 'title' && value) {
      // Only auto-generate if handle is empty or if we're creating a new product
      const shouldAutoGenerate = !prevData.handle || prevData.handle.trim() === '' || !id;
      if (shouldAutoGenerate) {
        const handle = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        // Use setTimeout to ensure state update happens after current update
        setTimeout(() => {
          setFormData(prev => {
            // Only update if handle is still empty
            if (!prev.handle || prev.handle.trim() === '') {
              return { ...prev, handle };
            }
            return prev;
          });
        }, 0);
      }
    }
    
    // Auto-map product type to filter category
    if (field === 'product_type' && value) {
      const typeToCategoryMap: Record<string, string> = {
        'Necklace': 'Necklaces',
        'Ring': 'Rings',
        'Earrings': 'Earrings',
        'Bracelet': 'Bracelets',
      };
      
      const mappedCategory = typeToCategoryMap[value];
      if (mappedCategory && !selectedCategories.includes(mappedCategory)) {
        setSelectedCategories(prev => [...prev, mappedCategory]);
        setAutoAddedCategories(prev => [...prev, mappedCategory]);
        toast.success(`Auto-added "${mappedCategory}" category`);
      }
    }
  };

  const handleGenerateHandle = () => {
    if (!formData.handle && formData.title) {
      const handle = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      handleInputChange("handle", handle);
    }
  };
  
  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        // Remove category
        setAutoAddedCategories(prevAuto => prevAuto.filter(c => c !== categoryName));
        return prev.filter(c => c !== categoryName);
      } else {
        // Add category
        return [...prev, categoryName];
      }
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleInputChange("tags", [...formData.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    handleInputChange("tags", formData.tags.filter(t => t !== tag));
  };

  const handleAddVariant = () => {
    const newVariant = {
      id: `temp-${Date.now()}`,
      product_id: id || "",
      title: "", // Will be used for Size
      sku: null,
      price: 0,
      compare_at_price: null,
      cost: null,
      currency_code: "INR",
      inventory_quantity: 0,
      inventory_policy: "deny" as "deny" | "continue",
      weight: null,
      position: variants.length,
      available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setVariants([...variants, newVariant]);
  };

  const handleAddNewType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Product type name is required");
      return;
    }
    // For now, just add to local state - database management deferred
    const newType = newTypeName.trim();
    if (!staticProductTypes.includes(newType) && !productTypes.find(t => t.name === newType)) {
      setProductTypes([...productTypes, { id: newType, name: newType }]);
      handleInputChange("product_type", newType);
      toast.success("Product type added! (Note: This is temporary until database management is enabled)");
    } else {
      toast.error("Product type already exists");
    }
    setNewTypeName("");
    setShowAddType(false);
  };

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
    // For now, just add to local state - database management deferred
    const newCategory = newCategoryName.trim();
    if (!staticCategories.includes(newCategory) && !categories.find(c => c.name === newCategory)) {
      setCategories([...categories, { id: newCategory, name: newCategory }]);
      handleInputChange("category", newCategory);
      toast.success("Category added! (Note: This is temporary until database management is enabled)");
    } else {
      toast.error("Category already exists");
    }
    setNewCategoryName("");
    setShowAddCategory(false);
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleDeleteVariant = async (variantId: string, index: number) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    if (variantId.startsWith("temp-")) {
      // Not saved yet, just remove from state
      setVariants(variants.filter((_, i) => i !== index));
    } else {
      // Delete from database
      const { error } = await deleteProductVariant(variantId);
      if (error) {
        toast.error("Failed to delete variant");
      } else {
        toast.success("Variant deleted");
        setVariants(variants.filter((_, i) => i !== index));
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For new products, images can only be uploaded after product is created
    if (!id) {
      toast.error("Please save the product first, then upload images");
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const { url, error: uploadError } = await uploadProductImage(file, id);
      if (uploadError || !url) {
        toast.error("Failed to upload image");
        return;
      }

      const { data, error: addError } = await addProductImage(id, {
        url,
        alt_text: file.name,
      });

      if (addError || !data) {
        toast.error("Failed to add image");
      } else {
        toast.success("Image uploaded");
        setImages([...images, data]);
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let productId = id;

      // Validate minimum 3 images only when editing existing product
      // New products can be saved without images, then images are uploaded in preview page
      if (isEdit && images.length < 3) {
        toast.error(`Please upload at least 3 images. Currently: ${images.length}/3`);
        setSaving(false);
        return;
      }

      // Create or update product
      const submitData: any = { 
        ...formData,
        categories: selectedCategories, // Include multiple categories
      };
      
      // Include default_coupon_id if a coupon is selected
      // Note: This requires the migration 20250113000013_add_product_coupon_id.sql to be applied
      if (selectedCouponId !== null && selectedCouponId !== undefined) {
        submitData.default_coupon_id = selectedCouponId;
      } else {
        submitData.default_coupon_id = null;
      }
      // For testing: allow setting status directly (default to "active" for new products)
      if (!isEdit && !submitData.status) {
        submitData.status = "active"; // Changed from "draft" to "active" for testing
      }

      if (isEdit && id) {
        const { data, error } = await updateProduct(id, submitData);
        if (error) throw error;
        productId = data?.id || id;
      } else {
        const { data, error } = await createProduct(submitData);
        if (error) throw error;
        if (!data) throw new Error("Failed to create product");
        productId = data.id;
      }

      // Save variants (simplified - only essential fields)
      for (const variant of variants) {
        if (variant.id.startsWith("temp-")) {
          // New variant
          await createProductVariant(productId, {
            title: variant.title || "Default", // Used as Size
            price: variant.price,
            compare_at_price: variant.compare_at_price || undefined,
            currency_code: "INR", // Default
            inventory_quantity: variant.inventory_quantity,
            inventory_policy: variant.inventory_policy,
            position: variant.position,
            available: true, // Default
          });
        } else {
          // Update existing variant
          await updateProductVariant(variant.id, {
            title: variant.title || "Default", // Used as Size
            price: variant.price,
            compare_at_price: variant.compare_at_price || undefined,
            inventory_quantity: variant.inventory_quantity,
            inventory_policy: variant.inventory_policy,
            position: variant.position,
          });
        }
      }

      toast.success(isEdit ? "Product updated!" : "Product created! Now add images and set status.");
      // Navigate to preview page for image upload and status setting
      navigate(`/admin/products/${productId}/preview`);
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="text-center py-8">
            <p>Loading product form...</p>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (error) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">Error: {error}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
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
                <Link to="/admin/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">
                {isEdit ? "Edit Product" : "Create Product"}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Basic Info */}
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                        placeholder="e.g., Gold Necklace"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Label htmlFor="handle">Handle (URL Slug) *</Label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p className="text-sm">
                                The handle is a URL-friendly version of your product name. 
                                It appears in the product URL. For example, "Gold Necklace" becomes "gold-necklace" 
                                and the product URL will be: /product/gold-necklace
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="handle"
                          value={formData.handle}
                          onChange={(e) => handleInputChange("handle", e.target.value)}
                          required
                          placeholder="e.g., gold-necklace"
                        />
                        {!isEdit && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGenerateHandle}
                          >
                            Generate
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        URL-friendly version of the title (lowercase, hyphens instead of spaces)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={4}
                        placeholder="Product description..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="product_type">Product Type</Label>
                      <div className="space-y-2">
                        <Select
                          value={formData.product_type || "none"}
                          onValueChange={(value) => {
                            if (value === "add-new") {
                              setShowAddType(true);
                            } else if (value === "none") {
                              handleInputChange("product_type", "");
                            } else {
                              handleInputChange("product_type", value);
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {productTypes.map((type) => (
                            <SelectItem key={type.id} value={type.name}>
                              {type.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="add-new" className="text-primary font-medium">
                            + Add New Type (Temporary)
                          </SelectItem>
                        </SelectContent>
                        </Select>
                        {showAddType && (
                          <div className="flex gap-2">
                            <Input
                              value={newTypeName}
                              onChange={(e) => setNewTypeName(e.target.value)}
                              placeholder="Enter new product type"
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddNewType();
                                }
                              }}
                            />
                            <Button type="button" size="sm" onClick={handleAddNewType}>
                              Add
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setShowAddType(false);
                                setNewTypeName("");
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Categories (Multiple Selection)</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Select multiple categories. Product type will auto-add corresponding filter category.
                      </p>
                      <div className="space-y-2 border rounded-md p-4 max-h-64 overflow-y-auto">
                        {staticCategories.map((categoryName) => {
                          const isSelected = selectedCategories.includes(categoryName);
                          const isAutoAdded = autoAddedCategories.includes(categoryName);
                          return (
                            <div key={categoryName} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${categoryName}`}
                                checked={isSelected}
                                onCheckedChange={() => handleCategoryToggle(categoryName)}
                              />
                              <label
                                htmlFor={`category-${categoryName}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
                              >
                                {categoryName}
                                {isAutoAdded && (
                                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                                    Auto-added
                                  </span>
                                )}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                      {selectedCategories.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Selected: {selectedCategories.join(", ")}
                          </p>
                        </div>
                      )}
                      {showAddCategory && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Enter new category"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddNewCategory();
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={handleAddNewCategory}>
                            Add
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setShowAddCategory(false);
                              setNewCategoryName("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Status & Settings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Status & Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange("status", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Featured Product</Label>
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => handleInputChange("featured", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add tag..."
                      />
                      <Button type="button" onClick={handleAddTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* SEO */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title}
                        onChange={(e) => handleInputChange("meta_title", e.target.value)}
                        placeholder="SEO title..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description}
                        onChange={(e) => handleInputChange("meta_description", e.target.value)}
                        rows={3}
                        placeholder="SEO description..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Product Discount */}
                <Card>
                  <CardHeader>
                    <CardTitle>Product Discount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="discount_type">Discount Type</Label>
                      <Select
                        value={formData.discount_type || ""}
                        onValueChange={(value) => handleInputChange("discount_type", value === "none" ? null : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="No discount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Discount</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.discount_type && (
                      <>
                        <div>
                          <Label htmlFor="discount_value">
                            Discount Value {formData.discount_type === "percentage" ? "(%)" : "(₹)"}
                          </Label>
                          <Input
                            id="discount_value"
                            type="number"
                            step={formData.discount_type === "percentage" ? "0.01" : "1"}
                            min="0"
                            max={formData.discount_type === "percentage" ? "100" : undefined}
                            value={formData.discount_value === null || formData.discount_value === 0 ? "" : formData.discount_value}
                            onChange={(e) => {
                              const val = e.target.value;
                              handleInputChange("discount_value", val === "" ? null : parseFloat(val) || null);
                            }}
                            placeholder={formData.discount_type === "percentage" ? "e.g., 20" : "e.g., 500"}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="discount_valid_from">Valid From</Label>
                            <Input
                              id="discount_valid_from"
                              type="datetime-local"
                              value={formData.discount_valid_from ? new Date(formData.discount_valid_from).toISOString().slice(0, 16) : ""}
                              onChange={(e) => handleInputChange("discount_valid_from", e.target.value ? new Date(e.target.value).toISOString() : null)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="discount_valid_until">Valid Until</Label>
                            <Input
                              id="discount_valid_until"
                              type="datetime-local"
                              value={formData.discount_valid_until ? new Date(formData.discount_valid_until).toISOString().slice(0, 16) : ""}
                              onChange={(e) => handleInputChange("discount_valid_until", e.target.value ? new Date(e.target.value).toISOString() : null)}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <div className="space-y-4 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="eligible_for_coupons">Eligible for Coupons</Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Allow this product to use site-wide coupons
                          </p>
                        </div>
                        <Switch
                          id="eligible_for_coupons"
                          checked={formData.eligible_for_coupons}
                          onCheckedChange={(checked) => handleInputChange("eligible_for_coupons", checked)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="product_coupon">Assign Coupon (Optional)</Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Select a coupon to automatically apply to this product
                        </p>
                        <Select
                          value={selectedCouponId || "no-coupon"}
                          onValueChange={(value) => setSelectedCouponId(value === "no-coupon" ? null : value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="No coupon assigned" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-coupon">No Coupon</SelectItem>
                            {coupons.map((coupon) => (
                              <SelectItem key={coupon.id} value={coupon.id}>
                                {coupon.code} - {coupon.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Variants & Images */}
              <div className="space-y-6">
                {/* Product Variants */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Product Variants</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {variants.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No variants. Click "Add Variant" to create one.
                      </p>
                    ) : (
                      variants.map((variant, index) => (
                        <div key={variant.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Variant {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteVariant(variant.id, index)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Size *</Label>
                              <Input
                                value={variant.title}
                                onChange={(e) => handleVariantChange(index, "title", e.target.value)}
                                placeholder="e.g., Small, Medium, Large"
                                required
                              />
                            </div>
                            <div>
                              <Label>Price (₹) *</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={variant.price === 0 ? "" : variant.price}
                                onChange={(e) => handleVariantChange(index, "price", parseFloat(e.target.value) || 0)}
                                onFocus={(e) => {
                                  if (e.target.value === "0") {
                                    e.target.value = "";
                                  }
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "" || e.target.value === "0") {
                                    handleVariantChange(index, "price", 0);
                                  }
                                }}
                                required
                              />
                            </div>
                            <div>
                              <Label>Compare at Price (₹)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={variant.compare_at_price === 0 || variant.compare_at_price === null ? "" : variant.compare_at_price}
                                onChange={(e) => handleVariantChange(index, "compare_at_price", e.target.value ? parseFloat(e.target.value) : null)}
                                onFocus={(e) => {
                                  if (e.target.value === "0") {
                                    e.target.value = "";
                                  }
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "" || e.target.value === "0") {
                                    handleVariantChange(index, "compare_at_price", null);
                                  }
                                }}
                                placeholder="Original price (optional)"
                              />
                            </div>
                            <div>
                              <Label>Inventory Quantity *</Label>
                              <Input
                                type="number"
                                value={variant.inventory_quantity === 0 ? "" : variant.inventory_quantity}
                                onChange={(e) => handleVariantChange(index, "inventory_quantity", parseInt(e.target.value) || 0)}
                                onFocus={(e) => {
                                  if (e.target.value === "0") {
                                    e.target.value = "";
                                  }
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "" || e.target.value === "0") {
                                    handleVariantChange(index, "inventory_quantity", 0);
                                  }
                                }}
                                required
                              />
                            </div>
                            <div>
                              <Label>Inventory Policy *</Label>
                              <Select
                                value={variant.inventory_policy}
                                onValueChange={(value) => handleVariantChange(index, "inventory_policy", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="deny">Deny (Stop selling when out)</SelectItem>
                                  <SelectItem value="continue">Continue (Allow backorders)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          {/* Price Preview */}
                          {variant.compare_at_price && variant.compare_at_price > variant.price && (
                            <div className="mt-3 p-3 bg-secondary/50 rounded-lg border">
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground mb-1">Main Price</p>
                                  <p className="text-lg line-through text-muted-foreground">
                                    ₹{variant.compare_at_price.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground mb-1">Selling Price</p>
                                  <p className="text-2xl font-bold text-foreground">
                                    ₹{variant.price.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="flex-shrink-0">
                                  <p className="text-xs text-muted-foreground mb-1">Discount</p>
                                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-destructive/10 text-destructive font-semibold text-sm">
                                    {Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100)}% OFF
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Product Images Info */}
                {isEdit ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">
                            Images: <span className={images.length < 3 ? "text-destructive" : "text-green-600"}>
                              {images.length}/3
                            </span>
                          </p>
                          {images.length < 3 && (
                            <span className="text-xs text-destructive">
                              Minimum 3 images required
                            </span>
                          )}
                        </div>
                        {images.length > 0 ? (
                          <>
                            <p className="text-sm text-muted-foreground mb-4">
                              {images.length} image(s) uploaded. Go to preview page to manage images.
                            </p>
                            <Button variant="outline" asChild>
                              <Link to={`/admin/products/${id}/preview`}>
                                Manage Images
                              </Link>
                            </Button>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No images uploaded yet. Go to preview page to upload images.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Product Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        After creating the product, you'll be redirected to the preview page where you can upload images (minimum 3 required).
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 mt-6">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/products">Cancel</Link>
              </Button>
              <Button 
                type="submit" 
                disabled={saving || (isEdit && images.length < 3)}
                title={isEdit && images.length < 3 ? "Please upload at least 3 images" : ""}
              >
                {saving ? "Saving..." : isEdit ? "Save & Continue" : "Create & Add Images"}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

