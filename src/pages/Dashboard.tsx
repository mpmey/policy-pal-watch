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
  industry: string;
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
            industry,
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
            industry: company.industry || "",
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-1">TradeGuard</h1>
                  <p className="text-xl text-foreground">{businessData.companyName}</p>
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

              {/* Product List Section */}
              <div className="mt-6">
                <ProductList products={businessData.products} businessLocation={businessData.businessLocation} />
              </div>
            </div>
          </>
        ) : (
          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">TradeGuard</h1>
              <p className="text-xl text-foreground mb-4">Set Up Your Business Profile</p>
            </div>
            <Button onClick={() => navigate("/setup")}>
              Get Started
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AlertCenter products={businessData?.products || []} industry={businessData?.industry || ""} />
            <TariffCalculator products={businessData?.products || []} />
            <ScenarioAnalysis products={businessData?.products || []} />
          </div>
          
          <div className="space-y-6">
            <MitigationStrategies industry={businessData?.industry || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
