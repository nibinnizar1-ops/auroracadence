import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

// Social media links - update these directly in the code
const socialLinks = [
  { url: "https://www.instagram.com/auroracadence", icon: Instagram, label: "Instagram" },
  { url: "https://www.facebook.com/auroracadence", icon: Facebook, label: "Facebook" },
  { url: "https://www.twitter.com/auroracadence", icon: Twitter, label: "Twitter" },
  { url: "https://www.youtube.com/@auroracadence", icon: Youtube, label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-secondary/20">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-4">Aurora Cadence</h3>
        <p className="text-muted-foreground mb-4">Timeless Elegance, Crafted With Love</p>
        
        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-6">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.label}
              >
                <Icon className="w-6 h-6" />
              </a>
            );
          })}
        </div>

        <div className="flex justify-center gap-8 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          <Link to="/refund-policy" className="hover:text-foreground transition-colors">Refund & Return Policy</Link>
          <Link to="/terms-and-conditions" className="hover:text-foreground transition-colors">Terms of Service</Link>
        </div>
        <p className="text-xs text-muted-foreground mt-8">
          © 2024 Aurora Cadence. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

