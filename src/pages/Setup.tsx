import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Building2, HelpCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Setup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: "",
    hsCodes: "",
    productDescription: "",
    countryOfOrigin: "",
    costType: "perUnit",
    costPerUnit: "",
    monthlySpend: "",
    importVolume: "",
    importFrequency: "",
    currentMargin: "",
    targetMargin: "",
    currency: "CAD",
    alertEmail: "",
    alertPhone: "",
  });

  const [showHsCodeHelper, setShowHsCodeHelper] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile Created! 🎉",
      description: "Your business profile has been set up successfully. We'll start monitoring policy changes for you.",
    });
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSuggestHsCode = () => {
    toast({
      title: "HS Code Suggestion",
      description: "Based on your description, we suggest: 8517.12 (Smartphones). This is a demo feature.",
    });
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Let's start with the basics about your business
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Help us understand what you import or export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hsCodes">HS Codes</Label>
                <Input
                  id="hsCodes"
                  placeholder="e.g., 8517.12, 6204.62 (separate multiple codes with commas)"
                  value={formData.hsCodes}
                  onChange={(e) => handleChange("hsCodes", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your Harmonized System codes if you know them
                </p>
              </div>

              {!showHsCodeHelper ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowHsCodeHelper(true)}
                  className="w-full"
                >
                  <HelpCircle className="mr-2 w-4 h-4" />
                  Not sure about your HS code? Describe your product
                </Button>
              ) : (
                <div className="space-y-3 p-4 bg-accent/50 rounded-lg border border-border">
                  <Label htmlFor="productDescription">Product Description</Label>
                  <Textarea
                    id="productDescription"
                    placeholder="Describe what you import or export (e.g., 'Cotton t-shirts for men', 'Smartphone accessories', 'Frozen seafood')"
                    value={formData.productDescription}
                    onChange={(e) => handleChange("productDescription", e.target.value)}
                    rows={3}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleSuggestHsCode}
                    className="w-full"
                  >
                    <Sparkles className="mr-2 w-4 h-4" />
                    Suggest HS Code
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Import Details */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Import Details</CardTitle>
              <CardDescription>
                Tell us about your import activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="countryOfOrigin">Country of Origin</Label>
                <Select value={formData.countryOfOrigin} onValueChange={(value) => handleChange("countryOfOrigin", value)}>
                  <SelectTrigger id="countryOfOrigin">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="china">China</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="mexico">Mexico</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="vietnam">Vietnam</SelectItem>
                    <SelectItem value="india">India</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>How would you like to track costs?</Label>
                <RadioGroup value={formData.costType} onValueChange={(value) => handleChange("costType", value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="perUnit" id="perUnit" />
                    <Label htmlFor="perUnit" className="font-normal cursor-pointer">
                      Cost per unit
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="totalSpend" id="totalSpend" />
                    <Label htmlFor="totalSpend" className="font-normal cursor-pointer">
                      Total monthly/annual spend
                    </Label>
                  </div>
                </RadioGroup>

                {formData.costType === "perUnit" ? (
                  <div className="space-y-2">
                    <Label htmlFor="costPerUnit">Cost Per Unit</Label>
                    <Input
                      id="costPerUnit"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 12.50"
                      value={formData.costPerUnit}
                      onChange={(e) => handleChange("costPerUnit", e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="monthlySpend">Monthly/Annual Import Spend</Label>
                    <Input
                      id="monthlySpend"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 50000"
                      value={formData.monthlySpend}
                      onChange={(e) => handleChange("monthlySpend", e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="importVolume">Import Volume (units/month)</Label>
                  <Input
                    id="importVolume"
                    type="number"
                    placeholder="e.g., 1000"
                    value={formData.importVolume}
                    onChange={(e) => handleChange("importVolume", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="importFrequency">Shipments per Month</Label>
                  <Input
                    id="importFrequency"
                    type="number"
                    placeholder="e.g., 2"
                    value={formData.importFrequency}
                    onChange={(e) => handleChange("importFrequency", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Context */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Business Context (Optional)</CardTitle>
              <CardDescription>
                Help us provide more personalized insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentMargin">Current Margin (%)</Label>
                  <Input
                    id="currentMargin"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 25"
                    value={formData.currentMargin}
                    onChange={(e) => handleChange("currentMargin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetMargin">Target Margin (%)</Label>
                  <Input
                    id="targetMargin"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 30"
                    value={formData.targetMargin}
                    onChange={(e) => handleChange("targetMargin", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => handleChange("currency", value)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Setup */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Stay Informed</CardTitle>
              <CardDescription>
                Get real-time alerts when policy changes affect your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alertEmail">Email Address</Label>
                <Input
                  id="alertEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.alertEmail}
                  onChange={(e) => handleChange("alertEmail", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  We'll send you friendly updates about policy changes
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertPhone">Phone Number (Optional)</Label>
                <Input
                  id="alertPhone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.alertPhone}
                  onChange={(e) => handleChange("alertPhone", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  For urgent policy alerts via SMS
                </p>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg">
            Save & Continue to Dashboard
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
