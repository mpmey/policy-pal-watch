import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2 } from "lucide-react";

const MitigationStrategies = () => {
  const strategies = [
    {
      id: 1,
      title: "Adjust Retail Pricing",
      description: "Increase mug retail price by $0.15 per sale to offset the $1.60 cost increase. Customer impact is minimal while protecting margins.",
      priority: "High",
    },
    {
      id: 2,
      title: "Negotiate Bulk Ordering",
      description: "Contact your China supplier about volume discounts. Ordering 1,000 mugs quarterly instead of 500 monthly could save 8-12%.",
      priority: "High",
    },
    {
      id: 3,
      title: "Diversify Mug Suppliers",
      description: "Explore alternative suppliers in Vietnam or Mexico where tariff rates may be lower. Could reduce per-unit costs by 15-20%.",
      priority: "Medium",
    },
    {
      id: 4,
      title: "Stock Up Before Next Increase",
      description: "Build 3-month inventory of mugs now at current rates. This buffers you against further tariff escalation rumors.",
      priority: "Medium",
    },
    {
      id: 5,
      title: "Product Mix Adjustment",
      description: "Consider glass or bamboo mug alternatives (different HS codes) with lower tariff rates as complementary product lines.",
      priority: "Low",
    },
  ];

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Mitigation Strategies
        </CardTitle>
        <CardDescription>Practical steps to reduce your risk</CardDescription>
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
