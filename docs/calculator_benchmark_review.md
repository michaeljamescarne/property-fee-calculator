# Calculator Benchmark & Calculation Review

_Author:_ GPT-5.1 Codex  
 _Date:_ November 28, 2025

This document tracks the verification work requested for the FIRB calculator. It is organized by the implementation tasks agreed in the execution plan and will be updated as each task is completed.

---

## 1. Benchmark Inventory (Task: `inventory-benchmarks`)

| Area                  | Details                                                                                                                                                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Primary storage       | Supabase table `benchmark_data` defined in [`supabase/migrations/20250117_phase4_benchmark_data.sql`](property-fee-calculator/supabase/migrations/20250117_phase4_benchmark_data.sql)                                                                                                                                                                              |
| Schema highlights     | Geographic identifiers (`state`, `suburb_name`, `postcode`), rental metrics (`gross_rental_yield`, `net_rental_yield`, `median_weekly_rent`), capital growth metrics (`capital_growth_5yr`, `capital_growth_10yr`, `median_property_value`), provenance (`data_source`, `data_quality_score`, `last_updated`, `notes`), status/versioning (`is_active`, `version`) |
| Access paths          | Public read endpoint [`app/api/benchmarks/route.ts`](property-fee-calculator/app/api/benchmarks/route.ts) with state/suburb/postcode filters; admin CRUD endpoints under [`app/api/admin/benchmarks/*`](property-fee-calculator/app/api/admin/benchmarks) gated by `requireAdmin`                                                                                  |
| Admin tooling         | UI at [`components/admin/BenchmarksAdminClient.tsx`](property-fee-calculator/components/admin/BenchmarksAdminClient.tsx) plus localized route [`app/[locale]/admin/benchmarks/page.tsx`](property-fee-calculator/app/%5Blocale%5D/admin/benchmarks/page.tsx) supporting filtering, CRUD, CSV import (`/api/admin/benchmarks/bulk`)                                 |
| Seed & refresh assets | SQL + CSV seeds in [`supabase/migrations/20250117_seed_benchmark_data.sql`](property-fee-calculator/supabase/migrations/20250117_seed_benchmark_data.sql) & `.csv`, setup guide [`docs/BENCHMARK_DATA_SETUP.md`](property-fee-calculator/docs/BENCHMARK_DATA_SETUP.md)                                                                                             |
| Data provenance       | Documented source: CoreLogic / Domain Research 2024-2025, last verified Jan 2025 (see seed + guide). Quarterly refresh recommended with CSV imports or manual edits.                                                                                                                                                                                               |
| Observations          | Current system only tracks rental yield & capital growth benchmarks. No dedicated storage yet for expense/cost benchmarks (to be addressed in later tasks). Need to confirm `last_updated` uses true data date vs. insertion timestamp—seed script sets `CURRENT_DATE`, so historical context may be lost when re-importing.                                       |

**Open questions / follow-ups**

1.  Confirm whether administrators need export tooling from the UI to review/update the table (CSV import exists, export not yet implemented).
2.  Validate Supabase RLS policies cover future service roles used by scheduled refresh jobs (current policies allow anon read + admin write only).

---

_Next section will cover Task 2 (`map-calculation-usage`) once completed._

---

## 2. Calculation Flow Mapping (Task: `map-calculation-usage`)

### Frontend data capture (wizard)

- `CitizenshipStep`, `PropertyDetailsStep`, `FinancialDetailsStep`, `ReviewStep` within [`app/[locale]/firb-calculator/page.tsx`](property-fee-calculator/app/%5Blocale%5D/firb-calculator/page.tsx) gather user inputs via controlled React state (`formData`, `investmentInputs`) and enforce validation through [`lib/validations/firb.ts`](property-fee-calculator/lib/validations/firb.ts).
- Benchmark lookups happen client-side once state + optional `propertyAddress` are set. The page parses suburb/postcode via `parseAddress` and calls [`/api/benchmarks`](property-fee-calculator/app/api/benchmarks/route.ts); results hydrate both the Financial step (for smart defaults) and the Results screen (benchmark comparison).
- Short-stay regulation lookups follow the same pattern against [`/api/short-stay-regulations`](property-fee-calculator/app/api/short-stay-regulations/route.ts) to feed the optimal-use-case module.

