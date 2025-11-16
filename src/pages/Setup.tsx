import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Setup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    productCategories: "",
    hsCodes: "",
    importExport: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Created!",
      description: "Your business profile has been set up successfully.",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Business Setup
          </div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Tell Us About Your Business</h1>
          <p className="text-muted-foreground">
            Help us personalize your policy monitoring experience
          </p>
        </div>

        <Card className="shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              We'll use this to track relevant policy changes for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your business name"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCategories">Product Categories</Label>
                <Textarea
                  id="productCategories"
                  placeholder="e.g., Electronics, Textiles, Agricultural products"
                  value={formData.productCategories}
                  onChange={(e) => handleChange("productCategories", e.target.value)}
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  List the main types of products your business deals with
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hsCodes">HS Codes (Optional)</Label>
                <Input
                  id="hsCodes"
                  placeholder="e.g., 8517.12, 6204.62"
                  value={formData.hsCodes}
                  onChange={(e) => handleChange("hsCodes", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter specific Harmonized System codes if you know them
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="importExport">Import/Export Details</Label>
                <Textarea
                  id="importExport"
                  placeholder="Tell us about your import and export activities"
                  value={formData.importExport}
                  onChange={(e) => handleChange("importExport", e.target.value)}
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Which countries do you trade with? What are your main markets?
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Complete Setup
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Setup;
