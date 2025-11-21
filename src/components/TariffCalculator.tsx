import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingDown, DollarSign } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  const [wholesaleCost, setWholesaleCost] = useState("");
  const [pricingMode, setPricingMode] = useState<"margin" | "retail">("margin");
  const [targetMargin, setTargetMargin] = useState("40");
  const [retailPrice, setRetailPrice] = useState("");
  const [tariffRate, setTariffRate] = useState("15");

  useEffect(() => {
    if (selectedProduct) {
      setWholesaleCost(selectedProduct.costPerUnit);
    }
  }, [selectedProduct]);

  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product || null);
  };

  const wholesale = parseFloat(wholesaleCost) || 0;
  const tariff = parseFloat(tariffRate) || 0;
  const landedCost = wholesale * (1 + tariff / 100);
  
  let currentRetailPrice = 0;
  let currentMargin = 0;
  let retailNeededForMargin = 0;
  let breakEvenPrice = 0;

  if (pricingMode === "margin") {
    const margin = parseFloat(targetMargin) || 0;
    retailNeededForMargin = landedCost / (1 - margin / 100);
    currentRetailPrice = retailNeededForMargin;
    currentMargin = margin;
    breakEvenPrice = landedCost;
  } else {
    currentRetailPrice = parseFloat(retailPrice) || 0;
    if (currentRetailPrice > 0) {
      currentMargin = ((currentRetailPrice - landedCost) / currentRetailPrice) * 100;
      retailNeededForMargin = currentRetailPrice;
      breakEvenPrice = landedCost;
    }
  }

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Profit Margin Calculator
        </CardTitle>
        <CardDescription>
          Calculate how tariffs affect your margins and pricing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Selection */}
        {products.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="calc-product">Select a Product</Label>
            <Select onValueChange={handleProductSelect}>
              <SelectTrigger id="calc-product">
                <SelectValue placeholder="Choose a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} {product.hsCode && `(HS ${product.hsCode})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Inputs Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wholesale-cost">Wholesale Cost ($)</Label>
            <Input
              id="wholesale-cost"
              type="number"
              step="0.01"
              placeholder="e.g., 10.00"
              value={wholesaleCost}
              onChange={(e) => setWholesaleCost(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tariff-rate">Tariff Rate (%)</Label>
            <Input
              id="tariff-rate"
              type="number"
              step="0.1"
              placeholder="e.g., 15"
              value={tariffRate}
              onChange={(e) => setTariffRate(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing Mode Selection */}
        <div className="space-y-3">
          <Label>Pricing Strategy</Label>
          <RadioGroup value={pricingMode} onValueChange={(value) => setPricingMode(value as "margin" | "retail")}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="margin" id="margin-mode" />
              <Label htmlFor="margin-mode" className="font-normal cursor-pointer">
                Set Target Profit Margin (%)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="retail" id="retail-mode" />
              <Label htmlFor="retail-mode" className="font-normal cursor-pointer">
                Set Retail Price ($)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {pricingMode === "margin" ? (
          <div className="space-y-2">
            <Label htmlFor="target-margin">Target Profit Margin (%)</Label>
            <Input
              id="target-margin"
              type="number"
              step="0.1"
              placeholder="e.g., 40"
              value={targetMargin}
              onChange={(e) => setTargetMargin(e.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="retail-price">Retail Price ($)</Label>
            <Input
              id="retail-price"
              type="number"
              step="0.01"
              placeholder="e.g., 25.00"
              value={retailPrice}
              onChange={(e) => setRetailPrice(e.target.value)}
            />
          </div>
        )}

        {/* Results Section */}
        <div className="border-t border-border pt-4 space-y-4">
          <h4 className="font-semibold text-foreground">Calculation Results</h4>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Total Landed Cost (with tariff)</span>
              <span className="font-bold text-foreground">${landedCost.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <span className="text-sm text-foreground">Current Profit Margin</span>
              <span className="font-bold text-primary">{currentMargin.toFixed(1)}%</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {pricingMode === "margin" ? "Required Retail Price" : "Your Retail Price"}
              </span>
              <span className="font-bold text-foreground">${currentRetailPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
              <span className="text-sm text-warning-foreground flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                Break-Even Price
              </span>
              <span className="font-bold text-warning">${breakEvenPrice.toFixed(2)}</span>
            </div>
          </div>

          {selectedProduct && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2">
                <DollarSign className="w-4 h-4 text-primary mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Monthly Impact</p>
                  <p>
                    Based on {selectedProduct.unitsPerMonth} units/month: 
                    <span className="font-semibold text-foreground ml-1">
                      ${((landedCost - wholesale) * parseFloat(selectedProduct.unitsPerMonth)).toFixed(2)}
                    </span>
                    {" "}additional cost from tariff
                  </p>
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