### Server-side calculation pipeline

1. User submits Review step ⇒ `handleCalculate` POSTs to [`/api/firb-calculate`](property-fee-calculator/app/api/firb-calculate/route.ts).
2. API validates payload with `firbCalculatorSchema`, then:
   - Runs `performFullEligibilityCheck` (`lib/firb/eligibility.ts`) leveraging constants such as `PROPERTY_ELIGIBILITY`, `TEMPORARY_BAN`, `FIRB_PROCESSING_TIMES`.
   - Builds `CalculationInput` and calls `calculateCompleteCostBreakdown` (`lib/firb/calculations.ts`). That function orchestrates:
     - Upfront fees: FIRB (using 2025/26 tiers in `calculateFIRBFee`), stamp duty per state, foreign surcharge, legal/inspection heuristics, loan costs.
     - Ongoing costs: land tax (`calculateLandTax`/`calculateAnnualLandTax`), council rates, insurance, maintenance, vacancy fee.
     - Output includes structured `breakdown` used throughout the UI/PDF/email.
3. Response returns `{ eligibility, costs }` to the client.

### Investment analytics + benchmarks

- When costs + property metadata exist, the client seeds `investmentInputs` via `generateDefaultInputs` (`lib/firb/investment-analytics.ts`), passing benchmark data when available. Defaults include state-specific gross yields, deposit-driven loan amounts, and 6% growth placeholder.
- `ResultsPanel` re-generates inputs if the wizard state is empty and memoizes a full `InvestmentAnalytics` object via `calculateInvestmentAnalytics`. This function chains:
  - Loan projections (`lib/firb/loan-calculator.ts`)
  - Cash flow + negative gearing & tax deduction estimates (`lib/firb/tax-calculator.ts`)
  - ROI projections, sensitivity analysis, comparisons vs ASX/term deposits/bonds, CGT, investment score, and narrative takeaways.
- `BenchmarkComparison`, `InvestmentSummary`, `CashFlowAnalysis`, `TaxAnalysis`, `SensitivityAnalysis`, `InvestmentScore`, `OptimalUseCaseSection`, and PDF/email modules all consume the same analytics object to keep calculations aligned across UI, exports, and emails.

### Persistence, sharing, and downstream usage

- `SaveCalculationButton` invokes [`/api/calculations/save`](property-fee-calculator/app/api/calculations/save/route.ts), which uses `prepareCalculationForStorage` (`lib/calculations/storage.ts`) to normalize data before inserting into Supabase `saved_calculations`. List/detail operations live in [`/api/calculations/list`](property-fee-calculator/app/api/calculations/list/route.ts) and [`/api/calculations/[id]`](property-fee-calculator/app/api/calculations/%5Bid%5D/route.ts) for dashboard consumption (`components/dashboard/*`).
- Emails (`/api/send-firb-results`) always regenerate default inputs + analytics server-side, create PDFs via `generateEnhancedPDF`, and attach them through Resend. This ensures the emailed artifact matches the on-screen computation.
- PDF downloads (`generateFIRBPDF` / `generateEnhancedPDF`) and printable reports (`components/firb/PrintableReport.tsx`) pull from the same `eligibility`, `costs`, and `investmentAnalytics` payloads, so discrepancies should only stem from formatting, not logic.

### Observations / risks

1. Dual benchmark fetches (Financial step + Results) duplicate logic; both should converge on a shared hook/service to avoid inconsistent params.
2. Benchmarks only influence rental yield/capital growth defaults; maintenance/insurance/management fees remain hard-coded heuristics, which ties into the upcoming cost-benchmark task.
3. No caching on `/api/firb-calculate`; repeated submissions for the same inputs recompute everything server-side. Consider memoization if performance becomes an issue.

---

## 3. Formula & Calculation Verification (Task: `validate-formulas`)

### Summary of reviewed modules

