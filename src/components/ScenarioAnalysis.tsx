import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ScenarioAnalysis = () => {
  const scenarios = [
    {
      id: 1,
      name: "Current Situation",
      description: "Mug tariff at 10% - Cost: $4.00/mug",
      impact: 0,
      details: "Ordering 500 mugs/month = $2,000 total cost",
      icon: <Minus className="w-5 h-5" />,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 2,
      name: "New Tariff (Active)",
      description: "Mug tariff increased to 25% - Cost: $5.60/mug",
      impact: 420,
      details: "500 mugs/month × $1.60 increase = +$800/month",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: 3,
      name: "If Tariffs Expand",
      description: "25% tariff applied to all products",
      impact: 890,
      details: "Mugs + machine parts affected = +$890/month total",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle>Scenario Analysis</CardTitle>
        <CardDescription>
          Visual impact of different tariff outcomes on your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-4 rounded-lg border border-border ${scenario.bgColor} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`${scenario.color}`}>{scenario.icon}</div>
                <div>
                  <h4 className="font-semibold text-foreground">{scenario.name}</h4>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">{scenario.details}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Impact:</span>
                <span className={`font-bold text-lg ${scenario.color}`}>
                  {scenario.impact === 0 ? "$0" : `+$${scenario.impact.toLocaleString()}/mo`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ScenarioAnalysis;
