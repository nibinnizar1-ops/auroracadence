import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getReturnRequestById, 
  updateReturnRequestStatus,
  updateReturnItemQC,
  type ReturnRequest,
  type ReturnItem,
  type ReturnStatus
} from "@/lib/returns";
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
  CheckCircle2,
  XCircle,
  Package,
  User,
  Calendar,
  DollarSign,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const statusOptions: { value: ReturnStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "pickup_scheduled", label: "Pickup Scheduled" },
  { value: "in_transit", label: "In Transit" },
  { value: "received", label: "Received" },
  { value: "qc_pending", label: "QC Pending" },
  { value: "qc_passed", label: "QC Passed" },
  { value: "qc_failed", label: "QC Failed" },
  { value: "refund_processing", label: "Refund Processing" },
  { value: "refunded", label: "Refunded" },
  { value: "exchanged", label: "Exchanged" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ReturnDetail() {
  const { id } = useParams<{ id: string }>();
  const [returnRequest, setReturnRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState<ReturnStatus | "">("");

  useEffect(() => {
    if (id) {
      loadReturnRequest();
    }
  }, [id]);

  const loadReturnRequest = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await getReturnRequestById(id);
    if (error) {
      toast.error("Failed to load return request");
      console.error(error);
    } else {
      setReturnRequest(data);
      setAdminNotes(data?.admin_notes || "");
      setNewStatus(data?.status || "");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    if (!id || !newStatus) return;
    
    setUpdating(true);
    const { data, error } = await updateReturnRequestStatus(id, {
      status: newStatus as ReturnStatus,
      admin_notes: adminNotes,
    });

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated successfully");
      loadReturnRequest();
    }
    setUpdating(false);
  };

  const handleApprove = async () => {
    if (!id) return;
    setUpdating(true);
    const { error } = await updateReturnRequestStatus(id, {
      status: "approved",
    });
    if (error) {
      toast.error("Failed to approve");
    } else {
      toast.success("Return request approved");
      loadReturnRequest();
    }
    setUpdating(false);
  };

  const handleReject = async () => {
    if (!id) return;
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    
    setUpdating(true);
    const { error } = await updateReturnRequestStatus(id, {
      status: "rejected",
      rejected_reason: reason,
    });
    if (error) {
      toast.error("Failed to reject");
    } else {
      toast.success("Return request rejected");
      loadReturnRequest();
    }
    setUpdating(false);
  };

  const handleQCUpdate = async (itemId: string, qcStatus: "passed" | "failed", notes?: string) => {
    setUpdating(true);
    const { error } = await updateReturnItemQC(itemId, {
      qc_status: qcStatus,
      qc_notes: notes,
    });
    if (error) {
      toast.error("Failed to update QC status");
    } else {
      toast.success("QC status updated");
      loadReturnRequest();
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

  if (!returnRequest) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Return request not found</p>
            <Button asChild className="mt-4">
              <Link to="/admin/returns">Back to Returns</Link>
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
                <Link to="/admin/returns">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-3xl font-bold mt-4">
                Return Request: {returnRequest.return_number}
              </h1>
            </div>
            <div className="flex gap-2">
              {returnRequest.status === "pending" && (
                <>
                  <Button onClick={handleApprove} disabled={updating}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={handleReject} disabled={updating}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Status & Info Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Return Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Return Number:</span>
                  <p className="font-medium">{returnRequest.return_number}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge className="ml-2">{returnRequest.request_type}</Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Reason:</span>
                  <p className="font-medium">{returnRequest.reason}</p>
                </div>
                {returnRequest.reason_details && (
                  <div>
                    <span className="text-sm text-muted-foreground">Details:</span>
                    <p className="text-sm">{returnRequest.reason_details}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className="ml-2">{returnRequest.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer & Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {returnRequest.order && (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground">Order Number:</span>
                      <p className="font-medium">{returnRequest.order.order_number}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Customer:</span>
                      <p className="font-medium">{returnRequest.order.customer_name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p className="font-medium">{returnRequest.order.customer_email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Requested:</span>
                      <p className="font-medium">
                        {format(new Date(returnRequest.requested_at), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Return Items */}
          <Card>
            <CardHeader>
              <CardTitle>Return Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {returnRequest.return_items?.map((item: ReturnItem) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">Quantity: {item.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                          Price: ₹{item.price_at_purchase.toFixed(2)}
                        </p>
                      </div>
                      <Badge>{item.qc_status || "pending"}</Badge>
                    </div>
                    {item.qc_notes && (
                      <p className="text-sm text-muted-foreground mt-2">
                        QC Notes: {item.qc_notes}
                      </p>
                    )}
                    {returnRequest.status === "qc_pending" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleQCUpdate(item.id, "passed")}
                          disabled={updating}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Pass QC
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const notes = prompt("Enter QC failure reason:");
                            if (notes) handleQCUpdate(item.id, "failed", notes);
                          }}
                          disabled={updating}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Fail QC
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Update Status</label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ReturnStatus)}>
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

          {/* Attachments */}
          {returnRequest.attachments && returnRequest.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {returnRequest.attachments.map((att: any) => (
                    <div key={att.id}>
                      {att.file_type === "photo" ? (
                        <img
                          src={att.file_url}
                          alt="Return attachment"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={att.file_url}
                          controls
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}



