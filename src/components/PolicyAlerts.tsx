import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";

const PolicyAlerts = () => {
  const alerts = [
    {
      id: 1,
      title: "U.S. Tariff Increase on Ceramic Mugs",
      description: "New tariff rates for HS code 6912.00 (ceramic tableware) increased from 10% → 25%. Affects your imported mugs from China. Your cost per mug will rise from $4.00 to $5.60.",
      impact: "High",
      date: "2 hours ago",
      category: "Tariffs",
    },
    {
      id: 2,
      title: "Colombian Coffee Bean Trade Update",
      description: "Good news! Tariff-free status maintained for HS code 0901.11.00 (coffee beans) from Colombia under current trade agreements.",
      impact: "Positive",
      date: "1 day ago",
      category: "Trade Agreement",
    },
    {
      id: 3,
      title: "Espresso Machine Parts Duty Review",
      description: "CBP reviewing classification for HS code 8413.91 (pump parts). Potential reclassification could reduce duty rates for your espresso machine components.",
      impact: "Low",
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
                  alert.impact === "High" ? "destructive" :
                  alert.impact === "Positive" ? "default" : 
                  alert.impact === "Medium" ? "secondary" : "outline"
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
