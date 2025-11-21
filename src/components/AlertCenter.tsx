import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Clock, AlertTriangle, Info, AlertCircle } from "lucide-react";

interface Alert {
  id: number;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
  relatedProducts: string[];
  industry: string[];
}

interface AlertCenterProps {
  products?: { id: string; name: string }[];
  industry?: string;
}

const AlertCenter = ({ products = [], industry = "" }: AlertCenterProps) => {
  // Mock alerts - in a real app, these would come from the backend
  const allAlerts: Alert[] = [
    {
      id: 1,
      title: "Critical: U.S. Tariff Increase on Chinese Imports",
      description: "Tariff rates for HS code 6912.00 (ceramic tableware) increased from 10% to 25%. Immediate impact on product pricing expected.",
      severity: "critical",
      timestamp: "2 hours ago",
      relatedProducts: ["mug", "ceramic", "tableware"],
      industry: ["retail", "food-beverage"],
    },
    {
      id: 2,
      title: "Warning: Proposed Tariff Changes for Electronics",
      description: "Proposed 15% tariff on electronic components from China. Public comment period open until next month.",
      severity: "warning",
      timestamp: "1 day ago",
      relatedProducts: ["electronics", "components", "parts"],
      industry: ["electronics", "manufacturing"],
    },
    {
      id: 3,
      title: "Info: Trade Agreement Update - Coffee Imports",
      description: "Tariff-free status maintained for coffee beans from Colombia under current trade agreements.",
      severity: "info",
      timestamp: "3 days ago",
      relatedProducts: ["coffee", "beans"],
      industry: ["food-beverage", "retail"],
    },
    {
      id: 4,
      title: "Warning: Textile Tariff Review Scheduled",
      description: "Department of Commerce to review tariff rates on textile imports from Vietnam. Changes expected in Q2.",
      severity: "warning",
      timestamp: "5 days ago",
      relatedProducts: ["textile", "fabric", "clothing"],
      industry: ["textiles-apparel", "retail"],
    },
    {
      id: 5,
      title: "Critical: Steel and Aluminum Tariff Increase",
      description: "Section 232 tariffs increased to 35% on steel and aluminum imports. Affects manufacturing and automotive sectors.",
      severity: "critical",
      timestamp: "1 week ago",
      relatedProducts: ["steel", "aluminum", "metal"],
      industry: ["manufacturing", "automotive", "machinery"],
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

  // Filter alerts by industry and products
  const filteredAlerts = allAlerts.filter((alert) => {
    // Filter by industry
    if (industry && alert.industry.length > 0 && !alert.industry.includes(industry)) {
      return false;
    }

    // Filter by products - check if any product name matches alert's related products
    if (products.length > 0) {
      const hasRelatedProduct = products.some((product) =>
        alert.relatedProducts.some((relatedProduct) =>
          product.name.toLowerCase().includes(relatedProduct.toLowerCase())
        )
      );
      // If we have products but none match, still show industry alerts
      if (!hasRelatedProduct && alert.industry.includes(industry)) {
        return true;
      }
      return hasRelatedProduct;
    }

    return true;
  });

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Alert Center
        </CardTitle>
        <CardDescription>
          {filteredAlerts.length} {filteredAlerts.length === 1 ? "alert" : "alerts"} relevant to your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No active alerts for your industry and products</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const affectedProducts = products.filter((product) =>
              alert.relatedProducts.some((relatedProduct) =>
                product.name.toLowerCase().includes(relatedProduct.toLowerCase())
              )
            );

            return (
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
                      {affectedProducts.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs text-muted-foreground mb-1">Affected Products:</p>
                          <div className="flex flex-wrap gap-1">
                            {affectedProducts.map((product, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {product.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* Timestamp */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {alert.timestamp}
                        </div>

                        {/* View Impact Button */}
                        {affectedProducts.length > 0 && (
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            View Impact →
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default AlertCenter;
