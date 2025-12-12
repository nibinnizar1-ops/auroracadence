import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Refund & Return Policy
        </h1>
        <p className="text-muted-foreground mb-12">Last Updated: 12/12/2025</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Aurora Cadence is committed to ensuring a satisfactory shopping experience. This policy outlines the conditions for returns, exchanges, and refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Return & Exchange Eligibility</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
              <li>Returns or exchanges must be requested within 3 days of delivery.</li>
              <li>Items must be unused, unworn, and in original packaging (jewellery box, tags, pouch).</li>
              <li>Items showing wear, damage, or alterations are not eligible.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-2 font-semibold">Non-returnable items:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Earrings (hygiene reasons)</li>
              <li>Personalised or custom items</li>
              <li>Gift cards</li>
              <li>Sale or clearance items marked non-returnable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Damaged or Incorrect Products</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              If you receive a damaged, defective, or incorrect item:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Contact us within 48 hours of delivery.</li>
              <li>Provide your order ID, photographs, and an unboxing video.</li>
              <li>Once verified, we will arrange a replacement or process a refund.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Return Process</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Contact customer support with your order ID and reason for return.</li>
              <li>Upon approval, a pickup will be scheduled.</li>
              <li>Returned items undergo a quality check.</li>
              <li>Refunds or exchanges are processed after QC approval.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Refund Method</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Refunds may be issued as store credit or to the original payment method, depending on eligibility.</li>
              <li>COD orders are refunded as store credit only.</li>
              <li>Shipping fees, COD charges, and handling fees are non-refundable.</li>
              <li>Refunds to original payment methods may take 5–7 business days after QC approval.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Order Cancellation</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Orders may be cancelled within 12 hours of placement or before dispatch.</li>
              <li>Once shipped, cancellations are not accepted. You may request a return after delivery if eligible.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Exchange Policy</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>One-time exchange per order is permitted, within the 3-day request window, subject to product availability.</li>
              <li>If the requested item is unavailable, store credit or refund will be issued.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. General Conditions</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Damage caused by improper handling, exposure to chemicals, perfumes, sweat, or normal wear and tear is not covered.</li>
              <li>Aurora Cadence reserves the right to refuse returns in cases of misuse or repeated violations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              For return or refund requests, contact:
            </p>
            <div className="text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Aurora Cadence — Customer Support</p>
              <p>Email: [your email]</p>
              <p>Phone: [your phone]</p>
              <p>Address: [your address]</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

