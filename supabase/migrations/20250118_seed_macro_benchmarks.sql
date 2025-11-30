-- Seed Initial Macro Benchmarks
-- Populates macro_benchmarks table with global investment, tax, and financing benchmarks
-- Based on current calculator defaults and market data

-- First, deactivate any existing active records that will be replaced
UPDATE macro_benchmarks
SET is_active = false, updated_at = NOW()
WHERE is_active = true
  AND metric IN (
    SELECT metric::macro_metric FROM (VALUES
      ('asx_total_return'::macro_metric),
      ('term_deposit_rate'::macro_metric),
      ('bond_rate'::macro_metric),
      ('savings_rate'::macro_metric),
      ('cgt_withholding'::macro_metric),
      ('default_marginal_tax_rate'::macro_metric),
      ('default_interest_rate'::macro_metric),
      ('inflation_rate'::macro_metric)
    ) AS v(metric)
  );

-- Now insert all the new records
INSERT INTO macro_benchmarks (
  category, metric, value_numeric, unit, data_source, refresh_cadence, last_updated, notes, is_active
) VALUES
  -- Investment Benchmarks
  ('investment', 'asx_total_return', 7.20, 'percent', 'ASX / Historical Data (2024-2025)', 'quarterly', CURRENT_DATE, 'ASX All Ordinaries total return (including dividends) - long-term average', true),
  ('investment', 'term_deposit_rate', 4.00, 'percent', 'RBA / Major Banks Average (2024-2025)', 'monthly', CURRENT_DATE, 'Term deposit rate for 12-month term', true),
  ('investment', 'bond_rate', 4.50, 'percent', 'RBA / Australian Government Bonds (2024-2025)', 'monthly', CURRENT_DATE, '10-year Australian Government Bond yield', true),
  ('investment', 'savings_rate', 4.50, 'percent', 'RBA / Major Banks Average (2024-2025)', 'monthly', CURRENT_DATE, 'High-interest savings account rate', true),

  -- Tax Benchmarks
  ('tax', 'cgt_withholding', 12.50, 'percent', 'ATO Regulations (2024-2025)', 'annually', CURRENT_DATE, 'Capital Gains Tax withholding rate for foreign residents', true),
  ('tax', 'default_marginal_tax_rate', 37.00, 'percent', 'ATO Tax Rates (2024-2025)', 'annually', CURRENT_DATE, 'Default marginal tax rate for foreign residents (no tax-free threshold)', true),

  -- Financing Benchmarks
  ('financing', 'default_interest_rate', 6.50, 'percent', 'RBA / Major Banks Average (2024-2025)', 'monthly', CURRENT_DATE, 'Default interest rate for investment property loans', true),
  ('financing', 'inflation_rate', 3.00, 'percent', 'ABS / RBA (2024-2025)', 'quarterly', CURRENT_DATE, 'Consumer Price Index (CPI) inflation rate target', true);

