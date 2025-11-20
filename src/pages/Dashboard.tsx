import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, DollarSign, Shield, LogOut } from "lucide-react";
import TariffCalculator from "@/components/TariffCalculator";
import ScenarioAnalysis from "@/components/ScenarioAnalysis";
import MitigationStrategies from "@/components/MitigationStrategies";
import ProductList from "@/components/ProductList";
import AlertCenter from "@/components/AlertCenter";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  products: Product[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/auth");
          return;
        }

        // Fetch company and products
        const { data: companies, error: companyError } = await supabase
          .from("companies")
          .select(`
            id,
            name,
            location,
            products (
              id,
              name,
              hs_code,
              country_of_origin,
              cost_per_unit,
              units_per_month
            )
          `)
          .eq("user_id", user.id)
          .limit(1);

        if (companyError) throw companyError;

        if (companies && companies.length > 0) {
          const company = companies[0];
          const formattedData: BusinessData = {
            companyName: company.name,
            businessLocation: company.location,
            products: (company.products as any[]).map((p: any) => ({
              id: p.id,
              name: p.name,
              hsCode: p.hs_code || "",
              countryOfOrigin: p.country_of_origin,
              costPerUnit: p.cost_per_unit.toString(),
              unitsPerMonth: p.units_per_month.toString(),
            })),
          };
          setBusinessData(formattedData);
        }
      } catch (error: any) {
        console.error("Error fetching business data:", error);
        toast({
          title: "Error loading data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [navigate, toast]);

  // Calculate total monthly impact from all products
  const calculateMonthlyImpact = () => {
    if (!businessData) return 0;
    
    // Simple calculation: assume 15% average tariff increase impact
    let total = 0;
    businessData.products.forEach(product => {
      const cost = parseFloat(product.costPerUnit) || 0;
      const units = parseFloat(product.unitsPerMonth) || 0;
      const impact = cost * units * 0.15; // 15% tariff increase
      total += impact;
    });
    return Math.round(total);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const monthlyImpact = calculateMonthlyImpact();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 py-8">
        {businessData ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-foreground">{businessData.companyName}</h1>
                  <Badge variant="outline" className="text-sm">
                    {businessData.businessLocation.charAt(0).toUpperCase() + businessData.businessLocation.slice(1)}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate("/setup")}>
                    Edit Profile
                  </Button>
                  <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">
                {businessData.products.length === 1 
                  ? `Importing ${businessData.products[0].name}`
                  : `Importing ${businessData.products.map(p => p.name).join(", ")}`}
              </p>

              {/* Product Details */}
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {businessData.products.map((product) => (
                  <Card key={product.id} className="shadow-[var(--shadow-card)]">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-foreground mb-2">{product.name}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {product.hsCode && <p>HS Code: {product.hsCode}</p>}
                        {product.countryOfOrigin && (
                          <p>Origin: {product.countryOfOrigin.charAt(0).toUpperCase() + product.countryOfOrigin.slice(1)}</p>
                        )}
                        <p>Cost: ${parseFloat(product.costPerUnit).toFixed(2)}/unit</p>
                        <p>Volume: {product.unitsPerMonth} units/month</p>
                        <p className="font-semibold text-foreground pt-2">
                          Monthly: ${(parseFloat(product.costPerUnit) * parseFloat(product.unitsPerMonth)).toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Product List Section */}
              <div className="mt-6">
                <ProductList products={businessData.products} businessLocation={businessData.businessLocation} />
              </div>
            </div>
          </>
        ) : (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-foreground">Prairie Grounds Coffee</h1>
              <Badge variant="outline" className="text-sm">Calgary, AB</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Importing coffee beans, ceramic mugs, and espresso machine parts
            </p>
            <Button onClick={() => navigate("/setup")}>
              Set Up Your Business Profile
            </Button>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<AlertCircle className="w-5 h-5" />}
            label="Active Alerts"
            value="3"
            trend="2 new this week"
            variant="warning"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Monitored Policies"
            value="12"
            trend="Up to date"
            variant="success"
          />
          <StatCard
            icon={<DollarSign className="w-5 h-5" />}
            label="Monthly Impact"
            value={`$${monthlyImpact}`}
            trend={businessData ? "From tariff increases" : "From mug tariff increase"}
            variant="warning"
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            label="Risk Level"
            value="Low"
            trend="Well prepared"
            variant="success"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AlertCenter products={businessData?.products || []} />
            <TariffCalculator products={businessData?.products || []} />
            <ScenarioAnalysis products={businessData?.products || []} />
          </div>
          
          <div className="space-y-6">
            <MitigationStrategies />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ 
  icon, 
  label, 
  value, 
  trend, 
  variant 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  trend: string;
  variant: "default" | "success" | "warning";
}) => {
  const variantStyles = {
    default: "bg-card",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
  };

  return (
    <Card className={`${variantStyles[variant]} shadow-[var(--shadow-card)]`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-2">
          <div className="text-muted-foreground">{icon}</div>
          <Badge variant={variant === "success" ? "default" : variant === "warning" ? "secondary" : "outline"}>
            {label}
          </Badge>
        </div>
        <div className="text-3xl font-bold mb-1 text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{trend}</p>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
