import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft,
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function CouponForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed_amount",
    discount_value: 0,
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: "",
    max_uses: null as number | null,
    max_uses_per_user: 1,
    minimum_order_amount: null as number | null,
    is_active: true,
    is_paused: false,
    applicable_to: "all" as "all" | "categories" | "products" | "collections",
    applicable_ids: null as string[] | null,
  });

  useEffect(() => {
    if (isEdit && id) {
      loadCoupon();
    } else {
      setLoading(false);
    }
  }, [id, isEdit]);

  const loadCoupon = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          code: data.code,
          name: data.name || "",
          description: data.description || "",
          discount_type: data.discount_type,
          discount_value: parseFloat(data.discount_value.toString()),
          valid_from: data.valid_from ? new Date(data.valid_from).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          valid_until: data.valid_until ? new Date(data.valid_until).toISOString().split('T')[0] : "",
          max_uses: data.max_uses,
          max_uses_per_user: data.max_uses_per_user || 1,
          minimum_order_amount: data.minimum_order_amount ? parseFloat(data.minimum_order_amount.toString()) : null,
          is_active: data.is_active,
          is_paused: data.is_paused,
          applicable_to: data.applicable_to || "all",
          applicable_ids: data.applicable_ids as string[] | null,
        });
      }
    } catch (error: any) {
      toast.error("Failed to load coupon");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const couponData = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        discount_value: formData.discount_value,
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_until: new Date(formData.valid_until).toISOString(),
        max_uses: formData.max_uses || null,
        minimum_order_amount: formData.minimum_order_amount || null,
        applicable_ids: formData.applicable_ids || null,
      };

      if (isEdit && id) {
        const { error } = await supabase
          .from('coupons')
          .update(couponData)
          .eq('id', id);

        if (error) throw error;
        toast.success("Coupon updated!");
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert(couponData);

        if (error) throw error;
        toast.success("Coupon created!");
      }

      navigate("/admin/coupons");
    } catch (error: any) {
      toast.error(error.message || "Failed to save coupon");
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
        <div className="space-y-6 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" asChild>
                <Link to="/admin/coupons">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">
                {isEdit ? "Edit Coupon" : "Create Coupon"}
              </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                    required
                    placeholder="e.g., SAVE20"
                    className="uppercase"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Code will be automatically converted to uppercase
                  </p>
                </div>

                <div>
                  <Label htmlFor="name">Coupon Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Summer Sale 20% Off"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                    placeholder="Coupon description..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Discount Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Discount Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="discount_type">Discount Type *</Label>
                  <select
                    id="discount_type"
                    value={formData.discount_type}
                    onChange={(e) => handleInputChange("discount_type", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="discount_value">
                    Discount Value * 
                    {formData.discount_type === "percentage" ? " (%)" : " (₹)"}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step="0.01"
                    min="0"
                    max={formData.discount_type === "percentage" ? 100 : undefined}
                    value={formData.discount_value === 0 ? "" : formData.discount_value}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInputChange("discount_value", val === "" ? 0 : parseFloat(val) || 0);
                    }}
                    required
                    placeholder={formData.discount_type === "percentage" ? "e.g., 20" : "e.g., 500"}
                  />
                  {formData.discount_type === "percentage" && formData.discount_value > 100 && (
                    <p className="text-xs text-destructive mt-1">Percentage cannot exceed 100%</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="minimum_order_amount">Minimum Order Amount (₹)</Label>
                  <Input
                    id="minimum_order_amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimum_order_amount || ""}
                    onChange={(e) => handleInputChange("minimum_order_amount", e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="e.g., 1000 (leave empty for no minimum)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty if no minimum order required
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Validity */}
            <Card>
              <CardHeader>
                <CardTitle>Validity Period</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="valid_from">Valid From *</Label>
                  <Input
                    id="valid_from"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => handleInputChange("valid_from", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="valid_until">Valid Until *</Label>
                  <Input
                    id="valid_until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => handleInputChange("valid_until", e.target.value)}
                    required
                    min={formData.valid_from}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Usage Limits */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="max_uses">Maximum Total Uses</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={formData.max_uses || ""}
                    onChange={(e) => handleInputChange("max_uses", e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="e.g., 100 (leave empty for unlimited)"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty for unlimited uses
                  </p>
                </div>

                <div>
                  <Label htmlFor="max_uses_per_user">Maximum Uses Per User *</Label>
                  <Input
                    id="max_uses_per_user"
                    type="number"
                    min="1"
                    value={formData.max_uses_per_user}
                    onChange={(e) => handleInputChange("max_uses_per_user", parseInt(e.target.value) || 1)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_active">Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Coupon is active and can be used
                    </p>
                  </div>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_paused">Paused</Label>
                    <p className="text-xs text-muted-foreground">
                      Temporarily disable coupon without deleting
                    </p>
                  </div>
                  <Switch
                    id="is_paused"
                    checked={formData.is_paused}
                    onCheckedChange={(checked) => handleInputChange("is_paused", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Applicability */}
            <Card>
              <CardHeader>
                <CardTitle>Applicability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="applicable_to">Applicable To</Label>
                  <select
                    id="applicable_to"
                    value={formData.applicable_to}
                    onChange={(e) => handleInputChange("applicable_to", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="all">All Products</option>
                    <option value="categories">Specific Categories</option>
                    <option value="products">Specific Products</option>
                    <option value="collections">Specific Collections</option>
                  </select>
                </div>

                {formData.applicable_to !== "all" && (
                  <div>
                    <Label>
                      {formData.applicable_to === "categories" && "Category IDs"}
                      {formData.applicable_to === "products" && "Product IDs"}
                      {formData.applicable_to === "collections" && "Collection IDs"}
                    </Label>
                    <Input
                      placeholder="Comma-separated IDs (e.g., id1, id2, id3)"
                      value={formData.applicable_ids?.join(", ") || ""}
                      onChange={(e) => {
                        const ids = e.target.value
                          .split(",")
                          .map(id => id.trim())
                          .filter(id => id.length > 0);
                        handleInputChange("applicable_ids", ids.length > 0 ? ids : null);
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter comma-separated IDs (feature to be enhanced later)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" asChild>
                <Link to="/admin/coupons">Cancel</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}



