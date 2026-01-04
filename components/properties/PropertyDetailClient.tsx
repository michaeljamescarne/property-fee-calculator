/**
 * Property Detail Client Component
 * Client-side property detail view with tabs for different sections
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Home,
  Building,
  Calendar,
  Percent,
  Edit,
} from "lucide-react";
import type { Property } from "@/types/database";
import { formatCurrency } from "@/lib/utils/format";

interface PropertyDetailClientProps {
  property: Property;
  locale: string;
}

export default function PropertyDetailClient({ property, locale }: PropertyDetailClientProps) {
  const t = useTranslations("Properties.detail");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Link href={`/${locale}/properties`}>
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("backToProperties")}
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">
            {property.property_name || property.property_address}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {property.property_address}, {property.property_state}
            </span>
          </div>
        </div>
        <Link href={`/${locale}/properties/${property.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            {t("edit")}
          </Button>
        </Link>
      </div>

      {/* Property Information Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="financial">{t("tabs.financial")}</TabsTrigger>
          <TabsTrigger value="transactions">{t("tabs.transactions")}</TabsTrigger>
          <TabsTrigger value="values">{t("tabs.values")}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("overview.title")}</CardTitle>
              <CardDescription>{t("overview.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("overview.propertyType")}</p>
                    <p className="font-medium capitalize">
                      {property.property_type?.replace(/([A-Z])/g, " $1").trim() || "—"}
                    </p>
                  </div>
                </div>

                {property.property_classification && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {t("overview.classification")}
                      </p>
                      <p className="font-medium capitalize">{property.property_classification}</p>
                    </div>
                  </div>
                )}

                {property.bedrooms !== null && (
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">{t("overview.bedrooms")}</p>
                      <p className="font-medium">
                        {property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Bedrooms`}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("overview.status")}</p>
                    <p className="font-medium capitalize">{property.status}</p>
                  </div>
                </div>
              </div>

              {property.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">{t("overview.notes")}</p>
                  <p className="text-sm">{property.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("financial.title")}</CardTitle>
              <CardDescription>{t("financial.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {t("financial.purchasePrice")}
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(property.purchase_price)}</p>
                </div>

                {property.current_value && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.currentValue")}
                    </p>
                    <p className="text-2xl font-bold">{formatCurrency(property.current_value)}</p>
                  </div>
                )}

                {property.purchase_costs && property.purchase_costs > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.purchaseCosts")}
                    </p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(property.purchase_costs)}
                    </p>
                  </div>
                )}

                {property.deposit_amount && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.depositAmount")}
                    </p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(property.deposit_amount)}
                    </p>
                  </div>
                )}

                {property.loan_amount && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.loanAmount")}
                    </p>
                    <p className="text-xl font-semibold">{formatCurrency(property.loan_amount)}</p>
                  </div>
                )}

                {property.current_loan_balance && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.currentLoanBalance")}
                    </p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(property.current_loan_balance)}
                    </p>
                  </div>
                )}

                {property.interest_rate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.interestRate")}
                    </p>
                    <p className="text-xl font-semibold">{property.interest_rate}%</p>
                  </div>
                )}

                {property.loan_term_years && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("financial.loanTerm")}</p>
                    <p className="text-xl font-semibold">{property.loan_term_years} years</p>
                  </div>
                )}

                {property.is_rental && property.weekly_rent && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.weeklyRent")}
                    </p>
                    <p className="text-xl font-semibold">{formatCurrency(property.weekly_rent)}</p>
                  </div>
                )}

                {property.is_rental && property.property_management_fee_percent && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("financial.managementFee")}
                    </p>
                    <p className="text-xl font-semibold">
                      {property.property_management_fee_percent}%
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>{t("transactions.title")}</CardTitle>
              <CardDescription>{t("transactions.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("transactions.comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Values Tab */}
        <TabsContent value="values">
          <Card>
            <CardHeader>
              <CardTitle>{t("values.title")}</CardTitle>
              <CardDescription>{t("values.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("values.comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
