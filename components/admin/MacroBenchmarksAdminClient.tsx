/**
 * Macro Benchmarks Admin Client Component
 * Client-side CRUD interface for managing macro benchmarks
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

type MacroCategory = "investment" | "tax" | "financing";
type MacroMetric =
  | "asx_total_return"
  | "term_deposit_rate"
  | "bond_rate"
  | "savings_rate"
  | "cgt_withholding"
  | "default_marginal_tax_rate"
  | "default_interest_rate"
  | "inflation_rate";
type MacroUnit = "percent" | "percentage_points" | "basis_points";

interface MacroBenchmark {
  id: string;
  category: MacroCategory;
  metric: MacroMetric;
  value_numeric: number;
  unit: MacroUnit;
  data_source: string | null;
  refresh_cadence: string | null;
  last_updated: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

interface MacroBenchmarksAdminClientProps {
  locale: string;
}

const MACRO_CATEGORIES: { value: MacroCategory; label: string }[] = [
  { value: "investment", label: "Investment" },
  { value: "tax", label: "Tax" },
  { value: "financing", label: "Financing" },
];

const MACRO_METRICS: { value: MacroMetric; label: string; category: MacroCategory }[] = [
  { value: "asx_total_return", label: "ASX Total Return", category: "investment" },
  { value: "term_deposit_rate", label: "Term Deposit Rate", category: "investment" },
  { value: "bond_rate", label: "Bond Rate", category: "investment" },
  { value: "savings_rate", label: "Savings Rate", category: "investment" },
  { value: "cgt_withholding", label: "CGT Withholding", category: "tax" },
  { value: "default_marginal_tax_rate", label: "Default Marginal Tax Rate", category: "tax" },
  { value: "default_interest_rate", label: "Default Interest Rate", category: "financing" },
  { value: "inflation_rate", label: "Inflation Rate", category: "financing" },
];

const MACRO_UNITS: { value: MacroUnit; label: string }[] = [
  { value: "percent", label: "Percent (%)" },
  { value: "percentage_points", label: "Percentage Points" },
  { value: "basis_points", label: "Basis Points" },
];

const REFRESH_CADENCES = ["monthly", "quarterly", "annually", "as_needed"];

export default function MacroBenchmarksAdminClient({ locale }: MacroBenchmarksAdminClientProps) {
  const t = useTranslations("Admin.macroBenchmarks");
  const [benchmarks, setBenchmarks] = useState<MacroBenchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBenchmark, setEditingBenchmark] = useState<MacroBenchmark | null>(null);
  const [deletingBenchmark, setDeletingBenchmark] = useState<MacroBenchmark | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterMetric, setFilterMetric] = useState<string>("");
  const [activeOnly, setActiveOnly] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<MacroBenchmark>>({
    category: "investment",
    metric: "asx_total_return",
    value_numeric: 0,
    unit: "percent",
    data_source: null,
    refresh_cadence: null,
    notes: null,
    is_active: true,
  });

  // Fetch benchmarks
  const fetchBenchmarks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.append("category", filterCategory);
      if (filterMetric) params.append("metric", filterMetric);
      if (activeOnly) params.append("activeOnly", "true");

      const response = await fetch(`/api/admin/macro-benchmarks?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBenchmarks(data.benchmarks || []);
      } else {
        console.error("Failed to fetch macro benchmarks:", data.error);
        if (data.message?.includes("migrations")) {
          alert(`Error: ${data.error}\n\n${data.message}`);
        }
      }
    } catch (error) {
      console.error("Failed to fetch macro benchmarks:", error);
      alert(
        "Failed to load macro benchmarks. Please check your connection and ensure database migrations have been run."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, [filterCategory, filterMetric, activeOnly]);

  // Get available metrics for selected category
  const availableMetrics = MACRO_METRICS.filter(
    (m) => !formData.category || m.category === formData.category
  );

  // Open dialog for new/edit
  const openDialog = (benchmark?: MacroBenchmark) => {
    if (benchmark) {
      setEditingBenchmark(benchmark);
      setFormData(benchmark);
    } else {
      setEditingBenchmark(null);
      setFormData({
        category: "investment",
        metric: "asx_total_return",
        value_numeric: 0,
        unit: "percent",
        data_source: null,
        refresh_cadence: null,
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
        ? `/api/admin/macro-benchmarks/${editingBenchmark.id}`
        : "/api/admin/macro-benchmarks";
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
        alert(data.error || "Failed to save macro benchmark");
      }
    } catch (error) {
      console.error("Failed to save macro benchmark:", error);
      alert("Failed to save macro benchmark");
    } finally {
      setSaving(false);
    }
  };

  // Delete benchmark
  const handleDelete = async () => {
    if (!deletingBenchmark) return;

    try {
      const response = await fetch(`/api/admin/macro-benchmarks/${deletingBenchmark.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setIsDeleteDialogOpen(false);
        setDeletingBenchmark(null);
        fetchBenchmarks();
      } else {
        alert(data.error || "Failed to delete macro benchmark");
      }
    } catch (error) {
      console.error("Failed to delete macro benchmark:", error);
      alert("Failed to delete macro benchmark");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 flex-wrap">
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-category" className="whitespace-nowrap">
              Category:
            </Label>
            <select
              id="filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {MACRO_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
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
              {MACRO_METRICS.map((metric) => (
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
        <div className="text-center py-12 text-gray-500">No macro benchmarks found</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Data Source</TableHead>
                <TableHead>Refresh Cadence</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.map((benchmark) => (
                <TableRow key={benchmark.id}>
                  <TableCell>
                    {MACRO_CATEGORIES.find((c) => c.value === benchmark.category)?.label ||
                      benchmark.category}
                  </TableCell>
                  <TableCell>
                    {MACRO_METRICS.find((m) => m.value === benchmark.metric)?.label ||
                      benchmark.metric}
                  </TableCell>
                  <TableCell>{benchmark.value_numeric}</TableCell>
                  <TableCell>{benchmark.unit}</TableCell>
                  <TableCell>{benchmark.data_source || "-"}</TableCell>
                  <TableCell>{benchmark.refresh_cadence || "-"}</TableCell>
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
              {editingBenchmark ? "Edit Macro Benchmark" : "Add Macro Benchmark"}
            </DialogTitle>
            <DialogDescription>
              {editingBenchmark
                ? "Update the macro benchmark details"
                : "Create a new global macro benchmark"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => {
                    const newCategory = e.target.value as MacroCategory;
                    setFormData({
                      ...formData,
                      category: newCategory,
                      // Reset metric if it doesn't belong to new category
                      metric:
                        MACRO_METRICS.find((m) => m.category === newCategory)?.value ||
                        formData.metric,
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {MACRO_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metric">Metric *</Label>
                <select
                  id="metric"
                  value={formData.metric}
                  onChange={(e) =>
                    setFormData({ ...formData, metric: e.target.value as MacroMetric })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {availableMetrics.map((metric) => (
                    <option key={metric.value} value={metric.value}>
                      {metric.label}
                    </option>
                  ))}
                </select>
              </div>
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
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as MacroUnit })}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {MACRO_UNITS.map((unit) => (
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
                placeholder="e.g., RBA, ABS"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refresh_cadence">Refresh Cadence</Label>
              <select
                id="refresh_cadence"
                value={formData.refresh_cadence || ""}
                onChange={(e) =>
                  setFormData({ ...formData, refresh_cadence: e.target.value || null })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Not specified</option>
                {REFRESH_CADENCES.map((cadence) => (
                  <option key={cadence} value={cadence}>
                    {cadence.charAt(0).toUpperCase() + cadence.slice(1)}
                  </option>
                ))}
              </select>
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
            <AlertDialogTitle>Delete Macro Benchmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this macro benchmark? This action cannot be undone.
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
