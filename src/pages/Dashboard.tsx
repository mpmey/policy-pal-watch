import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, DollarSign, Shield } from "lucide-react";
import TariffCalculator from "@/components/TariffCalculator";
import ScenarioAnalysis from "@/components/ScenarioAnalysis";
import MitigationStrategies from "@/components/MitigationStrategies";
import PolicyAlerts from "@/components/PolicyAlerts";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-foreground">Prairie Grounds Coffee</h1>
            <Badge variant="outline" className="text-sm">Calgary, AB</Badge>
          </div>
          <p className="text-muted-foreground">
            Importing coffee beans, ceramic mugs, and espresso machine parts
          </p>
        </div>

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
            value="$420"
            trend="From mug tariff increase"
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
            <PolicyAlerts />
            <TariffCalculator />
            <ScenarioAnalysis />
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
