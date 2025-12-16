import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { 
  getAllSocialMediaLinks,
  updateSocialMediaLink,
  type SocialMediaLink
} from "@/lib/admin-social-media";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { toast } from "sonner";

export default function SocialMedia() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [links, setLinks] = useState<SocialMediaLink[]>([]);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    const data = await getAllSocialMediaLinks();
    setLinks(data);
    setLoading(false);
  };

  const handleInputChange = (id: string, field: string, value: any) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleSave = async (link: SocialMediaLink) => {
    setSaving(true);
    try {
      const { error } = await updateSocialMediaLink(link.id, {
        url: link.url,
        is_active: link.is_active,
      });
      if (error) throw error;
      toast.success(`${link.icon_name} link updated!`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update link");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      for (const link of links) {
        const { error } = await updateSocialMediaLink(link.id, {
          url: link.url,
          is_active: link.is_active,
        });
        if (error) throw error;
      }
      toast.success("All social media links updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update links");
    } finally {
      setSaving(false);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Social Media Links</h1>
              <p className="text-muted-foreground mt-1">
                Manage social media links in the footer
              </p>
            </div>
            <Button onClick={handleSaveAll} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              Save All
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {links.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <CardTitle className="capitalize">{link.icon_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`url-${link.id}`}>URL *</Label>
                    <Input
                      id={`url-${link.id}`}
                      value={link.url}
                      onChange={(e) => handleInputChange(link.id, "url", e.target.value)}
                      placeholder={`https://www.${link.platform}.com/auroracadence`}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Label htmlFor={`active-${link.id}`}>Active</Label>
                    <Switch
                      id={`active-${link.id}`}
                      checked={link.is_active}
                      onCheckedChange={(checked) => handleInputChange(link.id, "is_active", checked)}
                    />
                  </div>
                  <Button
                    onClick={() => handleSave(link)}
                    disabled={saving}
                    className="w-full"
                  >
                    Save {link.icon_name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}

