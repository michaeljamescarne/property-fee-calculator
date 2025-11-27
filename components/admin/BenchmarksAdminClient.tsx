/**
 * Benchmarks Admin Client Component
 * Client-side CRUD interface for managing benchmarks
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Loader2, Upload } from 'lucide-react';
import type { AustralianState } from '@/lib/firb/constants';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface Benchmark {
  id: string;
  state: AustralianState;
  suburb_name: string | null;
  postcode: string | null;
  gross_rental_yield: number | null;
  net_rental_yield: number | null;
  capital_growth_5yr: number | null;
  capital_growth_10yr: number | null;
  data_source: string | null;
  data_quality_score: number | null;
  notes: string | null;
  is_active: boolean;
  last_updated: string;
  created_at: string;
}

interface BenchmarksAdminClientProps {
  locale: string;
}

export default function BenchmarksAdminClient({ locale }: BenchmarksAdminClientProps) {
  const t = useTranslations('Admin.benchmarks');
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingBenchmark, setEditingBenchmark] = useState<Benchmark | null>(null);
  const [deletingBenchmark, setDeletingBenchmark] = useState<Benchmark | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterState, setFilterState] = useState<string>('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: boolean;
    results?: {
      total: number;
      inserted: number;
      updated: number;
      errors: number;
      errorDetails?: Array<{ row: number; error: string }>;
    };
    invalidRows?: Array<{ row: number; errors: string[] }>;
    error?: string;
  } | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Benchmark>>({
    state: 'NSW' as AustralianState,
    suburb_name: null,
    postcode: null,
    gross_rental_yield: null,
    net_rental_yield: null,
    capital_growth_5yr: null,
    capital_growth_10yr: null,
    data_source: null,
    data_quality_score: null,
    notes: null,
    is_active: true,
  });

  // Fetch benchmarks
  const fetchBenchmarks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterState) params.append('state', filterState);
      if (activeOnly) params.append('activeOnly', 'true');

      const response = await fetch(`/api/admin/benchmarks?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBenchmarks(data.benchmarks || []);
      }
    } catch (error) {
      console.error('Failed to fetch benchmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle CSV import
  const handleImport = async () => {
    if (!importFile) return;

    setImporting(true);
    setImportResults(null);

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch('/api/admin/benchmarks/bulk', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setImportResults({
          success: true,
          results: data.results,
        });
        // Refresh benchmarks list
        await fetchBenchmarks();
        // Clear file
        setImportFile(null);
      } else {
        setImportResults({
          success: false,
          error: data.error,
          invalidRows: data.invalidRows,
        });
      }
    } catch (error) {
      setImportResults({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import CSV',
      });
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    fetchBenchmarks();
  }, [filterState, activeOnly]);

  // Open dialog for new/edit
  const openDialog = (benchmark?: Benchmark) => {
    if (benchmark) {
      setEditingBenchmark(benchmark);
      setFormData(benchmark);
    } else {
      setEditingBenchmark(null);
      setFormData({
        state: 'NSW' as AustralianState,
        suburb_name: null,
        postcode: null,
        gross_rental_yield: null,
        net_rental_yield: null,
        capital_growth_5yr: null,
        capital_growth_10yr: null,
        data_source: null,
        data_quality_score: null,
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
        ? `/api/admin/benchmarks/${editingBenchmark.id}`
        : '/api/admin/benchmarks';
      const method = editingBenchmark ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsDialogOpen(false);
        fetchBenchmarks();
        setEditingBenchmark(null);
      } else {
        alert(data.error || t('error'));
      }
    } catch (error) {
      console.error('Failed to save benchmark:', error);
      alert(t('error'));
    } finally {
      setSaving(false);
    }
  };

  // Delete benchmark
  const handleDelete = async () => {
    if (!deletingBenchmark) return;

    try {
      const response = await fetch(`/api/admin/benchmarks/${deletingBenchmark.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setIsDeleteDialogOpen(false);
        setDeletingBenchmark(null);
        fetchBenchmarks();
      } else {
        alert(data.error || 'Failed to delete benchmark');
      }
    } catch (error) {
      console.error('Failed to delete benchmark:', error);
      alert('Failed to delete benchmark');
    }
  };

  const states: AustralianState[] = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex items-center gap-2">
            <Label htmlFor="filter-state" className="whitespace-nowrap">
              {t('filterByState')}:
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
            <Checkbox
              id="active-only"
              checked={activeOnly}
              onCheckedChange={(checked) => setActiveOnly(checked === true)}
            />
            <Label htmlFor="active-only" className="cursor-pointer">
              {t('showActiveOnly')}
            </Label>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsImportDialogOpen(true)} 
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {t('importCSV') || 'Import CSV'}
          </Button>
          <Button onClick={() => openDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('addNew')}
          </Button>
        </div>
      </div>

      {/* Benchmarks Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : benchmarks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t('noData')}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('state')}</TableHead>
                <TableHead>{t('suburb')}</TableHead>
                <TableHead>{t('postcode')}</TableHead>
                <TableHead>{t('grossYield')}</TableHead>
                <TableHead>{t('capitalGrowth5yr')}</TableHead>
                <TableHead>{t('isActive')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {benchmarks.map((benchmark) => (
                <TableRow key={benchmark.id}>
                  <TableCell>{benchmark.state}</TableCell>
                  <TableCell>{benchmark.suburb_name || '-'}</TableCell>
                  <TableCell>{benchmark.postcode || '-'}</TableCell>
                  <TableCell>
                    {benchmark.gross_rental_yield
                      ? `${benchmark.gross_rental_yield.toFixed(2)}%`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {benchmark.capital_growth_5yr
                      ? `${benchmark.capital_growth_5yr.toFixed(2)}%`
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={benchmark.is_active ? 'default' : 'secondary'}>
                      {benchmark.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDialog(benchmark)}
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
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
              {editingBenchmark ? t('edit') : t('addNew')}
            </DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">{t('state')} *</Label>
                <select
                  id="state"
                  value={formData.state || 'NSW'}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value as AustralianState })
                  }
                  className="w-full px-3 py-2 border rounded-md mt-1"
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="postcode">{t('postcode')}</Label>
                <Input
                  id="postcode"
                  value={formData.postcode || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, postcode: e.target.value || null })
                  }
                  placeholder="e.g., 2000"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="suburb">{t('suburb')}</Label>
              <Input
                id="suburb"
                value={formData.suburb_name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, suburb_name: e.target.value || null })
                }
                placeholder="e.g., Sydney"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gross-yield">{t('grossYield')}</Label>
                <Input
                  id="gross-yield"
                  type="number"
                  step="0.01"
                  value={formData.gross_rental_yield || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gross_rental_yield: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="e.g., 4.50"
                />
              </div>

              <div>
                <Label htmlFor="net-yield">{t('netYield')}</Label>
                <Input
                  id="net-yield"
                  type="number"
                  step="0.01"
                  value={formData.net_rental_yield || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      net_rental_yield: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="e.g., 3.50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="growth-5yr">{t('capitalGrowth5yr')}</Label>
                <Input
                  id="growth-5yr"
                  type="number"
                  step="0.01"
                  value={formData.capital_growth_5yr || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capital_growth_5yr: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="e.g., 5.50"
                />
              </div>

              <div>
                <Label htmlFor="growth-10yr">{t('capitalGrowth10yr')}</Label>
                <Input
                  id="growth-10yr"
                  type="number"
                  step="0.01"
                  value={formData.capital_growth_10yr || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capital_growth_10yr: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder="e.g., 5.80"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="data-source">{t('dataSource')}</Label>
              <Input
                id="data-source"
                value={formData.data_source || ''}
                onChange={(e) =>
                  setFormData({ ...formData, data_source: e.target.value || null })
                }
                placeholder="e.g., CoreLogic 2024"
              />
            </div>

            <div>
              <Label htmlFor="quality-score">{t('qualityScore')}</Label>
              <Input
                id="quality-score"
                type="number"
                min="1"
                max="10"
                value={formData.data_quality_score || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data_quality_score: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                placeholder="1-10"
              />
            </div>

            <div>
              <Label htmlFor="notes">{t('notes')}</Label>
              <textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value || null })
                }
                className="w-full px-3 py-2 border rounded-md min-h-[80px]"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="is-active"
                checked={formData.is_active ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked === true })
                }
              />
              <Label htmlFor="is-active" className="cursor-pointer">
                {t('isActive')}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                t('save')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CSV Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('csvImport.title') || 'Import Benchmarks from CSV'}</DialogTitle>
            <DialogDescription>
              {t('csvImport.description') || 'Upload a CSV file to bulk import benchmark data. The CSV should have columns: state (required), suburb_name (optional), postcode (optional), gross_rental_yield, net_rental_yield, capital_growth_5yr, capital_growth_10yr, data_source, data_quality_score, notes, is_active, last_updated (optional, defaults to today).'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="csv-file">{t('csvImport.fileLabel') || 'CSV File'}</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
              {importFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {importFile.name} ({(importFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
              <div className="mt-2">
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => {
                    // Generate and download CSV template
                    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
                    const headers = [
                      'state',
                      'suburb_name',
                      'postcode',
                      'gross_rental_yield',
                      'net_rental_yield',
                      'capital_growth_5yr',
                      'capital_growth_10yr',
                      'data_source',
                      'data_quality_score',
                      'notes',
                      'is_active',
                      'last_updated'
                    ];
                    const exampleRow = [
                      'NSW',
                      'Sydney',
                      '2000',
                      '4.5',
                      '3.5',
                      '6.0',
                      '6.2',
                      'CoreLogic 2024',
                      '8',
                      'Sample data',
                      'true',
                      today
                    ];
                    const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'benchmarks_template.csv';
                    a.click();
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  {t('csvImport.downloadTemplate') || 'Download CSV Template'}
                </Button>
              </div>
            </div>

            {importResults && (
              <div className={`p-4 rounded-lg ${
                importResults.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {importResults.success && importResults.results ? (
                  <div>
                    <p className="font-semibold text-green-900 mb-2">
                      {t('csvImport.success') || 'Import Successful!'}
                    </p>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>
                        {t('csvImport.totalRows') || 'Total rows'}: {importResults.results.total}
                      </li>
                      <li>
                        {t('csvImport.inserted') || 'Inserted'}: {importResults.results.inserted}
                      </li>
                      <li>
                        {t('csvImport.updated') || 'Updated'}: {importResults.results.updated}
                      </li>
                      {importResults.results.errors > 0 && (
                        <li className="text-red-600">
                          {t('csvImport.errors') || 'Errors'}: {importResults.results.errors}
                        </li>
                      )}
                    </ul>
                    {importResults.results.errorDetails && importResults.results.errorDetails.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold text-red-600">
                          {t('csvImport.errorDetails') || 'Error Details'}:
                        </p>
                        <ul className="text-xs text-red-600 list-disc list-inside">
                          {importResults.results.errorDetails.map((err, idx) => (
                            <li key={idx}>
                              {t('csvImport.row') || 'Row'} {err.row}: {err.error}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-red-900 mb-2">
                      {t('csvImport.failed') || 'Import Failed'}
                    </p>
                    <p className="text-sm text-red-800">{importResults.error}</p>
                    {importResults.invalidRows && importResults.invalidRows.length > 0 && (
                      <div className="mt-2">
                        <p className="font-semibold text-red-600">
                          {t('csvImport.validationErrors') || 'Validation Errors'}:
                        </p>
                        <ul className="text-xs text-red-600 list-disc list-inside">
                          {importResults.invalidRows.map((row, idx) => (
                            <li key={idx}>
                              {t('csvImport.row') || 'Row'} {row.row}: {row.errors.join(', ')}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsImportDialogOpen(false);
                setImportFile(null);
                setImportResults(null);
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleImport}
              disabled={!importFile || importing}
              className="gap-2"
            >
              {importing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('csvImport.importing') || 'Importing...'}
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {t('csvImport.import') || 'Import'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