- `lib/firb/constants.ts`: fee tiers, surcharge rates, stamp duty thresholds, land tax heuristics.
- `lib/firb/calculations.ts`: FIRB/stamp duty/surcharge math, upfront & ongoing cost estimators.
- `lib/firb/investment-analytics.ts`: rental yield, loan modeling, ROI, tax, comparisons, sensitivity.
- `lib/firb/tax-calculator.ts`: deductions, CGT, tax benefit helpers.
- `components/firb/*`: Financial inputs UI, benchmark comparison, investment/tax displays.

### Key findings

1. **Stamp duty math ignores bracket lower bounds.** `calculateStampDuty` subtracts zero regardless of threshold, so bases are added then the full property value is multiplied by the marginal rate, overstating duty dramatically.

```191:215:property-fee-calculator/lib/firb/constants.ts
  const dutyAmount =
    threshold.base +
    (propertyValue - (threshold.max === Infinity ? 0 : 0)) * (threshold.rate / 100);
```

2. **ACT foreign surcharge is coded as 0%, contradicting other app messaging plus current ACT policy (~4%).**

```92:102:property-fee-calculator/lib/firb/constants.ts
export const FOREIGN_SURCHARGE_RATES: Record<AustralianState, number> = {
  ...
  ACT: 0.0,
  NT: 0.0,
};
```

`/app/api/context/route.ts` advertises a 4% ACT surcharge, so users get inconsistent cost outputs.

3. **Vacancy fee placeholder always returns 0** even for foreign buyers, so ongoing costs never include the doubled vacancy charge that Eligibility warns about.

```212:224:property-fee-calculator/lib/firb/calculations.ts
export function calculateVacancyFee(...) {
  if (citizenshipStatus !== "foreign") {
    return 0;
  }
  return 0; // Set to 0 by default as it's conditional on occupancy
}
```

4. **Land tax calculations use a single flat rate over threshold** (no progressive brackets, no surcharge stacking). This materially understates taxes for higher-value land and ignores NSW’s extra 4–5% foreign surcharge.

```267:283:property-fee-calculator/lib/firb/constants.ts
const taxableValue = landValue - taxConfig.threshold;
const rate = isForeignOwner && taxConfig.isForeignRate ? taxConfig.isForeignRate : taxConfig.rate;
return (taxableValue * rate) / 100;
```

5. **Net rental yield only deducts property management fees.** Insurance, maintenance, council rates, land tax, etc. are ignored in the “net” metric, overstating performance.

```113:118:property-fee-calculator/lib/firb/investment-analytics.ts
const netYield =
  ((effectiveRent - effectiveRent * (inputs.propertyManagementFee / 100)) /
    existingCosts.totalInvestmentCost) *
  100;
```

6. **Depreciation is always treated as a brand-new build.** The analytics call hardcodes `buildingAge = 0`, so established dwellings incorrectly get full building + plant depreciation.

```193:205:property-fee-calculator/lib/firb/investment-analytics.ts
const deductions = calculateTaxDeductions(
  firstYearInterest,
  ...,
  propertyValue,
  propertyType,
  0 // New property
);
```

7. **ROI denominator uses property price + costs instead of actual cash invested (deposit + costs),** and the same inflated number is reused for “total cash invested” elsewhere. This materially suppresses ROI/CoC metrics.

```315:335:property-fee-calculator/lib/firb/calculations.ts
const totalInvestmentCost = upfrontCosts.propertyPrice + upfrontCosts.total;
...
const totalCashInvested = existingCosts.totalInvestmentCost;
```

8. **Static benchmark map in analytics ignores live benchmark data.** The “Above state average” messaging relies on a hard-coded map, so even if admin updates the Supabase benchmarks the comparison text never reflects it.

```119:134:property-fee-calculator/lib/firb/investment-analytics.ts
const benchmarks: Record<AustralianState, number> = {
  NSW: 3.2,
  ...
};
const benchmark = benchmarks[state] || 4.0;
```

