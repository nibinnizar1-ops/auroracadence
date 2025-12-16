import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Settings,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getAllPaymentGateways,
  activatePaymentGateway,
  type PaymentGateway,
} from "@/lib/admin-payment-gateways";
import { toast } from "sonner";

const gatewayCredentialFields: Record<string, { label: string; key: string }[]> = {
  razorpay: [
    { label: "Key ID", key: "key_id" },
    { label: "Key Secret", key: "key_secret" },
  ],
  payu: [
    { label: "Merchant Key", key: "merchant_key" },
    { label: "Merchant Salt", key: "merchant_salt" },
    { label: "Merchant ID", key: "merchant_id" },
  ],
  cashfree: [
    { label: "App ID", key: "app_id" },
    { label: "Secret Key", key: "secret_key" },
  ],
  zwitch: [
    { label: "Access Key", key: "access_key" },
    { label: "Secret Key", key: "secret_key" },
  ],
};

export default function PaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGateways();
  }, []);

  const loadGateways = async () => {
    setLoading(true);
    try {
      const data = await getAllPaymentGateways();
      setGateways(data);
    } catch (error) {
      console.error("Error loading gateways:", error);
      toast.error("Failed to load payment gateways");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (gatewayId: string) => {
    try {
      const { data, error } = await activatePaymentGateway(gatewayId);
      if (error) {
        toast.error(error.message || "Failed to activate gateway");
        return;
      }

      toast.success("Gateway activated successfully");
      loadGateways(); // Reload to update status
    } catch (error) {
      console.error("Error activating gateway:", error);
      toast.error("Failed to activate gateway");
    }
  };

  const isConfigured = (gateway: PaymentGateway): boolean => {
    const credentials = gateway.credentials || {};
    const requiredFields = gatewayCredentialFields[gateway.code] || [];
    return requiredFields.every((field) => credentials[field.key]);
  };

  const getStatusBadge = (gateway: PaymentGateway) => {
    if (gateway.is_active) {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Active
        </Badge>
      );
    }
    if (isConfigured(gateway)) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          Configured
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500/20">
        <XCircle className="h-3 w-3 mr-1" />
        Not Configured
      </Badge>
    );
  };

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Payment Gateways</h1>
              <p className="text-muted-foreground">
                Configure and manage payment gateway providers
              </p>
            </div>
          </div>

          {/* Gateways Table */}
          <Card>
            <CardHeader>
              <CardTitle>Available Payment Gateways</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading gateways...</p>
                </div>
              ) : gateways.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment gateways found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gateway</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Configuration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gateways.map((gateway) => (
                        <TableRow key={gateway.id}>
                          <TableCell>
                            <div className="font-medium">{gateway.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Code: {gateway.code}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(gateway)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {gateway.is_test_mode ? "Test Mode" : "Live Mode"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {isConfigured(gateway) ? (
                              <span className="text-sm text-green-600">✓ Credentials Set</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                No credentials
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/admin/payments/gateways/${gateway.id}/configure`}>
                                  <Settings className="h-4 w-4 mr-1" />
                                  {isConfigured(gateway) ? "Edit" : "Configure"}
                                </Link>
                              </Button>
                              {isConfigured(gateway) && !gateway.is_active && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleActivate(gateway.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Activate
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>1. Click "Configure" on a gateway to enter your API credentials</p>
              <p>2. Once configured, the gateway becomes available for activation</p>
              <p>3. Click "Activate" to make a gateway active (only one can be active at a time)</p>
              <p>4. The active gateway will be used for all new payments</p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

