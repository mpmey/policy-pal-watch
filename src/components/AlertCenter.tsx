import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, AlertTriangle, Info, AlertCircle } from "lucide-react";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  relatedProducts: string[];
}

interface AlertCenterProps {
  products?: { id: string; name: string }[];
}

const AlertCenter = ({ products = [] }: AlertCenterProps) => {
  // Mock alerts - in a real app, these would come from the backend
  const alerts: Alert[] = [
    {
      id: 1,
      title: "Critical: U.S. Tariff Increase on Chinese Imports",
      description: "Tariff rates for HS code 6912.00 (ceramic tableware) increased from 10% to 25%. Immediate impact on product pricing expected.",
      severity: "critical",
      timestamp: "2 hours ago",
      relatedProducts: products.filter(p => p.name.toLowerCase().includes("mug")).map(p => p.name),
    },
    {
      id: 2,
      title: "Warning: Potential Policy Change",
      description: "Proposed trade policy changes may affect imports from China. Review scheduled for next month.",
      severity: "warning",
      timestamp: "1 day ago",
      relatedProducts: products.filter(p => p.name.toLowerCase().includes("china")).map(p => p.name),
    },
    {
      id: 3,
      title: "Info: Trade Agreement Update",
      description: "Tariff-free status maintained for coffee beans from Colombia under current trade agreements.",
      severity: "info",
      timestamp: "3 days ago",
      relatedProducts: products.filter(p => p.name.toLowerCase().includes("coffee")).map(p => p.name),
    },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "info":
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      case "info":
        return "default";
      default:
        return "outline";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-destructive/30 bg-destructive/5";
      case "warning":
        return "border-warning/30 bg-warning/5";
      case "info":
        return "border-primary/30 bg-primary/5";
      default:
        return "border-border bg-card";
    }
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Alert Center
        </CardTitle>
        <CardDescription>
          {alerts.length} active {alerts.length === 1 ? "alert" : "alerts"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{alert.title}</h4>
                    <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  
                  {/* Related Products */}
                  {alert.relatedProducts.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-muted-foreground mb-1">Related Products:</p>
                      <div className="flex flex-wrap gap-1">
                        {alert.relatedProducts.map((product, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {alert.timestamp}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertCenter;