9. **Council rates input updates the wrong field.** In `FinancialDetailsStep`, the “Annual Council Rates” textbox writes to `annualMaintenanceCost`, so there is no way to override maintenance or council rates correctly.

```474:488:property-fee-calculator/components/firb/FinancialDetailsStep.tsx
value={councilRates}
onChange={(e) =>
  onInvestmentInputsChange({
    annualMaintenanceCost: Number(e.target.value) || 0,
  })
}
```

10. **No UI hooks for insurance/maintenance overrides despite type support.** Users cannot adjust those assumptions, so they silently inherit the estimator outputs (`estimateInsurance/estimateMaintenance`).

11. **Investment comparison benchmarks are static (ASX 7.2%, TD 4%, bonds 4.5%, savings 4.5%) baked into code.** There is no data store or admin surface to refresh these macro benchmarks, so changes in market rates require code edits.

```269:309:property-fee-calculator/lib/firb/investment-analytics.ts
const asxReturn = comparisonAmount * Math.pow(1.072, inputs.holdPeriod) - comparisonAmount;
const termDepositReturn = comparisonAmount * Math.pow(1.04, inputs.holdPeriod) - comparisonAmount;
...
```

12. **Loan cost estimator omits LMI and tiered lender fees.** As written, buyers with <20% deposits pay the same simple formula (application + valuation + 0.1%), understating true upfront cash requirements.

13. **Short-stay analysis never varies occupancy by location** because `getDefaultOccupancyRate` is not used; `calculateShortStay` always runs with the default 65% occupancy and 1.75× nightly rate heuristic.

### Recommendations

- Fix the mathematical bugs (stamp duty equation, council-rates input binding, benchmark use) and document the simplified assumptions (land tax, vacancy fee) if they remain approximations.
- Introduce data-driven tables for macro benchmarks (ASX, deposits, bonds) similar to `benchmark_data`, so admins can refresh rates without redeploying.
- Allow users to override maintenance, insurance, and council rates independently, and plumb those overrides through the analytics pipeline.
- Expand the cost model to calculate vacancy fees and progressive land tax where feasible, or surface explicit caveats in the UI/PDF explaining the simplifications.

---

## 4. Cost Benchmark Review & Storage Plan (Task: `verify-cost-benchmarks`)

### Current state (all hard-coded)

| Cost/Assumption                                      | Source Code                                                                                                                                                                             | Logic today                                                      | Data source / upkeep                                                         |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Council rates                                        | [`estimateCouncilRates`](property-fee-calculator/lib/firb/calculations.ts)                                                                                                              | Flat 0.3% of property value across all states                    | None; no admin override; UI “council rates” field actually edits maintenance |
| Insurance                                            | [`estimateInsurance`](property-fee-calculator/lib/firb/calculations.ts)                                                                                                                 | `$1,200 + 0.2%` capped at $3k, regardless of state/property type | None                                                                         |
| Maintenance                                          | [`estimateMaintenance`](property-fee-calculator/lib/firb/calculations.ts)                                                                                                               | 1% of value (new) or 1.5% (established), $500 for land           | None                                                                         |
| Loan costs                                           | [`estimateLoanCosts`](property-fee-calculator/lib/firb/calculations.ts)                                                                                                                 | $600 + $300 + 0.1% of loan amount; no LMI                        | None                                                                         |
| Vacancy fee                                          | [`calculateVacancyFee`](property-fee-calculator/lib/firb/calculations.ts)                                                                                                               | Always 0                                                         | None                                                                         |
| Property management fee                              | [`generateDefaultInputs`](property-fee-calculator/lib/firb/investment-analytics.ts)                                                                                                     | Defaults to 8%; slider range 5–12%                               | No table; user input only                                                    |
| Letting fee                                          | Same function                                                                                                                                                                           | Defaults to 2 weeks of rent                                      | No table                                                                     |
| Vacancy rate                                         | Same function                                                                                                                                                                           | Defaults to 5% everywhere                                        | No table                                                                     |
| Rent growth                                          | Same function                                                                                                                                                                           | Defaults to 3% p.a.                                              | No table                                                                     |
| Interest rate                                        | Same function                                                                                                                                                                           | Defaults to 6.5%                                                 | No table; not linked to RBA/RBA cash rate                                    |
| Hold period                                          | Same function                                                                                                                                                                           | Defaults to 10 years                                             | No table                                                                     |
| Selling costs                                        | Same function                                                                                                                                                                           | Fixed 4% (3% agent + 1% legal)                                   | No table                                                                     |
| CGT withholding                                      | Same function                                                                                                                                                                           | Fixed 12.5%                                                      | No table                                                                     |
| Marginal tax rate                                    | Same function                                                                                                                                                                           | Fixed 37% (foreign resident)                                     | No table                                                                     |
| Macro benchmarks (ASX, bonds, term deposit, savings) | [`calculateInvestmentAnalytics`](property-fee-calculator/lib/firb/investment-analytics.ts) & [`InvestmentComparison`](property-fee-calculator/components/firb/InvestmentComparison.tsx) | ASX 7.2%, bonds 4.5%, TD 4%, savings 4.5% baked into code        | No storage; requires redeploy to update                                      |
| Short-stay occupancy assumptions                     | [`calculateShortStay`](property-fee-calculator/lib/firb/optimal-use-case.ts)                                                                                                            | 65% occupancy, nightly rate = 1.75× weekly rent / 7              | `getDefaultOccupancyRate` exists but unused; no data per location            |

