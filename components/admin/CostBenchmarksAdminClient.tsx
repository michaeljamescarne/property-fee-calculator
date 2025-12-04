/**
 * Cost Benchmarks Admin Client Component
 * Client-side CRUD interface for managing cost benchmarks
 */

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import type { AustralianState } from "@/lib/firb/constants";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

type CostMetric =
  | "council_rate_percent"
  | "insurance_percent"
  | "maintenance_percent"
  | "vacancy_rate_percent"
  | "management_fee_percent"
  | "letting_fee_weeks"
  | "rent_growth_percent"
  | "interest_rate_percent"
  | "selling_costs_percent"
  | "loan_cost_basis_points"
  | "strata_fee_percent";

type PropertyType = "newDwelling" | "established" | "vacantLand" | "commercial";
type CostUnit =
  | "percent"
  | "percent_of_value"
  | "weeks"
  | "currency"
  | "basis_points"
  | "percentage_points";

interface CostBenchmark {
  id: string;
  state: AustralianState;
  property_type: PropertyType;
  property_classification: "unit" | "house" | null;
  bedrooms: number | null;
  metric: CostMetric;
  value_numeric: number;
  unit: CostUnit;
  data_source: string | null;
  last_updated: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface CostBenchmarksAdminClientProps {
  locale: string;
}

const COST_METRICS: { value: CostMetric; label: string }[] = [
  { value: "council_rate_percent", label: "Council Rate %" },
  { value: "insurance_percent", label: "Insurance %" },
  { value: "maintenance_percent", label: "Maintenance %" },
  { value: "vacancy_rate_percent", label: "Vacancy Rate %" },
  { value: "management_fee_percent", label: "Management Fee %" },
  { value: "letting_fee_weeks", label: "Letting Fee (Weeks)" },
  { value: "rent_growth_percent", label: "Rent Growth %" },
  { value: "interest_rate_percent", label: "Interest Rate %" },
  { value: "selling_costs_percent", label: "Selling Costs %" },
  { value: "loan_cost_basis_points", label: "Loan Cost (bps)" },
  { value: "strata_fee_percent", label: "Strata Fee %" },
];

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "newDwelling", label: "New Dwelling" },
  { value: "established", label: "Established" },
  { value: "vacantLand", label: "Vacant Land" },
  { value: "commercial", label: "Commercial" },
];

const COST_UNITS: { value: CostUnit; label: string }[] = [
  { value: "percent", label: "Percent (%)" },
  { value: "percent_of_value", label: "Percent of Value" },
  { value: "weeks", label: "Weeks" },
  { value: "currency", label: "Currency (AUD)" },
  { value: "basis_points", label: "Basis Points" },
  { value: "percentage_points", label: "Percentage Points" },
];

