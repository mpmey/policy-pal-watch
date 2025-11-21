import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2 } from "lucide-react";

interface MitigationStrategiesProps {
  industry?: string;
}

const MitigationStrategies = ({ industry = "" }: MitigationStrategiesProps) => {
  // Industry-specific strategies
  const getStrategiesForIndustry = (ind: string) => {
    const baseStrategies = [
      {
        id: 1,
        title: "Adjust Retail Pricing",
        description: "Increase retail prices strategically to offset increased landed costs while maintaining competitiveness.",
        priority: "High",
        industries: ["retail", "food-beverage", "textiles-apparel"],
      },
      {
        id: 2,
        title: "Negotiate Bulk Ordering",
        description: "Contact suppliers about volume discounts. Ordering in larger quantities can save 8-12% on per-unit costs.",
        priority: "High",
        industries: ["retail", "food-beverage", "manufacturing", "electronics"],
      },
      {
        id: 3,
        title: "Diversify Supplier Base",
        description: "Explore alternative suppliers in countries with lower tariff rates. Consider Vietnam, Mexico, or nearshoring options.",
        priority: "Medium",
        industries: ["retail", "manufacturing", "electronics", "textiles-apparel"],
      },
      {
        id: 4,
        title: "Stock Up Before Increases",
        description: "Build 3-6 month inventory at current rates. This buffers you against further tariff escalation.",
        priority: "Medium",
        industries: ["retail", "food-beverage", "electronics"],
      },
      {
        id: 5,
        title: "Product Mix Adjustment",
        description: "Consider alternative products with different HS codes that have lower tariff rates.",
        priority: "Low",
        industries: ["retail", "food-beverage"],
      },
      {
        id: 6,
        title: "Domestic Sourcing Exploration",
        description: "Evaluate the feasibility of sourcing from domestic suppliers to avoid tariffs entirely.",
        priority: "Medium",
        industries: ["manufacturing", "food-beverage", "agriculture"],
      },
      {
        id: 7,
        title: "Free Trade Zone Utilization",
        description: "Leverage free trade zones or bonded warehouses to defer or reduce tariff payments.",
        priority: "Low",
        industries: ["manufacturing", "electronics", "automotive"],
      },
      {
        id: 8,
        title: "Process Optimization",
        description: "Review production and logistics processes to reduce waste and improve efficiency, offsetting increased costs.",
        priority: "Medium",
        industries: ["manufacturing", "automotive", "machinery"],
      },
    ];

    // Filter strategies by industry if specified
    if (ind) {
      return baseStrategies.filter((s) => s.industries.includes(ind));
    }
    
    // Return general strategies if no industry specified
    return baseStrategies.slice(0, 5);
  };

  const strategies = getStrategiesForIndustry(industry);

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Mitigation Strategies
        </CardTitle>
        <CardDescription>
          {industry ? "Tailored strategies for your industry" : "Practical steps to reduce your risk"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-sm text-foreground">{strategy.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    strategy.priority === "High" 
                      ? "bg-warning/20 text-warning-foreground" 
                      : strategy.priority === "Medium"
                      ? "bg-primary/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {strategy.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{strategy.description}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MitigationStrategies;