### Gaps

- No Supabase table tracks these cost benchmarks, so administrators cannot update inputs without code changes.
- There is no provenance (`data_source`, `last_updated`) for expenses, contrary to requirement that “all benchmarks should have an associated table…update regularly.”
- Even when user inputs exist, they do not map cleanly to analytics fields (e.g., council rate field writes to maintenance).

### Proposed storage design

1. **`cost_benchmarks` table** (state/property-type scoped)
   - Columns: `id`, `state` (`australian_state`), `property_type`, `metric` (enum: `council_rate_percent`, `insurance_percent`, `maintenance_percent`, `vacancy_rate_percent`, `management_fee_percent`, `letting_fee_weeks`, `rent_growth_percent`, `interest_rate_percent`, `selling_costs_percent`, `loan_cost_basis_points`, etc.), `value_numeric`, `unit` (`percent`, `percent_of_value`, `weeks`, `currency`, `bps`), `data_source`, `last_updated`, `notes`, `is_active`, `version`.
   - Unique key on (`state`, `property_type`, `metric`).
   - Seed initial data using current heuristics + documented sources (ABS, CoreLogic, major banks). Allow CSV import similar to `benchmark_data`.

2. **`macro_benchmarks` table** (global)
   - Columns: `category` (`investment`, `tax`, `financing`), `metric` (`asx_total_return`, `term_deposit_rate`, `bond_rate`, `savings_rate`, `cgt_withholding`, `default_marginal_tax_rate`), `value_numeric`, `unit`, `data_source`, `refresh_cadence`, `last_updated`.
   - Used for investment comparisons, marginal tax defaults, CGT withholding, default interest rates.

3. **Optional `vacancy_fees` table** if we need to model the ATO vacancy fee schedule (bracketed by property value and year). Even a simplified table with `value_range_low`, `value_range_high`, `fee_amount` and `data_source` would let us populate `calculateVacancyFee`.

### Update & integration plan

1. **Migrations**
   - Add SQL migrations (`supabase/migrations/20251201_create_cost_benchmarks.sql`, etc.) defining the tables, indexes, triggers, and read policies (public read, admin write).

2. **APIs**
   - Mirror the existing `/api/benchmarks` architecture:
     - Public GET endpoints (`/api/cost-benchmarks?state=NSW&metric=council_rate_percent`) returning the latest active entry per scope.
     - Admin CRUD endpoints under `/api/admin/cost-benchmarks` + `/api/admin/macro-benchmarks`, with CSV bulk import.

3. **UI**
   - Extend the admin client with tabs: “Market Benchmarks” (existing) and “Cost Benchmarks”.
   - Tables should display metric, state, property type, value, unit, last updated, data source.
   - Provide CSV template/download so admins can update multiple metrics quickly.

