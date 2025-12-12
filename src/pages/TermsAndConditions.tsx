import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Terms & Conditions
        </h1>
        <p className="text-muted-foreground mb-12">Last Updated: 12/12/2025</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Aurora Cadence. These Terms & Conditions govern your access to and use of our website, services, and products ("Services"). By accessing or purchasing from our website, you agree to be bound by these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              If you do not agree to these Terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. General Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Aurora Cadence is a fashion jewellery brand offering 18k gold-plated jewellery, Swarovski pieces, and celebrity-inspired designs. Our products are sold online through our website and across partner retail stores in Kerala.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to update or modify these Terms at any time. Changes will be posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              By using our website, you confirm that you:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Are at least 18 years old, or using the site under parental/guardian supervision.</li>
              <li>Are legally capable of entering into a binding contract.</li>
              <li>Will provide accurate, truthful account information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Product Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              We aim to ensure all product details, descriptions, prices, and images are accurate. However:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Slight variations in colour, finish, or size may occur.</li>
              <li>Product availability may change without notice.</li>
              <li>Prices are subject to change at our discretion.</li>
              <li>We reserve the right to limit quantities and discontinue products.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Orders & Acceptance</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Placing an order does not guarantee acceptance. We may refuse or cancel an order for reasons including but not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-2">
              <li>Product unavailability</li>
              <li>Pricing errors</li>
              <li>Payment issues</li>
              <li>Suspected fraud or misuse</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Once your order is accepted, you will receive an order confirmation via email/SMS/WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Payments</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>We accept online payments through secure third-party payment gateways.</li>
              <li>By providing payment information, you represent that you are authorized to use the payment method.</li>
              <li>Aurora Cadence is not responsible for delays or failures caused by payment gateway providers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">6. Shipping & Delivery</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              We ship products across India.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Delivery timelines may vary depending on:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-2">
              <li>Location</li>
              <li>Courier partner</li>
              <li>Product availability</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Estimated timelines are for reference only. Delays may occur due to unforeseen circumstances.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Shipping costs (if any) will be displayed during checkout.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">7. Returns, Exchange & Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Our return/exchange policy is designed to ensure customer satisfaction while maintaining hygiene standards.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Returns/exchanges are accepted within 3 days of delivery for eligible products.</li>
              <li>Items must be unused, unworn, and in original packaging.</li>
              <li>Certain items (such as personalised or sale products) may not be eligible for return.</li>
              <li>Refunds will be processed to the original payment method or store credit.</li>
              <li>Full details are available on our Return Policy page.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">8. Jewellery Care & Warranty</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Our products are crafted with high-quality 18k gold plating and premium materials. However:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Exposure to water, perfumes, sweat, or chemicals may reduce longevity.</li>
              <li>Each purchase includes jewellery care instructions.</li>
              <li>Warranty (if applicable) covers manufacturing defects only.</li>
              <li>Normal wear and tear is not covered.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">9. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              When creating an account:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>You agree to provide accurate and updated information.</li>
              <li>You are responsible for maintaining password confidentiality.</li>
              <li>You must notify us immediately of unauthorized access.</li>
              <li>We may suspend accounts that violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">10. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              All content on the website—including text, images, logos, designs, videos, and graphics—is the property of Aurora Cadence and protected under applicable laws.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You may not copy, reproduce, distribute, or modify any content without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">11. Privacy Policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Your personal information is handled as per our Privacy Policy.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              By using our website, you consent to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Collection</li>
              <li>Storage</li>
              <li>Processing</li>
              <li>Use of your data</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              for order fulfillment and service improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Influencer Content & Reviews</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Any influencer or customer content featured on our site or social platforms is used with permission.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to use such content for marketing, promotions, or display across our platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">13. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Aurora Cadence is not liable for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-2">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss resulting from inability to use the site</li>
              <li>Delays caused by courier partners or payment gateways</li>
              <li>Misuse of products purchased from us</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Our total liability shall not exceed the amount paid for the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">14. Prohibited Activities</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-2">
              <li>Use the site for fraudulent or unlawful purposes</li>
              <li>Attempt to breach website security</li>
              <li>Copy or redistribute content without consent</li>
              <li>Interfere with site functionality</li>
              <li>Misrepresent your identity</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Violations may result in account termination or legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">15. Third-Party Services & Links</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              We may use third-party service providers such as:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-2">
              <li>Payment gateways</li>
              <li>Logistics & courier partners</li>
              <li>WhatsApp communication APIs</li>
              <li>SMS/Email services</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              We are not responsible for content or policies of external sites.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">16. Governing Law & Jurisdiction</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              These Terms are governed by the laws of India.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Any disputes shall be subject to the exclusive jurisdiction of the courts located in Kerala, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">17. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              For questions regarding these Terms, please contact us:
            </p>
            <div className="text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Aurora Cadence Customer Support</p>
              <p>Email: [your email]</p>
              <p>Phone: [your number]</p>
              <p>Address: [store/office address]</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

