import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  hsCode: string;
  countryOfOrigin: string;
  costPerUnit: string;
  unitsPerMonth: string;
}

interface ProductListProps {
  products: Product[];
  businessLocation: string;
}

const ProductList = ({ products, businessLocation }: ProductListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate tariff risk (simplified logic)
  const calculateRisk = (product: Product) => {
    const cost = parseFloat(product.costPerUnit) || 0;
    const units = parseFloat(product.unitsPerMonth) || 0;
    const monthlyValue = cost * units;

    // Simple risk calculation based on value and origin
    if (product.countryOfOrigin.toLowerCase() === "china" && monthlyValue > 1000) {
      return "high";
    } else if (monthlyValue > 500) {
      return "medium";
    }
    return "low";
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-destructive";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-success";
      default:
        return "bg-muted";
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "high":
        return "High Risk";
      case "medium":
        return "Medium Risk";
      case "low":
        return "Low Risk";
      default:
        return "Unknown";
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const calculateLandedCost = (product: Product) => {
    const baseCost = parseFloat(product.costPerUnit) || 0;
    const tariffRate = 0.15; // Assume 15% average tariff
    return baseCost * (1 + tariffRate);
  };

  return (
    <Card className="shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Your Products
        </CardTitle>
        <CardDescription>
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} monitored
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>

        {/* Product List */}
        <div className="space-y-3">
          {paginatedProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No products found
            </p>
          ) : (
            paginatedProducts.map((product) => {
              const risk = calculateRisk(product);
              const isExpanded = expandedProduct === product.id;
              const landedCost = calculateLandedCost(product);

              return (
                <div
                  key={product.id}
                  className="border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors"
                >
                  {/* Product Header */}
                  <button
                    onClick={() => toggleExpand(product.id)}
                    className="w-full p-4 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(risk)}`} />
                      <div>
                        <h4 className="font-semibold text-foreground">{product.name}</h4>
                        <p className="text-xs text-muted-foreground">{getRiskLabel(risk)}</p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">HS Code:</span>
                          <p className="font-medium text-foreground">{product.hsCode || "N/A"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Country of Origin:</span>
                          <p className="font-medium text-foreground capitalize">
                            {product.countryOfOrigin}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Country of Import:</span>
                          <p className="font-medium text-foreground capitalize">
                            {businessLocation}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current Landed Cost:</span>
                          <p className="font-medium text-foreground">
                            ${landedCost.toFixed(2)}/unit
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Base Cost:</span>
                          <p className="font-medium text-foreground">
                            ${parseFloat(product.costPerUnit).toFixed(2)}/unit
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly Volume:</span>
                          <p className="font-medium text-foreground">
                            {product.unitsPerMonth} units
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current Tariff Rate:</span>
                          <p className="font-medium text-foreground">~15%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly Cost:</span>
                          <p className="font-medium text-foreground">
                            ${(parseFloat(product.costPerUnit) * parseFloat(product.unitsPerMonth)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductList;