4. **Calculator consumption**
   - Replace heuristic calls with repository functions, e.g. `getCostBenchmark(state, propertyType, "council_rate_percent")`. Provide sensible fallbacks (e.g., national averages) if no row exists.
   - Share the same fetcher between server (`calculateCompleteCostBreakdown`) and client (`generateDefaultInputs`) so property management fees, vacancy rates, rent growth, etc. remain consistent.
   - Cache results per request to avoid multiple Supabase round-trips (e.g., load all metrics for a given state/property type in one query).

5. **Refresh SOP**
   - Define cadence per metric (quarterly for insurance/maintenance, monthly for mortgage & term deposit rates, annually for council rates).
   - Document trusted sources (ABS Rates for vacancy, RBA for term deposits, CoreLogic for maintenance/insurance proxies).
   - Assign responsible role (admin or analyst) and add reminder automation (e.g., Supabase scheduled function sending Slack/email when `last_updated` is older than cadence).

With these tables in place we satisfy the requirement that **every benchmark is table-backed with a repeatable update process**, and the calculator can surface `data_source` / `last_updated` consistently in the UI/PDF just like the rental yield benchmarks today.

---

## 5. Benchmark Refresh Method (Task: `benchmark-refresh-method`)

### Goals

1. Keep **rental/capital growth** benchmarks current by state/suburb (existing `benchmark_data` table).
2. Keep **cost benchmarks** (council rates, insurance, maintenance, vacancy, loan costs, management fees, rent growth, interest rates, selling costs, tax defaults) up to date via the new tables proposed above.
3. Keep **macro benchmarks** (ASX, bonds, deposits, savings, mortgage reference rates) synchronized with authoritative data.

### Recommended data sources & cadence

| Benchmark family                                | Suggested source(s)                                                                                | Cadence                                        | Notes                                                                                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Rental yield, capital growth, median rent/value | CoreLogic RP Data API, SQM Research, Domain Insights CSV exports                                   | Quarterly                                      | Continue using existing CSV import workflow; include `data_source` URLs + retrieval date |
| Council rates                                   | State revenue office schedules (NSW Revenue, VIC SRO, etc.), ABS 5506.0 (Government Finance Stats) | Annually or when states release new FY budgets | Store as percent of unimproved value, but allow city overrides if available              |
| Insurance                                       | Major insurers’ premium surveys (Canstar, Finder) + ABS CPI 6401.0 (Insurance sub-index)           | Semi-annual                                    | Store base amount + percentage of rebuild cost per state                                 |
| Maintenance                                     | CoreLogic Cordell cost guides, Archicentre maintenance reports                                     | Semi-annual                                    | Store as % of property value by property type & age bracket                              |
| Vacancy rate                                    | SQM Research, ABS 6202.0 (Labour Force—rental vacancy)                                             | Monthly                                        | Feeds both investment defaults and vacancy sensitivity scenarios                         |
| Rent growth                                     | CoreLogic hedonic home value index, ABS 6416.0 (Residential Property Price)                        | Monthly/Quarterly                              | Use rolling 12‑month trend per state                                                     |
| Property management fee & letting fee           | REIA national fee surveys                                                                          | Annually                                       | Store percent-of-rent and weeks-of-rent per state                                        |
| Mortgage/interest rate                          | RBA statistical tables (F6 Housing Lending Rates)                                                  | Monthly                                        | Feeds default interest rates + macro comparisons                                         |
| Term deposit / savings                          | RBA F4, APRA stats                                                                                 | Monthly                                        | populates macro benchmarks                                                               |
| Government bonds                                | AOFM yield curve                                                                                   | Monthly                                        | macro comparisons                                                                        |
| CGT withholding/marginal tax                    | ATO updates                                                                                        | Ad-hoc (on legislation change)                 | store in `macro_benchmarks`                                                              |
| Vacancy fee schedule                            | ATO Foreign Investment Review Board (FIRB) guidance                                                | Annually                                       | populate optional `vacancy_fees` table                                                   |

