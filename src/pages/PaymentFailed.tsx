import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, RefreshCw, AlertCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function PaymentFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error") || "Payment could not be processed";
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-red-600">
              Payment Failed
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Unfortunately, your payment could not be processed.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-900 mb-1">What happened?</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold">Possible reasons:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Insufficient funds in your account</li>
                <li>Card details entered incorrectly</li>
                <li>Network connectivity issues</li>
                <li>Payment gateway temporarily unavailable</li>
                <li>Card expired or blocked</li>
              </ul>
            </div>

            {orderId && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Please note this order ID for reference if you need to contact support.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                onClick={() => navigate("/checkout")}
                variant="default"
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <a href="/contact" className="text-primary hover:underline">
                  Contact our support team
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}

