import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { getOrderByIdForAdmin, updateOrderStatus, type Order } from "@/lib/admin-orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  Package,
  User,
  MapPin,
  DollarSign,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [lineItems, setLineItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    if (id) {
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;
    setLoading(true);
    const data = await getOrderByIdForAdmin(id);
    if (data) {
      setOrder(data.order);
      setLineItems(data.line_items);
      setNewStatus(data.order.status);
      setAdminNotes(data.order.notes || "");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;
    
    setUpdating(true);
    const { data, error } = await updateOrderStatus(id, newStatus, adminNotes);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated successfully");
      loadOrder();
    }
    setUpdating(false);
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

  if (!order) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Order not found</p>
            <Button asChild className="mt-4">
              <Link to="/admin/orders">Back to Orders</Link>
            </Button>
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
                <Link to="/admin/orders">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">
                Order: {order.order_number}
              </h1>
            </div>
          </div>

          {/* Order Info Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{order.customer_email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <p className="font-medium">{order.customer_phone}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className="ml-2">{order.status}</Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Payment Status:</span>
                  <Badge className="ml-2">{order.payment_status}</Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Payment Method:</span>
                  <p className="font-medium">{order.payment_method}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Date:</span>
                  <p className="font-medium">
                    {format(new Date(order.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lineItems.length > 0 ? (
                  lineItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          {item.variant_title && (
                            <p className="text-sm text-muted-foreground">
                              {item.variant_title}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-1">
                            Quantity: {item.quantity} × ₹{parseFloat(item.price.toString()).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          ₹{(parseFloat(item.price.toString()) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">
                    {order.items && Array.isArray(order.items) ? (
                      order.items.map((item: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 mb-2">
                          <p className="font-medium">{item.title || item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ₹{item.price?.amount || item.price}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No items found</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">₹{parseFloat(order.subtotal.toString()).toFixed(2)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₹{parseFloat(order.discount_amount.toString()).toFixed(2)}</span>
                  </div>
                )}
                {order.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax:</span>
                    <span className="font-medium">₹{parseFloat(order.tax.toString()).toFixed(2)}</span>
                  </div>
                )}
                {order.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="font-medium">₹{parseFloat(order.shipping.toString()).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                  <span>Total:</span>
                  <span>₹{parseFloat(order.total.toString()).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {order.shipping_address && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {typeof order.shipping_address === 'string' ? (
                  <p>{order.shipping_address}</p>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium">{order.shipping_address.full_name || order.customer_name}</p>
                    <p>{order.shipping_address.address}</p>
                    <p>
                      {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                    </p>
                    {order.shipping_address.phone && (
                      <p className="text-muted-foreground">Phone: {order.shipping_address.phone}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Update Status</label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes..."
                  rows={4}
                />
              </div>
              <Button onClick={handleStatusUpdate} disabled={updating || !newStatus}>
                Update Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}



