import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator } from "lucide-react";

const TariffCalculator = () => {
  const [productValue, setProductValue] = useState(4.00);
  const [currentTariff, setCurrentTariff] = useState(10);
  const [newTariff, setNewTariff] = useState(25);

  const currentCost = productValue * (currentTariff / 100);
  const newCost = productValue * (newTariff / 100);
  const costIncrease = newCost - currentCost;
  const percentIncrease = ((costIncrease / currentCost) * 100).toFixed(1);

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          Tariff Impact Calculator
        </CardTitle>
        <CardDescription>Ceramic Mugs (HS 6912.00) - See how tariff changes affect your costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="productValue">Wholesale Cost Per Mug ($)</Label>
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
              <span className="font-medium text-foreground">Cost Increase:</span>
              <div className="text-right">
                <div className="font-bold text-lg text-warning">${costIncrease.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">+{percentIncrease}%</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TariffCalculator;
