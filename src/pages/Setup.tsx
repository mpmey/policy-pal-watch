import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Building2, Plus, Trash2, Shield, Check, ChevronsUpDown } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  hsCode: string;
  countryOfOrigin: string;
  costPerUnit: string;
  unitsPerMonth: string;
}

interface BusinessData {
  companyName: string;
  businessLocation: string;
  industry: string;
  products: Product[];
}

interface ProductCatalog {
  id: string;
  name: string;
  hs_code: string;
  description: string | null;
}

const Setup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [companyName, setCompanyName] = useState("");
  const [businessLocation, setBusinessLocation] = useState("canada");
  const [industry, setIndustry] = useState("");
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "",
      hsCode: "",
      countryOfOrigin: "",
      costPerUnit: "",
      unitsPerMonth: "",
    },
  ]);
  const [productCatalog, setProductCatalog] = useState<ProductCatalog[]>([]);
  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductCatalog = async () => {
      const { data, error } = await supabase
        .from("product_catalog")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching product catalog:", error);
      } else {
        setProductCatalog(data || []);
      }
    };

    fetchProductCatalog();
  }, []);

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      hsCode: "",
      countryOfOrigin: "",
      costPerUnit: "",
      unitsPerMonth: "",
    };
    setProducts([...products, newProduct]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleProductChange = (id: string, field: keyof Product, value: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleProductSelect = (productId: string, catalogItem: ProductCatalog) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, name: catalogItem.name, hsCode: catalogItem.hs_code } 
        : p
    ));
    setOpenPopovers({ ...openPopovers, [productId]: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name",
        variant: "destructive",
      });
      return;
    }

    if (!industry) {
      toast({
        title: "Industry required",
        description: "Please select your business industry",
        variant: "destructive",
      });
      return;
    }

    const validProducts = products.filter(p => p.name.trim() && p.costPerUnit && p.unitsPerMonth);
    
    if (validProducts.length === 0) {
      toast({
        title: "Add at least one product",
        description: "Please add at least one product with name, cost, and units",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Check if company already exists for this user
      const { data: existingCompanies } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      let companyId: string;

      if (existingCompanies && existingCompanies.length > 0) {
        // Update existing company
        companyId = existingCompanies[0].id;
        const { error: updateError } = await supabase
          .from("companies")
          .update({
            name: companyName,
            location: businessLocation,
            industry: industry,
          })
          .eq("id", companyId);

        if (updateError) throw updateError;

        // Delete existing products
        await supabase
          .from("products")
          .delete()
          .eq("company_id", companyId);
      } else {
        // Create new company
        const { data: newCompany, error: companyError } = await supabase
          .from("companies")
          .insert({
            user_id: user.id,
            name: companyName,
            location: businessLocation,
            industry: industry,
          })
          .select()
          .single();

        if (companyError) throw companyError;
        companyId = newCompany.id;
      }

      // Insert products
      const productsToInsert = validProducts.map(p => ({
        company_id: companyId,
        name: p.name,
        hs_code: p.hsCode || null,
        country_of_origin: p.countryOfOrigin,
        cost_per_unit: parseFloat(p.costPerUnit),
        units_per_month: parseInt(p.unitsPerMonth),
      }));

      const { error: productsError } = await supabase
        .from("products")
        .insert(productsToInsert);

      if (productsError) throw productsError;

      toast({
        title: "Business Setup Complete! 🎉",
        description: `Your profile for ${companyName} has been created successfully.`,
      });
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      console.error("Error saving business data:", error);
      toast({
        title: "Error saving data",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card py-12">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
            <Shield className="w-6 h-6" />
            TradeGuard
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-3xl pt-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Building2 className="w-4 h-4" />
            Business Setup
          </div>
          <h1 className="text-4xl font-bold mb-2 text-foreground">Tell Us About Your Business</h1>
          <p className="text-muted-foreground">
            Enter your information to generate a personalized tariff-impact dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Start by telling us your business name and location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g., Prairie Grounds Coffee"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessLocation">Business Location (Importing To)</Label>
                <Select
                  value={businessLocation}
                  onValueChange={setBusinessLocation}
                >
                  <SelectTrigger id="businessLocation">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="mexico">Mexico</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="italy">Italy</SelectItem>
                    <SelectItem value="spain">Spain</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="japan">Japan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={industry}
                  onValueChange={setIndustry}
                  required
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="textiles-apparel">Textiles & Apparel</SelectItem>
                    <SelectItem value="automotive">Automotive</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="chemicals">Chemicals</SelectItem>
                    <SelectItem value="machinery">Machinery</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product List */}
          <Card className="shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Add the products you import or export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="p-4 border border-border rounded-lg bg-card space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Product #{index + 1}</h3>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${product.id}`}>Product Name</Label>
                      <Popover 
                        open={openPopovers[product.id] || false} 
                        onOpenChange={(open) => setOpenPopovers({ ...openPopovers, [product.id]: open })}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between font-normal",
                              !product.name && "text-muted-foreground"
                            )}
                          >
                            {product.name || "Search products..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search products..." 
                              value={product.name}
                              onValueChange={(value) => handleProductChange(product.id, "name", value)}
                            />
                            <CommandList>
                              <CommandEmpty>
                                {product.name ? (
                                  <div className="p-2">
                                    <p className="text-sm text-muted-foreground mb-2">No match found. Custom entry:</p>
                                    <p className="text-sm font-medium">{product.name}</p>
                                  </div>
                                ) : (
                                  "Start typing to search..."
                                )}
                              </CommandEmpty>
                              <CommandGroup>
                                {productCatalog
                                  .filter(item => 
                                    item.name.toLowerCase().includes(product.name.toLowerCase())
                                  )
                                  .map((item) => (
                                    <CommandItem
                                      key={item.id}
                                      value={item.name}
                                      onSelect={() => handleProductSelect(product.id, item)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          product.name === item.name ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      <div className="flex flex-col">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          HS Code: {item.hs_code}
                                        </span>
                                      </div>
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`hsCode-${product.id}`}>HS Code (Optional)</Label>
                      <Input
                        id={`hsCode-${product.id}`}
                        placeholder="e.g., 0901.11.00"
                        value={product.hsCode}
                        onChange={(e) => handleProductChange(product.id, "hsCode", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`country-${product.id}`}>Country of Origin</Label>
                      <Select
                        value={product.countryOfOrigin}
                        onValueChange={(value) => handleProductChange(product.id, "countryOfOrigin", value)}
                      >
                        <SelectTrigger id={`country-${product.id}`}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="colombia">Colombia</SelectItem>
                          <SelectItem value="china">China</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="mexico">Mexico</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="vietnam">Vietnam</SelectItem>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="germany">Germany</SelectItem>
                          <SelectItem value="italy">Italy</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`cost-${product.id}`}>Wholesale Cost per Unit ($)</Label>
                      <Input
                        id={`cost-${product.id}`}
                        type="number"
                        step="0.01"
                        placeholder="e.g., 3.20"
                        value={product.costPerUnit}
                        onChange={(e) => handleProductChange(product.id, "costPerUnit", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor={`units-${product.id}`}>Units Purchased per Month</Label>
                      <Input
                        id={`units-${product.id}`}
                        type="number"
                        placeholder="e.g., 500"
                        value={product.unitsPerMonth}
                        onChange={(e) => handleProductChange(product.id, "unitsPerMonth", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddProduct}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another Product
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Saving..." : "Generate My Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
