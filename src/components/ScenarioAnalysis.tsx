import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  hsCode: string;
  countryOfOrigin: string;
  costPerUnit: string;
  unitsPerMonth: string;
}

interface ScenarioAnalysisProps {
  products?: Product[];
}

const ScenarioAnalysis = ({ products = [] }: ScenarioAnalysisProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  // Use selected product data or defaults
  const baseCost = selectedProduct ? parseFloat(selectedProduct.costPerUnit) : 4.0;
  const monthlyUnits = selectedProduct ? parseFloat(selectedProduct.unitsPerMonth) : 500;

  const scenarios = [
    {
      id: 1,
      name: "Current Situation",
      description: `Current tariff at 10% - Cost: $${(baseCost * 1.1).toFixed(2)}/unit`,
      impact: 0,
      details: `Ordering ${monthlyUnits} units/month = $${(baseCost * monthlyUnits).toFixed(2)} total cost`,
      icon: <Minus className="w-5 h-5" />,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 2,
      name: "New Tariff (Active)",
      description: `Tariff increased to 25% - Cost: $${(baseCost * 1.25).toFixed(2)}/unit`,
      impact: Math.round((baseCost * 0.15) * monthlyUnits),
      details: `${monthlyUnits} units/month × $${(baseCost * 0.15).toFixed(2)} increase = +$${((baseCost * 0.15) * monthlyUnits).toFixed(2)}/month`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: 3,
      name: "If Tariffs Expand",
      description: `35% tariff applied - Cost: $${(baseCost * 1.35).toFixed(2)}/unit`,
      impact: Math.round((baseCost * 0.25) * monthlyUnits),
      details: `Higher tariffs across categories = +$${((baseCost * 0.25) * monthlyUnits).toFixed(2)}/month total`,
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
        {/* Product Selection */}
        {products.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="scenario-product">Select a Product</Label>
            <Select onValueChange={handleProductSelect}>
              <SelectTrigger id="scenario-product">
                <SelectValue placeholder="Choose a product to analyze" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} {product.hsCode && `(HS ${product.hsCode})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProduct && (
              <p className="text-xs text-muted-foreground">
                Analyzing: {selectedProduct.name} • {selectedProduct.unitsPerMonth} units/month
              </p>
            )}
          </div>
        )}
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