export default function CostBenchmarksAdminClient({ locale }: CostBenchmarksAdminClientProps) {
  const t = useTranslations("Admin.costBenchmarks");
  const [benchmarks, setBenchmarks] = useState<CostBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBenchmark, setEditingBenchmark] = useState<CostBenchmark | null>(null);
  const [deletingBenchmark, setDeletingBenchmark] = useState<CostBenchmark | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterState, setFilterState] = useState<string>("");
  const [filterPropertyType, setFilterPropertyType] = useState<string>("");
  const [filterMetric, setFilterMetric] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<CostBenchmark>>({
    state: "NSW" as AustralianState,
    property_type: "newDwelling",
    property_classification: null,
    bedrooms: null,
    metric: "council_rate_percent",
    value_numeric: 0,
    unit: "percent",
    data_source: null,
    notes: null,
    is_active: true,
  });

  // Fetch benchmarks
  const fetchBenchmarks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterState) params.append("state", filterState);
      if (filterPropertyType) params.append("property_type", filterPropertyType);
      if (filterMetric) params.append("metric", filterMetric);
      if (activeOnly) params.append("activeOnly", "true");

      const response = await fetch(`/api/admin/cost-benchmarks?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBenchmarks(data.benchmarks || []);
      } else {
        console.error("Failed to fetch cost benchmarks:", data.error);
        if (data.message?.includes("migrations")) {
          alert(`Error: ${data.error}\n\n${data.message}`);
        }
      }
    } catch (error) {
      console.error("Failed to fetch cost benchmarks:", error);
      alert(
        "Failed to load cost benchmarks. Please check your connection and ensure database migrations have been run."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, [filterState, filterPropertyType, filterMetric, activeOnly]);

  // Open dialog for new/edit
  const openDialog = (benchmark?: CostBenchmark) => {
    if (benchmark) {
      setEditingBenchmark(benchmark);
      setFormData(benchmark);
    } else {
      setEditingBenchmark(null);
      setFormData({
        state: "NSW" as AustralianState,
        property_type: "newDwelling",
        property_classification: null,
        bedrooms: null,
        metric: "council_rate_percent",
        value_numeric: 0,
        unit: "percent",
        data_source: null,
        notes: null,
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  // Save benchmark
  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editingBenchmark
        ? `/api/admin/cost-benchmarks/${editingBenchmark.id}`
        : "/api/admin/cost-benchmarks";
      const method = editingBenchmark ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(false);
        fetchBenchmarks();
        setEditingBenchmark(null);
      } else {
        alert(data.error || "Failed to save cost benchmark");
      }
    } catch (error) {
      console.error("Failed to save cost benchmark:", error);
      alert("Failed to save cost benchmark");
    } finally {
      setSaving(false);
    }
  };

  // Delete benchmark
  const handleDelete = async () => {
    if (!deletingBenchmark) return;

    try {
      const response = await fetch(`/api/admin/cost-benchmarks/${deletingBenchmark.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setIsDeleteDialogOpen(false);
        setDeletingBenchmark(null);
        fetchBenchmarks();
      } else {
        alert(data.error || "Failed to delete cost benchmark");
      }
    } catch (error) {
      console.error("Failed to delete cost benchmark:", error);
      alert("Failed to delete cost benchmark");
    }
  };

  const states: AustralianState[] = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-state" className="whitespace-nowrap">
              State:
            </Label>
            <select
              id="filter-state"
              value={filterState}
              onChange={(e) => setFilterState(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-property-type" className="whitespace-nowrap">
              Property Type:
            </Label>
            <select
              id="filter-property-type"
              value={filterPropertyType}
              onChange={(e) => setFilterPropertyType(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Types</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-metric" className="whitespace-nowrap">
              Metric:
            </Label>
            <select
              id="filter-metric"
              value={filterMetric}
              onChange={(e) => setFilterMetric(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Metrics</option>
              {COST_METRICS.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="active-only"
              checked={activeOnly}
              onCheckedChange={(checked) => setActiveOnly(checked === true)}
            />
            <Label htmlFor="active-only" className="cursor-pointer">
              Active Only
            </Label>
          </div>
        </div>
        <Button onClick={() => openDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      {/* Benchmarks Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : benchmarks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No cost benchmarks found</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Property Type</TableHead>
                <TableHead>Classification</TableHead>
                <TableHead>Bedrooms</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Data Source</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.map((benchmark) => (
                <TableRow key={benchmark.id}>
                  <TableCell>{benchmark.state}</TableCell>
                  <TableCell>
                    {PROPERTY_TYPES.find((t) => t.value === benchmark.property_type)?.label ||
                      benchmark.property_type}
                  </TableCell>
                  <TableCell>
                    {benchmark.property_classification
                      ? benchmark.property_classification.charAt(0).toUpperCase() +
                        benchmark.property_classification.slice(1)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {benchmark.bedrooms !== null
                      ? benchmark.bedrooms === 0
                        ? "Studio"
                        : `${benchmark.bedrooms}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {COST_METRICS.find((m) => m.value === benchmark.metric)?.label ||
                      benchmark.metric}
                  </TableCell>
                  <TableCell>{benchmark.value_numeric}</TableCell>
                  <TableCell>{benchmark.unit}</TableCell>
                  <TableCell>{benchmark.data_source || "-"}</TableCell>
                  <TableCell>{new Date(benchmark.last_updated).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={benchmark.is_active ? "default" : "secondary"}>
                      {benchmark.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(benchmark)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setDeletingBenchmark(benchmark);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBenchmark ? "Edit Cost Benchmark" : "Add Cost Benchmark"}
            </DialogTitle>
            <DialogDescription>
              {editingBenchmark
                ? "Update the cost benchmark details"
                : "Create a new cost benchmark for a state and property type"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value as AustralianState })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="property_type">Property Type *</Label>
                <select
                  id="property_type"
                  value={formData.property_type}
                  onChange={(e) => {
                    const newType = e.target.value as PropertyType;
                    setFormData({
                      ...formData,
                      property_type: newType,
                      // Clear classification and bedrooms when property type changes away from established
                      property_classification: newType === "established" ? formData.property_classification : null,
                      bedrooms: newType === "established" ? formData.bedrooms : null,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Property Classification and Bedrooms (only for established properties) */}
            {formData.property_type === "established" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="property_classification">Property Classification</Label>
                  <select
                    id="property_classification"
                    value={formData.property_classification || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        property_classification: e.target.value === "" ? null : (e.target.value as "unit" | "house"),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">None (General)</option>
                    <option value="unit">Unit</option>
                    <option value="house">House</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <select
                    id="bedrooms"
                    value={formData.bedrooms !== null ? (formData.bedrooms === 0 ? "studio" : formData.bedrooms.toString()) : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bedrooms: e.target.value === "" ? null : e.target.value === "studio" ? 0 : Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">None (General)</option>
                    <option value="studio">Studio</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="metric">Metric *</Label>
              <select
                id="metric"
                value={formData.metric}
                onChange={(e) => setFormData({ ...formData, metric: e.target.value as CostMetric })}
                className="w-full px-3 py-2 border rounded-md"
              >
                {COST_METRICS.map((metric) => (
                  <option key={metric.value} value={metric.value}>
                    {metric.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value_numeric">Value *</Label>
                <Input
                  id="value_numeric"
                  type="number"
                  step="0.0001"
                  value={formData.value_numeric ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, value_numeric: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit *</Label>
                <select
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as CostUnit })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {COST_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_source">Data Source</Label>
              <Input
                id="data_source"
                value={formData.data_source || ""}
                onChange={(e) => setFormData({ ...formData, data_source: e.target.value || null })}
                placeholder="e.g., ABS, CoreLogic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value || null })}
                placeholder="Optional notes"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked === true })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cost Benchmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cost benchmark? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
