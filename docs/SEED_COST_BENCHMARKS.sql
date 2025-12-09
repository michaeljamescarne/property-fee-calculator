-- ============================================
-- INSERT COST BENCHMARKS - Production Ready
-- Run this in your PRODUCTION Supabase SQL Editor
-- ============================================
-- Data collected: January 2025
-- Property Type: Established properties
-- ============================================

-- Step 1: Deactivate any existing active records for established properties
UPDATE cost_benchmarks 
SET is_active = false, updated_at = NOW()
WHERE is_active = true
  AND property_type = 'established';

-- Step 2: Insert new benchmark values for established properties

INSERT INTO cost_benchmarks (
    state,
    property_type,
    metric,
    value_numeric,
    unit,
    data_source,
    last_updated,
    notes,
    is_active
) VALUES
    -- NSW
    ('NSW', 'established', 'council_rate_percent', 0.35, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'Council rates as % of property value', true),
    ('NSW', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('NSW', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('NSW', 'established', 'vacancy_rate_percent', 1.3, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Sydney Vacancy Rate - Oct 2025', true),
    ('NSW', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('NSW', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('NSW', 'established', 'rent_growth_percent', 4.8, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Sydney House Rent Annual Change - Oct 2025', true),
    ('NSW', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('NSW', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('NSW', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('NSW', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true),
    
    -- VIC
    ('VIC', 'established', 'council_rate_percent', 0.30, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'Slightly lower estimate than NSW/QLD based on general rates being capped', true),
    ('VIC', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('VIC', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('VIC', 'established', 'vacancy_rate_percent', 1.8, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Melbourne Vacancy Rate - Oct 2025', true),
    ('VIC', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('VIC', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('VIC', 'established', 'rent_growth_percent', 3.3, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Melbourne Combined Median Rent Annual Change - Oct 2025, used over 2.8% Victorian Index', true),
    ('VIC', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('VIC', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('VIC', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('VIC', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true),
    
    -- QLD
    ('QLD', 'established', 'council_rate_percent', 0.35, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'Consistent with NSW, using the guidance range of 0.3%-0.6%', true),
    ('QLD', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('QLD', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('QLD', 'established', 'vacancy_rate_percent', 1.0, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Brisbane Vacancy Rate - Oct 2025', true),
    ('QLD', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('QLD', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('QLD', 'established', 'rent_growth_percent', 5.5, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Capital City Average House Rent Annual Change - Oct 2025 data shows strong QLD regional growth, using the average as a balance', true),
    ('QLD', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('QLD', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('QLD', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('QLD', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true),
    
    -- SA
    ('SA', 'established', 'council_rate_percent', 0.25, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'Based on rate in the dollar * rateable value example, implying a low rate percentage. Adjusted lower than east coast', true),
    ('SA', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('SA', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('SA', 'established', 'vacancy_rate_percent', 0.8, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Adelaide Vacancy Rate - Oct 2025', true),
    ('SA', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('SA', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('SA', 'established', 'rent_growth_percent', 3.9, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Adelaide House Rent Annual Change - Oct 2025', true),
    ('SA', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('SA', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('SA', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('SA', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true),
    
    -- WA
    ('WA', 'established', 'council_rate_percent', 0.30, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'Used 0.3% as a balanced state average within the 0.3%-0.6% guidance', true),
    ('WA', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('WA', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('WA', 'established', 'vacancy_rate_percent', 0.7, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Perth Vacancy Rate - Oct 2025', true),
    ('WA', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('WA', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('WA', 'established', 'rent_growth_percent', 5.4, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Perth House Rent Annual Change - Oct 2025', true),
    ('WA', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('WA', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('WA', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('WA', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true),
    
    -- TAS
    ('TAS', 'established', 'council_rate_percent', 0.25, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'City of Hobart General Residential Rate of 0.2264 cents in the dollar of Capital Value plus other service charges totals roughly 0.25-0.3%', true),
    ('TAS', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('TAS', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('TAS', 'established', 'vacancy_rate_percent', 0.4, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Hobart Vacancy Rate - Oct 2025, extremely tight', true),
    ('TAS', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('TAS', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('TAS', 'established', 'rent_growth_percent', 6.0, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Hobart House Rent Annual Change - Oct 2025', true),
    ('TAS', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('TAS', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('TAS', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('TAS', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true),
    
    -- ACT
    ('ACT', 'established', 'council_rate_percent', 0.40, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'City of Ballarat, VIC Residential Rate of 0.29921 cents in the dollar of CIV is indicative. ACT is a high-cost area, so 0.40% is a reasonable upper-end estimate for council rates', true),
    ('ACT', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('ACT', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('ACT', 'established', 'vacancy_rate_percent', 1.6, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Canberra Vacancy Rate - Oct 2025', true),
    ('ACT', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('ACT', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('ACT', 'established', 'rent_growth_percent', 2.6, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Canberra House Rent Annual Change - Oct 2025', true),
    ('ACT', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('ACT', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('ACT', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('ACT', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true),
    
    -- NT
    ('NT', 'established', 'council_rate_percent', 0.25, 'percent_of_value', 'Local Council Data (Oct 2025)', CURRENT_DATE, 'Used 0.25% as a conservative estimate, lower end of the range, given the relatively lower property values than major east coast cities', true),
    ('NT', 'established', 'insurance_percent', 0.2, 'percent_of_value', 'Insurance Industry Average (2024-2025)', CURRENT_DATE, 'Building and contents insurance as % of property value', true),
    ('NT', 'established', 'maintenance_percent', 1.5, 'percent_of_value', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Annual maintenance as % of property value', true),
    ('NT', 'established', 'vacancy_rate_percent', 0.7, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Darwin Vacancy Rate - Oct 2025', true),
    ('NT', 'established', 'management_fee_percent', 8.0, 'percent', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Property management fee as % of rental income', true),
    ('NT', 'established', 'letting_fee_weeks', 2.0, 'weeks', 'Property Management Industry Average (2024-2025)', CURRENT_DATE, 'Letting fee in weeks of rent', true),
    ('NT', 'established', 'rent_growth_percent', 6.8, 'percent', 'CoreLogic / Domain (Oct 2025)', CURRENT_DATE, 'Darwin House Rent Annual Change - Oct 2025, high growth', true),
    ('NT', 'established', 'interest_rate_percent', 6.5, 'percent', 'RBA / Major Banks Average (2024-2025)', CURRENT_DATE, 'Standard variable mortgage interest rate', true),
    ('NT', 'established', 'selling_costs_percent', 4.0, 'percent', 'Real Estate Industry Average (2024-2025)', CURRENT_DATE, 'Selling costs as % of sale price (agent + legal)', true),
    ('NT', 'established', 'loan_cost_basis_points', 10.0, 'basis_points', 'Banking Industry Average (2024-2025)', CURRENT_DATE, 'Loan establishment costs in basis points', true),
    ('NT', 'established', 'strata_fee_percent', 0.0, 'percent', 'N/A', CURRENT_DATE, 'Not applicable for houses (0% for houses)', true);

-- Step 3: Verify the inserts

SELECT 
    state,
    property_type,
    metric,
    value_numeric,
    unit,
    data_source,
    last_updated,
    is_active
FROM cost_benchmarks
WHERE is_active = true
  AND property_type = 'established'
ORDER BY state, metric;

-- Expected output: 88 rows
-- - 8 states × 11 metrics = 88 records

