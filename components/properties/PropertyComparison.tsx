/**
 * Property Comparison Component
 * Displays multiple properties side-by-side for comparison
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X, TrendingUp, Home, DollarSign, Percent } from "lucide-react";
import type { Property } from "@/types/database";
import { formatCurrency, formatPercent } from "@/lib/utils/format";

interface PropertyComparisonProps {
  propertyIds: string[];
  locale: string;
}

interface PropertyWithMetrics extends Property {
  metrics?: {
    rentalYield: { gross: number; net: number };
    cashFlow: { annual: number; monthly: number };
    roi: { total: number; annualized: number };
    capitalGrowth: { percentageGain: number; annualRate: number };
    equity: { current: number; gain: number };
  };
}

export default function PropertyComparison({ propertyIds, locale }: PropertyComparisonProps) {
  const [properties, setProperties] = useState<PropertyWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyIds]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const propertiesData = await Promise.all(
        propertyIds.map(async (id) => {
          const [propertyRes, metricsRes] = await Promise.all([
            fetch(`/api/properties/${id}`),
            fetch(`/api/properties/${id}/performance`),
          ]);

          if (!propertyRes.ok || !metricsRes.ok) {
            return null;
          }

          const propertyData = await propertyRes.json();
          const metricsData = await metricsRes.json();

          return {
            ...propertyData.property,
            metrics: metricsData.metrics,
          };
        })
      );

      setProperties(propertiesData.filter((p) => p !== null) as PropertyWithMetrics[]);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeProperty = (id: string) => {
    const newIds = propertyIds.filter((pid) => pid !== id);
    if (newIds.length === 0) {
      window.location.href = `/${locale}/properties`;
      return;
    }
    window.location.href = `/${locale}/properties/compare?ids=${newIds.join(",")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">No properties to compare</p>
        <Link href={`/${locale}/properties`}>
          <Button>Back to Properties</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Link href={`/${locale}/properties`}>
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Compare Properties</h1>
          <p className="text-muted-foreground">Compare multiple properties side-by-side</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${properties.length}, minmax(250px, 1fr))` }}>
            {/* Header Row */}
            <div className="font-semibold text-sm text-muted-foreground p-4 border-b">
              Metric
            </div>
            {properties.map((property) => (
              <div key={property.id} className="relative border-b">
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">
                        {property.property_name || property.property_address.split(",")[0]}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {property.property_address}, {property.property_state}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2 flex-shrink-0"
                      onClick={() => removeProperty(property.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Link href={`/${locale}/properties/${property.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Purchase Price */}
            <div className="p-4 border-b flex items-center font-medium">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              Purchase Price
            </div>
            {properties.map((property) => (
              <div key={property.id} className="p-4 border-b">
                {formatCurrency(property.purchase_price, locale)}
              </div>
            ))}

            {/* Current Value */}
            <div className="p-4 border-b flex items-center font-medium">
              <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
              Current Value
            </div>
            {properties.map((property) => (
              <div key={property.id} className="p-4 border-b">
                {property.current_value
                  ? formatCurrency(property.current_value, locale)
                  : "Not Set"}
              </div>
            ))}

            {/* Purchase Date */}
            <div className="p-4 border-b flex items-center font-medium">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              Purchase Date
            </div>
            {properties.map((property) => (
              <div key={property.id} className="p-4 border-b">
                {new Date(property.purchase_date).toLocaleDateString(locale)}
              </div>
            ))}

            {/* Property Type */}
            <div className="p-4 border-b font-medium">Property Type</div>
            {properties.map((property) => (
              <div key={property.id} className="p-4 border-b capitalize">
                {property.property_type?.replace(/([A-Z])/g, " $1").trim() || "—"}
              </div>
            ))}

            {/* Is Rental */}
            <div className="p-4 border-b font-medium">Is Rental</div>
            {properties.map((property) => (
              <div key={property.id} className="p-4 border-b">
                {property.is_rental ? "Yes" : "No"}
              </div>
            ))}

            {/* Weekly Rent */}
            {properties.some((p) => p.is_rental) && (
              <>
                <div className="p-4 border-b font-medium">Weekly Rent</div>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border-b">
                    {property.weekly_rent
                      ? formatCurrency(property.weekly_rent, locale)
                      : "—"}
                  </div>
                ))}
              </>
            )}

            {/* Gross Rental Yield */}
            {properties.some((p) => p.metrics?.rentalYield?.gross) && (
              <>
                <div className="p-4 border-b flex items-center font-medium">
                  <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                  Gross Rental Yield
                </div>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border-b">
                    {property.metrics?.rentalYield?.gross
                      ? formatPercent(property.metrics.rentalYield.gross, locale)
                      : "—"}
                  </div>
                ))}
              </>
            )}

            {/* Net Rental Yield */}
            {properties.some((p) => p.metrics?.rentalYield?.net) && (
              <>
                <div className="p-4 border-b flex items-center font-medium">
                  <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                  Net Rental Yield
                </div>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border-b">
                    {property.metrics?.rentalYield?.net
                      ? formatPercent(property.metrics.rentalYield.net, locale)
                      : "—"}
                  </div>
                ))}
              </>
            )}

            {/* Annual Cash Flow */}
            {properties.some((p) => p.metrics?.cashFlow) && (
              <>
                <div className="p-4 border-b flex items-center font-medium">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  Annual Cash Flow
                </div>
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className={`p-4 border-b ${
                      (property.metrics?.cashFlow?.annual || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {property.metrics?.cashFlow?.annual
                      ? `${property.metrics.cashFlow.annual >= 0 ? "+" : ""}${formatCurrency(
                          property.metrics.cashFlow.annual,
                          locale
                        )}`
                      : "—"}
                  </div>
                ))}
              </>
            )}

            {/* ROI */}
            {properties.some((p) => p.metrics?.roi?.total) && (
              <>
                <div className="p-4 border-b flex items-center font-medium">
                  <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  Total ROI
                </div>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border-b">
                    {property.metrics?.roi?.total
                      ? formatPercent(property.metrics.roi.total, locale)
                      : "—"}
                  </div>
                ))}
              </>
            )}

            {/* Capital Growth */}
            {properties.some((p) => p.metrics?.capitalGrowth?.percentageGain) && (
              <>
                <div className="p-4 border-b flex items-center font-medium">
                  <TrendingUp className="h-4 w-4 mr-2 text-muted-foreground" />
                  Capital Growth
                </div>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border-b text-green-600">
                    {property.metrics?.capitalGrowth?.percentageGain
                      ? `+${formatPercent(
                          property.metrics.capitalGrowth.percentageGain,
                          locale
                        )}`
                      : "—"}
                  </div>
                ))}
              </>
            )}

            {/* Current Equity */}
            {properties.some((p) => p.metrics?.equity?.current) && (
              <>
                <div className="p-4 border-b flex items-center font-medium">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                  Current Equity
                </div>
                {properties.map((property) => (
                  <div key={property.id} className="p-4 border-b">
                    {property.metrics?.equity?.current
                      ? formatCurrency(property.metrics.equity.current, locale)
                      : "—"}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

