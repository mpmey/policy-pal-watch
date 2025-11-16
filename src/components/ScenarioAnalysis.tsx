import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ScenarioAnalysis = () => {
  const scenarios = [
    {
      id: 1,
      name: "Best Case",
      description: "Tariffs remain at current levels",
      impact: 0,
      icon: <Minus className="w-5 h-5" />,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 2,
      name: "Likely Case",
      description: "Tariffs increase by 10%",
      impact: 2400,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: 3,
      name: "Worst Case",
      description: "Tariffs increase by 25%",
      impact: 6000,
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Estimated Annual Impact:</span>
                <span className={`font-bold text-lg ${scenario.color}`}>
                  {scenario.impact === 0 ? "$0" : `+$${scenario.impact.toLocaleString()}`}
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
