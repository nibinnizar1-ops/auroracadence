import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { getAllReturnRequests, type ReturnRequest, type ReturnStatus } from "@/lib/returns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Eye,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const statusColors: Record<ReturnStatus, string> = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  approved: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  pickup_scheduled: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  in_transit: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  received: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  qc_pending: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  qc_passed: "bg-green-500/10 text-green-600 border-green-500/20",
  qc_failed: "bg-red-500/10 text-red-600 border-red-500/20",
  refund_processing: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  refunded: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  exchanged: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  rejected: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  cancelled: "bg-slate-500/10 text-slate-600 border-slate-500/20",
};

const statusIcons: Record<ReturnStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />,
  pickup_scheduled: <Clock className="h-4 w-4" />,
  in_transit: <Clock className="h-4 w-4" />,
  received: <CheckCircle2 className="h-4 w-4" />,
  qc_pending: <Clock className="h-4 w-4" />,
  qc_passed: <CheckCircle2 className="h-4 w-4" />,
  qc_failed: <XCircle className="h-4 w-4" />,
  refund_processing: <Clock className="h-4 w-4" />,
  refunded: <CheckCircle2 className="h-4 w-4" />,
  exchanged: <CheckCircle2 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

export default function Returns() {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    status?: ReturnStatus;
    return_number?: string;
    order_number?: string;
  }>({});

  useEffect(() => {
    loadReturnRequests();
  }, [filters]);

  const loadReturnRequests = async () => {
    setLoading(true);
    const { data, error } = await getAllReturnRequests(filters);
    if (error) {
      console.error("Error loading return requests:", error);
    } else {
      setReturnRequests(data || []);
    }
    setLoading(false);
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === "all" ? undefined : (status as ReturnStatus),
    }));
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({
      ...prev,
      return_number: value || undefined,
      order_number: value || undefined,
    }));
  };

  // Calculate stats
  const stats = {
    total: returnRequests.length,
    pending: returnRequests.filter(r => r.status === 'pending').length,
    qc_pending: returnRequests.filter(r => r.status === 'qc_pending').length,
    refunded: returnRequests.filter(r => r.status === 'refunded').length,
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Return Management</h1>
            <p className="text-muted-foreground">Manage customer return requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">QC Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.qc_pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Refunded</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.refunded}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by return number or order number..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select onValueChange={handleStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="qc_pending">QC Pending</SelectItem>
                    <SelectItem value="qc_passed">QC Passed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Return Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Return Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : returnRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No return requests found
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Return #</TableHead>
                      <TableHead>Order #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Refund Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.return_number}
                        </TableCell>
                        <TableCell>{request.order_id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {request.request_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {request.reason}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={statusColors[request.status]}
                          >
                            <span className="flex items-center gap-1">
                              {statusIcons[request.status]}
                              {request.status.replace('_', ' ')}
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(request.requested_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          {request.refund_amount 
                            ? `₹${request.refund_amount.toFixed(2)}`
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/admin/returns/${request.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