### Process & automation

1. **Data acquisition**
   - Create lightweight ingestion scripts in `/scripts/benchmarks/` (one per source) that fetch data (API/CSV), normalize to the schema, and emit CSV + JSON snapshots (include timestamp + source URL).
   - Schedule these scripts via GitHub Actions or a simple cron on the Vercel/Supabase backend. Alternatively, set calendar reminders if automation is not yet feasible.

2. **Staging & review**
   - Scripts should write to `/data/staging/{date}/` and open a Pull Request showing diffed CSVs for human review.
   - Analyst verifies figures, updates `data_source` + `last_updated`, then either:
     - Uses the admin UI CSV importer (`/admin/benchmarks` or future `/admin/cost-benchmarks`) or
     - Runs a Supabase SQL script (for large bulk updates).

3. **Publication**
   - Once uploaded, the admin UI should surface `last_updated` and `data_source` so auditors confirm freshness.
   - Trigger a revalidation of the Next.js ISR cache (benchmarks endpoint) to ensure calculators immediately pick up new numbers.

4. **Alerting**
   - Add Supabase cron function (or a simple scheduled edge function) that scans `benchmark_data`, `cost_benchmarks`, and `macro_benchmarks` for rows whose `last_updated` exceeds the cadence (e.g., >95 days for rental data, >35 days for rates). Send Slack/email reminders to the data owner.

5. **Versioning & rollback**
   - Keep historical rows by incrementing the `version` column and toggling `is_active`. Admin UI should allow reactivating older entries if new data proves faulty.
   - Store the raw CSV files (already available for rental data) in a dedicated S3/Supabase storage bucket for audit trail.

### Outcome

Implementing the above ensures every benchmark—market, cost, and macro—has:

- A Supabase table with provenance metadata.
- A repeatable ingestion script or documented manual import workflow.
- Monitoring so stale data is flagged before it impacts calculations.

This satisfies the requirement that administrators can “update all benchmarks regularly” without engineering involvement.

---

## 6. Consolidated Findings & Next Actions (Task: `documentation-pass`)

### Critical issues to fix

1. **Stamp duty calculation bug** – incorrect formula drastically inflates/deflates duties. Needs corrected bracket math + regression tests.
2. **Council rates input misbinding** – user edits maintenance instead of council rates.
3. **Depreciation + net yield logic** – assumes new build for all properties and ignores most expenses in net yield, misleading ROI output.
4. **Vacancy fee + land tax simplifications** – vacancy fee always zero; land tax ignores progressive tiers and foreign surcharges.
5. **ACT surcharge mismatch** – calculators output 0% while other parts of the app warn of 4%.

### Medium-priority actions

- Replace static benchmark map in analytics with live `benchmark_data` (and expose benchmark provenance in the UI/PDF).
- Add UI controls for insurance, maintenance, and council rates (properly mapped to `InvestmentInputs`).
- Implement the proposed `cost_benchmarks` + `macro_benchmarks` tables and hook estimator functions to them.
- Expand admin tooling (tabs + CSV import/export) for the new tables; add export option for existing `benchmark_data`.
- Build ingestion scripts + alerting per Section 5.
- Wire short-stay occupancy defaults to `getDefaultOccupancyRate` or a new data source.

### Suggested backlog tickets

| Priority | Ticket idea                                                                        |
| -------- | ---------------------------------------------------------------------------------- |
| P0       | Fix stamp duty formula & add unit tests per state                                  |
| P0       | Correct council rate input binding + add maintenance override UI                   |
| P1       | Introduce cost/macro benchmark tables + APIs + admin UI                            |
| P1       | Update analytics to consume live benchmarks (rental yields, costs, macro rates)    |
| P2       | Implement vacancy fee schedule + progressive land tax or surface caveats in UI/PDF |
| P2       | Hook ACT surcharge to correct rate and sync with `/api/context` output             |

Deliverable: this report (`docs/calculator_benchmark_review.md`) now documents inventory, data flow, formula review, cost benchmark plan, and refresh SOPs as requested.

---
