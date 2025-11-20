import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

interface Product {
  id: string;
  name: string;
  hsCode: string;
  countryOfOrigin: string;
  costPerUnit: string;
  unitsPerMonth: string;
}

interface TariffCalculatorProps {
  products?: Product[];
}

const TariffCalculator = ({ products = [] }: TariffCalculatorProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productValue, setProductValue] = useState(4.00);
  const [currentTariff, setCurrentTariff] = useState(10);
  const [newTariff, setNewTariff] = useState(25);

  // Load selected product data
  useEffect(() => {
    if (selectedProduct) {
      setProductValue(parseFloat(selectedProduct.costPerUnit) || 0);
    }
  }, [selectedProduct]);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  const currentCost = productValue * (currentTariff / 100);
  const newCost = productValue * (newTariff / 100);
  const costIncrease = newCost - currentCost;
  const percentIncrease = currentCost > 0 ? ((costIncrease / currentCost) * 100).toFixed(1) : "0.0";

  const monthlyUnits = selectedProduct ? parseFloat(selectedProduct.unitsPerMonth) : 0;
  const monthlyImpact = costIncrease * monthlyUnits;

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Tariff Impact Calculator
        </CardTitle>
        <CardDescription>Calculate how tariff changes affect your product costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Selection */}
        {products.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="product-select">Select a Product</Label>
            <Select onValueChange={handleProductSelect}>
              <SelectTrigger id="product-select">
                <SelectValue placeholder="Choose a product or enter manually below" />
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
                Origin: {selectedProduct.countryOfOrigin} • {selectedProduct.unitsPerMonth} units/month
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="productValue">Wholesale Cost Per Unit ($)</Label>
          <Input
            id="productValue"
            type="number"
            value={productValue}
            onChange={(e) => setProductValue(Number(e.target.value))}
            min={0}
            step="0.01"
          />
          <p className="text-xs text-muted-foreground">Base wholesale cost from supplier (before tariffs)</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Current Tariff Rate: {currentTariff}%</Label>
            <Slider
              value={[currentTariff]}
              onValueChange={(value) => setCurrentTariff(value[0])}
              max={50}
              step={0.5}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>New Tariff Rate: {newTariff}%</Label>
            <Slider
              value={[newTariff]}
              onValueChange={(value) => setNewTariff(value[0])}
              max={50}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Tariff Cost:</span>
            <span className="font-semibold text-foreground">${currentCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">New Tariff Cost:</span>
            <span className="font-semibold text-foreground">${newCost.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Per Unit Increase:</span>
              <div className="text-right">
                <div className="font-bold text-lg text-warning">${costIncrease.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">+{percentIncrease}%</div>
              </div>
            </div>
          </div>
          {selectedProduct && monthlyUnits > 0 && (
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Monthly Impact:</span>
                <div className="text-right">
                  <div className="font-bold text-lg text-destructive">${monthlyImpact.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{monthlyUnits} units/month</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TariffCalculator;
