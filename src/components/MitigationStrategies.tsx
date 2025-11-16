import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2 } from "lucide-react";

const MitigationStrategies = () => {
  const strategies = [
    {
      id: 1,
      title: "Adjust Order Timing",
      description: "Consider placing larger orders before new tariffs take effect to lock in current rates.",
      priority: "High",
    },
    {
      id: 2,
      title: "Review Supplier Contracts",
      description: "Check if contracts include provisions for tariff changes and negotiate shared responsibilities.",
      priority: "High",
    },
    {
      id: 3,
      title: "Explore Duty Drawback",
      description: "You may be eligible for duty refunds on exported goods. Research available programs.",
      priority: "Medium",
    },
    {
      id: 4,
      title: "Inventory Planning",
      description: "Build strategic inventory levels to buffer against short-term cost fluctuations.",
      priority: "Medium",
    },
    {
      id: 5,
      title: "Product Reclassification",
      description: "Work with a customs broker to ensure your products are classified optimally.",
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
