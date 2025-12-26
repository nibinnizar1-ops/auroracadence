import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, TestTube } from "lucide-react";
import {
  getPaymentGatewayById,
  updatePaymentGateway,
  testGatewayConnection,
  type PaymentGateway,
} from "@/lib/admin-payment-gateways";
import { toast } from "sonner";

const gatewayCredentialFields: Record<string, { label: string; key: string; placeholder: string; optional?: boolean }[]> = {
  razorpay: [
    { label: "Key ID", key: "key_id", placeholder: "rzp_test_..." },
    { label: "Key Secret", key: "key_secret", placeholder: "Enter your Razorpay key secret" },
  ],
  payu: [
    { label: "Merchant Key", key: "merchant_key", placeholder: "Enter merchant key" },
    { label: "Merchant Salt", key: "merchant_salt", placeholder: "Enter merchant salt" },
    { label: "Merchant ID", key: "merchant_id", placeholder: "Enter merchant ID" },
  ],
  cashfree: [
    { label: "App ID", key: "app_id", placeholder: "Enter Cashfree app ID" },
    { label: "Secret Key", key: "secret_key", placeholder: "Enter Cashfree secret key" },
  ],
  zwitch: [
    // Zwitch credentials are stored in Supabase Vault, not database
    // Only show config fields that can be managed
    { label: "Sub Accounts ID (Optional)", key: "sub_accounts_id", placeholder: "sa_da4f9f84ac6d", optional: true },
  ],
};

export default function PaymentGatewayForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [gateway, setGateway] = useState<PaymentGateway | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isTestMode, setIsTestMode] = useState(true);

  useEffect(() => {
    if (id) {
      loadGateway();
    }
  }, [id]);

  const loadGateway = async () => {
    setLoading(true);
    try {
      const data = await getPaymentGatewayById(id!);
      if (data) {
        setGateway(data);
        // For Zwitch, load config fields (like sub_accounts_id) from config, not credentials
        if (data.code === "zwitch") {
          setCredentials({
            sub_accounts_id: data.config?.sub_accounts_id || "",
          });
        } else {
          setCredentials(data.credentials || {});
        }
        setIsTestMode(data.is_test_mode);
      } else {
        toast.error("Gateway not found");
        navigate("/admin/payments/gateways");
      }
    } catch (error) {
      console.error("Error loading gateway:", error);
      toast.error("Failed to load gateway");
    } finally {
      setLoading(false);
    }
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTestConnection = async () => {
    if (!gateway) return;

    setTesting(true);
    try {
      const result = await testGatewayConnection(
        gateway.code,
        credentials,
        isTestMode
      );

      if (result.success) {
        toast.success("Connection test successful!");
      } else {
        toast.error(result.error || "Connection test failed");
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      toast.error("Failed to test connection");
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    if (!gateway) return;

    // For Zwitch, credentials come from Vault, so skip credential validation
    if (gateway.code !== "zwitch") {
      // Validate required fields (exclude optional fields)
      const allFields = gatewayCredentialFields[gateway.code] || [];
      const requiredFields = allFields.filter((field) => !field.optional);
      const missingFields = requiredFields.filter(
        (field) => !credentials[field.key] || credentials[field.key].trim() === ""
      );

      if (missingFields.length > 0) {
        toast.error(
          `Please fill in all required fields: ${missingFields.map((f) => f.label).join(", ")}`
        );
        return;
      }
    }

    setSaving(true);
    try {
      // For Zwitch, save config (sub_accounts_id) but not credentials
      // Credentials are in Vault
      const updateData: any = {
        is_test_mode: isTestMode,
      };

      if (gateway.code === "zwitch") {
        // For Zwitch, save config fields (like sub_accounts_id) in config, not credentials
        updateData.config = {
          ...gateway.config,
          sub_accounts_id: credentials.sub_accounts_id || null,
        };
      } else {
        // For other gateways, save credentials normally
        updateData.credentials = credentials;
      }

      const { data, error } = await updatePaymentGateway(gateway.id, updateData);

      if (error) {
        toast.error(error.message || "Failed to save gateway configuration");
        return;
      }

      toast.success("Gateway configuration saved successfully!");
      navigate("/admin/payments/gateways");
    } catch (error) {
      console.error("Error saving gateway:", error);
      toast.error("Failed to save gateway configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading gateway...</p>
          </div>
        </AdminLayout>
      </AdminRoute>
    );
  }

  if (!gateway) {
    return null;
  }

  const credentialFields = gatewayCredentialFields[gateway.code] || [];

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/payments/gateways">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Configure {gateway.name}</h1>
              <p className="text-muted-foreground">
                {gateway.code === "zwitch" 
                  ? "Zwitch credentials are configured in Supabase Vault"
                  : `Enter your ${gateway.name} API credentials`}
              </p>
            </div>
          </div>

          {/* Configuration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Gateway Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Zwitch Vault Message */}
              {gateway.code === "zwitch" && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-blue-900">Credentials Stored in Supabase Vault</h3>
                      <p className="mt-1 text-sm text-blue-800">
                        Zwitch credentials (Access Key and Secret Key) are securely stored in Supabase Vault and cannot be managed here.
                      </p>
                      <p className="mt-2 text-sm text-blue-800">
                        <strong>To update credentials:</strong> Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets
                      </p>
                      <p className="mt-1 text-sm text-blue-800">
                        Required secrets: <code className="bg-blue-100 px-1 rounded">ZWITCH_ACCESS_KEY</code> and <code className="bg-blue-100 px-1 rounded">ZWITCH_SECRET_KEY</code>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Test/Live Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="test-mode">Test Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use test credentials for testing. Disable for live/production.
                    {gateway.code === "zwitch" && " (Note: Zwitch credentials are managed in Vault)"}
                  </p>
                </div>
                <Switch
                  id="test-mode"
                  checked={isTestMode}
                  onCheckedChange={setIsTestMode}
                />
              </div>

              {/* Credential Fields */}
              {credentialFields.length > 0 && (
                <div className="space-y-4">
                  <Label>Configuration</Label>
                  {credentialFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        type="text"
                        placeholder={field.placeholder}
                        value={credentials[field.key] || ""}
                        onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing || saving}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {testing ? "Testing..." : "Test Connection"}
                </Button>
                <Button onClick={handleSave} disabled={saving || testing}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Where to Find Credentials</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              {gateway.code === "razorpay" && (
                <>
                  <p>1. Log in to your Razorpay Dashboard</p>
                  <p>2. Go to Settings → API Keys</p>
                  <p>3. Generate or copy your Key ID and Key Secret</p>
                  <p>4. Use test keys for Test Mode, live keys for Live Mode</p>
                </>
              )}
              {gateway.code === "payu" && (
                <>
                  <p>1. Log in to your PayU Dashboard</p>
                  <p>2. Go to Integration → API Credentials</p>
                  <p>3. Copy your Merchant Key, Merchant Salt, and Merchant ID</p>
                </>
              )}
              {gateway.code === "cashfree" && (
                <>
                  <p>1. Log in to your Cashfree Dashboard</p>
                  <p>2. Go to Developers → API Keys</p>
                  <p>3. Copy your App ID and Secret Key</p>
                </>
              )}
              {gateway.code === "zwitch" && (
                <>
                  <p>1. Log in to your Zwitch Dashboard</p>
                  <p>2. Go to Settings → API Keys</p>
                  <p>3. Copy your Access Key and Secret Key</p>
                  <p>4. Or get them from Supabase Edge Functions → Secrets</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

