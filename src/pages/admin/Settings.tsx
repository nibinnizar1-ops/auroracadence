import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import {
  getAllProductTypes,
  createProductType,
  updateProductType,
  deleteProductType,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type ProductType,
  type Category
} from "@/lib/admin-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Settings() {
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDescription, setNewTypeDescription] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [typeDialogOpen, setTypeDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [types, cats] = await Promise.all([
      getAllProductTypes(),
      getAllCategories()
    ]);
    setProductTypes(types);
    setCategories(cats);
    setLoading(false);
  };

  const handleCreateType = async () => {
    if (!newTypeName.trim()) {
      toast.error("Product type name is required");
      return;
    }

    const { data, error } = await createProductType({
      name: newTypeName.trim(),
      description: newTypeDescription.trim() || undefined,
    });

    if (error) {
      toast.error("Failed to create product type");
    } else {
      toast.success("Product type created!");
      setNewTypeName("");
      setNewTypeDescription("");
      setTypeDialogOpen(false);
      loadData();
    }
  };

  const handleUpdateType = async (type: ProductType) => {
    const { error } = await updateProductType(type.id, {
      name: type.name,
      description: type.description,
      is_active: type.is_active,
    });

    if (error) {
      toast.error("Failed to update product type");
    } else {
      toast.success("Product type updated!");
      setEditingType(null);
      loadData();
    }
  };

  const handleDeleteType = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await deleteProductType(id);
    if (error) {
      toast.error("Failed to delete product type");
    } else {
      toast.success("Product type deleted");
      loadData();
    }
  };

  const handleToggleTypeActive = async (type: ProductType) => {
    const { error } = await updateProductType(type.id, { is_active: !type.is_active });
    if (error) {
      toast.error("Failed to update product type");
    } else {
      toast.success(`Product type ${!type.is_active ? 'activated' : 'deactivated'}`);
      loadData();
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const { data, error } = await createCategory({
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || undefined,
    });

    if (error) {
      toast.error("Failed to create category");
    } else {
      toast.success("Category created!");
      setNewCategoryName("");
      setNewCategoryDescription("");
      setCategoryDialogOpen(false);
      loadData();
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    const { error } = await updateCategory(category.id, {
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    });

    if (error) {
      toast.error("Failed to update category");
    } else {
      toast.success("Category updated!");
      setEditingCategory(null);
      loadData();
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const { error } = await deleteCategory(id);
    if (error) {
      toast.error("Failed to delete category");
    } else {
      toast.success("Category deleted");
      loadData();
    }
  };

  const handleToggleCategoryActive = async (category: Category) => {
    const { error } = await updateCategory(category.id, { is_active: !category.is_active });
    if (error) {
      toast.error("Failed to update category");
    } else {
      toast.success(`Category ${!category.is_active ? 'activated' : 'deactivated'}`);
      loadData();
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
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage product types and categories</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Product Types */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Types</CardTitle>
                <Dialog open={typeDialogOpen} onOpenChange={setTypeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Type
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Product Type</DialogTitle>
                      <DialogDescription>
                        Create a new product type that can be used when adding products
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="type-name">Name *</Label>
                        <Input
                          id="type-name"
                          value={newTypeName}
                          onChange={(e) => setNewTypeName(e.target.value)}
                          placeholder="e.g., Necklace, Earrings"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type-description">Description</Label>
                        <Textarea
                          id="type-description"
                          value={newTypeDescription}
                          onChange={(e) => setNewTypeDescription(e.target.value)}
                          placeholder="Optional description"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTypeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateType}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productTypes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No product types found
                        </TableCell>
                      </TableRow>
                    ) : (
                      productTypes.map((type) => (
                        <TableRow key={type.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{type.name}</p>
                              {type.description && (
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={type.is_active}
                                onCheckedChange={() => handleToggleTypeActive(type)}
                              />
                              {type.is_active ? (
                                <span className="flex items-center gap-1 text-green-600 text-xs">
                                  <Eye className="h-3 w-3" /> Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                  <EyeOff className="h-3 w-3" /> Inactive
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingType(type)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteType(type.id, type.name)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Categories</CardTitle>
                <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                      <DialogDescription>
                        Create a new category that can be used when adding products
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="category-name">Name *</Label>
                        <Input
                          id="category-name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="e.g., Office Wear, Daily Wear"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-description">Description</Label>
                        <Textarea
                          id="category-description"
                          value={newCategoryDescription}
                          onChange={(e) => setNewCategoryDescription(e.target.value)}
                          placeholder="Optional description"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateCategory}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No categories found
                        </TableCell>
                      </TableRow>
                    ) : (
                      categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{category.name}</p>
                              {category.description && (
                                <p className="text-xs text-muted-foreground">{category.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={category.is_active}
                                onCheckedChange={() => handleToggleCategoryActive(category)}
                              />
                              {category.is_active ? (
                                <span className="flex items-center gap-1 text-green-600 text-xs">
                                  <Eye className="h-3 w-3" /> Active
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                                  <EyeOff className="h-3 w-3" /> Inactive
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCategory(category.id, category.name)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Edit Dialogs */}
          {editingType && (
            <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Product Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-type-name">Name *</Label>
                    <Input
                      id="edit-type-name"
                      value={editingType.name}
                      onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-type-description">Description</Label>
                    <Textarea
                      id="edit-type-description"
                      value={editingType.description || ""}
                      onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-type-active">Active</Label>
                    <Switch
                      id="edit-type-active"
                      checked={editingType.is_active}
                      onCheckedChange={(checked) => setEditingType({ ...editingType, is_active: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingType(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdateType(editingType)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {editingCategory && (
            <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="edit-category-name">Name *</Label>
                    <Input
                      id="edit-category-name"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-category-description">Description</Label>
                    <Textarea
                      id="edit-category-description"
                      value={editingCategory.description || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-category-active">Active</Label>
                    <Switch
                      id="edit-category-active"
                      checked={editingCategory.is_active}
                      onCheckedChange={(checked) => setEditingCategory({ ...editingCategory, is_active: checked })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleUpdateCategory(editingCategory)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

