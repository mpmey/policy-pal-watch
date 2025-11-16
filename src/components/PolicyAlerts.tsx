import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";

const PolicyAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "US Tariff Update on Electronics",
      description: "New tariff rates proposed for HS code 8517.12 (smartphones). Potential 10-15% increase expected.",
      impact: "Medium",
      date: "2 hours ago",
      category: "Tariffs",
    },
    {
      id: 2,
      title: "Canada Trade Agreement Amendment",
      description: "CUSMA provisions updated for textile imports. Review your textile product classifications.",
      impact: "Low",
      date: "1 day ago",
      category: "Trade Agreement",
    },
    {
      id: 3,
      title: "Duty Drawback Program Extended",
      description: "Good news! The duty drawback program has been extended through 2025 with expanded eligibility.",
      impact: "Positive",
      date: "3 days ago",
      category: "Opportunity",
    },
  ];

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Recent Policy Alerts
        </CardTitle>
        <CardDescription>Updates relevant to your business</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-foreground">{alert.title}</h4>
              <Badge
                variant={
                  alert.impact === "Medium" ? "secondary" :
                  alert.impact === "Positive" ? "default" : "outline"
                }
              >
                {alert.impact}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {alert.date}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {alert.category}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PolicyAlerts;
