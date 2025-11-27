# Phase 4: Benchmark Data System - Implementation Plan

## Overview

Phase 4 implements the benchmark data system that provides default/benchmark rental yields and capital growth rates per state/suburb for comparison with user-provided inputs.

**Goal**: Implement state/suburb benchmark data system (P1)

---

## Tasks Breakdown

### 1. Database & API (Priority: High)

#### 1.1 Verify Schema

- [ ] Check if `benchmark_data` table exists from Phase 2 migration
- [ ] Verify schema matches PRD requirements:
  - State-level benchmarks
  - Suburb-level benchmarks (optional)
  - Rental yield benchmarks
  - Capital growth benchmarks
  - Last updated timestamps
- [ ] Add any missing columns if needed

#### 1.2 API Endpoints

- [ ] Create `/api/benchmarks` endpoint
  - GET with query params: `state`, `suburb`, `postcode`
  - Returns benchmark data or null
  - Handles fallback logic
- [ ] Add error handling
- [ ] Add response validation

#### 1.3 Address Mapping

- [ ] Create utility function to extract suburb/state from address
- [ ] Handle various address formats
- [ ] Support postcode lookup

#### 1.4 Fallback Logic

- [ ] Implement fallback chain: suburb → state → national default
- [ ] Return appropriate benchmark level
- [ ] Log when fallback is used

---

### 2. Admin Interface (Priority: High)

#### 2.1 Admin Dashboard

- [ ] Create `/admin/benchmarks` route (protected)
- [ ] Add admin role check middleware
- [ ] Build admin dashboard layout
- [ ] Add navigation to admin section

#### 2.2 Benchmarks CRUD Interface

- [ ] Create list view (table) of all benchmarks
- [ ] Add filters (by state, type)
- [ ] Create form for adding/editing benchmarks
- [ ] Add delete functionality
- [ ] Add validation on form submission

#### 2.3 Bulk Import

- [ ] Create CSV import interface
- [ ] Parse CSV file
- [ ] Validate data format
- [ ] Batch insert/update
- [ ] Show import results/errors

#### 2.4 Data Validation

- [ ] Validate rental yield ranges (0-20%)
- [ ] Validate capital growth ranges (0-15%)
- [ ] Validate state codes
- [ ] Validate suburb names
- [ ] Prevent duplicate entries

#### 2.5 Version History (Optional)

- [ ] Track changes to benchmarks
- [ ] Display change history
- [ ] Show who made changes

---

### 3. Initial Data Population (Priority: Medium)

#### 3.1 Research & Collection

- [ ] Research state-level rental yields (8 states/territories)
- [ ] Research state-level capital growth rates
- [ ] Research top 50-100 suburb benchmarks (major cities)
- [ ] Document data sources
- [ ] Verify data accuracy

#### 3.2 Data Population

- [ ] Create seed script or SQL file
- [ ] Populate state-level benchmarks
- [ ] Populate suburb-level benchmarks (if available)
- [ ] Set last_updated timestamps
- [ ] Verify data in database

---

### 4. Calculator Integration (Priority: High)

#### 4.1 Step 3 Integration

- [ ] Fetch benchmarks when property details are entered
- [ ] Display benchmark suggestions in Financial Details step
- [ ] Show "Use Benchmark" buttons
- [ ] Auto-populate fields when benchmark is selected
- [ ] Show comparison (user input vs benchmark)

#### 4.2 Results Comparison

- [ ] Add benchmark comparison section to results
- [ ] Show how user's inputs compare to benchmarks
- [ ] Highlight significant differences
- [ ] Add visual indicators (above/below benchmark)

---

## Database Schema

### benchmark_data Table

```sql
CREATE TABLE IF NOT EXISTS benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state australian_state NOT NULL,
  suburb_name TEXT,
  postcode TEXT,

  -- Benchmark Values
  rental_yield_benchmark DECIMAL(5,2), -- e.g., 4.50 for 4.5%
  capital_growth_benchmark DECIMAL(5,2), -- e.g., 6.00 for 6%

  -- Metadata
  data_source TEXT,
  effective_date DATE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),

  -- Constraints
  CONSTRAINT unique_location UNIQUE(state, COALESCE(suburb_name, ''), COALESCE(postcode, ''))
);

-- Indexes
CREATE INDEX idx_benchmark_state ON benchmark_data(state);
CREATE INDEX idx_benchmark_suburb ON benchmark_data(suburb_name) WHERE suburb_name IS NOT NULL;
CREATE INDEX idx_benchmark_postcode ON benchmark_data(postcode) WHERE postcode IS NOT NULL;
```

---

## API Design

### GET /api/benchmarks

**Query Parameters:**

- `state` (required): Australian state code (NSW, VIC, etc.)
- `suburb` (optional): Suburb name
- `postcode` (optional): Postcode

**Response:**

```json
{
  "success": true,
  "benchmark": {
    "state": "NSW",
    "suburb": "Sydney",
    "rentalYield": 3.2,
    "capitalGrowth": 6.5,
    "level": "suburb" // or "state" or "national"
  }
}
```

**Fallback Logic:**

1. Try suburb + state match
2. Try postcode match
3. Try state-level match
4. Return national default (if configured)

---

## Implementation Order

1. **Week 1: Database & API**
   - Verify/update schema
   - Create API endpoints
   - Implement lookup logic
   - Test API

2. **Week 2: Admin Interface**
   - Build admin dashboard
   - Create CRUD interface
   - Add bulk import
   - Test admin workflows

3. **Week 2: Integration**
   - Integrate with calculator Step 3
   - Add results comparison
   - Test user flows

4. **Ongoing: Data Population**
   - Research benchmarks
   - Populate initial data
   - Verify accuracy

---

## Success Criteria

- [ ] API returns benchmarks for all states
- [ ] Fallback logic works correctly
- [ ] Admin can add/edit/delete benchmarks
- [ ] Admin can bulk import CSV
- [ ] Calculator shows benchmark suggestions
- [ ] Results show benchmark comparisons
- [ ] Initial data populated (at least state-level)

---

## Next Steps

1. Verify benchmark_data table exists
2. Create API endpoint
3. Build admin interface
4. Integrate with calculator
5. Populate initial data
