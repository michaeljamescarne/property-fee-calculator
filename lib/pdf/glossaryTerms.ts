/**
 * Glossary Terms for PDF Reports
 * Comprehensive definitions of technical terms and abbreviations
 */

export interface GlossaryTerm {
  fullName: string;
  definition: string;
}

export const GLOSSARY_TERMS: Record<string, GlossaryTerm> = {
  'FIRB': {
    fullName: 'Foreign Investment Review Board',
    definition: 'Australian government body that examines proposals by foreign persons to invest in Australia and makes recommendations to the Treasurer on those proposals. FIRB approval is required for most residential real estate purchases by foreign persons.'
  },
  'ATO': {
    fullName: 'Australian Taxation Office',
    definition: 'The principal revenue collection agency of the Australian government, responsible for administering the tax system including FIRB fees, land tax, and capital gains tax.'
  },
  'ROI': {
    fullName: 'Return on Investment',
    definition: 'A performance measure used to evaluate the efficiency or profitability of an investment, expressed as a percentage of the original investment amount.'
  },
  'LVR': {
    fullName: 'Loan-to-Value Ratio',
    definition: 'The ratio of a loan to the value of the asset purchased, expressed as a percentage. For example, with a 20% deposit, the LVR is 80%. Higher LVR means larger loan relative to property value and typically higher lending risk.'
  },
  'CGT': {
    fullName: 'Capital Gains Tax',
    definition: 'Tax on the profit from the sale of property or investment. In Australia, foreign residents pay CGT at 32.5% and are not eligible for the main residence exemption. A 12.5% withholding tax also applies to sales over $750,000.'
  },
  'GST': {
    fullName: 'Goods and Services Tax',
    definition: 'A 10% value-added tax applied to most goods and services in Australia. Residential property sales are generally GST-free, but new property developments may include GST.'
  },
  'Stamp Duty': {
    fullName: 'Transfer Duty / Stamp Duty',
    definition: 'A state government tax levied on property transactions, calculated as a percentage of the property value. Rates vary by state and increase progressively with property value. Also called "transfer duty" in some states.'
  },
  'Foreign Purchaser Surcharge': {
    fullName: 'Foreign Buyer Surcharge / Additional Duty',
    definition: 'An additional stamp duty imposed on foreign buyers in most Australian states, ranging from 7-8% of the property value. This is on top of the standard stamp duty payable by all purchasers.'
  },
  'Land Tax': {
    fullName: 'Annual Land Tax',
    definition: 'An annual state government tax on the unimproved value of land you own. Thresholds and rates vary by state. Principal place of residence is usually exempt for Australian residents.'
  },
  'Absentee Owner Surcharge': {
    fullName: 'Foreign Owner Land Tax Surcharge',
    definition: 'An additional land tax charged to absentee or foreign owners, typically 2-5% per annum on top of the standard land tax. Applies in most states to foreign property owners.'
  },
  'Vacancy Fee': {
    fullName: 'Foreign Owner Vacancy Fee',
    definition: 'An annual fee charged by the ATO to foreign owners if their residential property is vacant or not genuinely available for rent for more than 183 days in a year. Currently set at double the FIRB application fee paid.'
  },
  'Negative Gearing': {
    fullName: 'Negative Gearing Tax Strategy',
    definition: 'When rental income is less than property expenses (loan interest, maintenance, etc.), creating a tax-deductible loss. This loss can offset other taxable income, reducing overall tax liability.'
  },
  'Depreciation': {
    fullName: 'Property Depreciation Deduction',
    definition: 'Tax deductions for the decline in value of a property and its fixtures/fittings over time. Includes capital works deductions (building structure) and plant and equipment depreciation (appliances, carpets, etc.).'
  },
  'Gross Rental Yield': {
    fullName: 'Gross Rental Yield',
    definition: 'Annual rental income as a percentage of the property value, before expenses. Calculated as: (Annual Rent ÷ Property Value) × 100. Does not account for vacancy, management fees, or other costs.'
  },
  'Net Rental Yield': {
    fullName: 'Net Rental Yield',
    definition: 'Annual rental income after all expenses, as a percentage of the property value. Calculated as: (Annual Rent - All Expenses) ÷ Property Value × 100. Provides a more accurate picture of investment return.'
  },
  'Cash-on-Cash Return': {
    fullName: 'Cash-on-Cash Return',
    definition: 'Annual cash flow (after all expenses and loan repayments) as a percentage of the actual cash invested (deposit and upfront costs). Measures the return on your out-of-pocket investment.'
  },
  'Strata Fees': {
    fullName: 'Strata Levies / Body Corporate Fees',
    definition: 'Quarterly or annual fees paid by apartment or unit owners for maintenance of common property, building insurance, and administration. Also called "body corporate fees" or "owners corporation fees".'
  },
  'Council Rates': {
    fullName: 'Local Council Rates',
    definition: 'Annual charges levied by local councils for services such as waste collection, road maintenance, and local infrastructure. Based on the property value and location.'
  },
  'Settlement': {
    fullName: 'Property Settlement',
    definition: 'The final stage of a property purchase when legal ownership is transferred, the balance of the purchase price is paid, and keys are handed over. Typically occurs 30-90 days after contract signing.'
  },
  'Conveyancing': {
    fullName: 'Conveyancing Process',
    definition: 'The legal process of transferring property ownership from seller to buyer. Includes title searches, contract review, settlement coordination, and registration of the new title. Performed by a solicitor or licensed conveyancer.'
  },
  'New Dwelling': {
    fullName: 'New Residential Dwelling',
    definition: 'A property that has not been previously sold as a dwelling, or has been substantially renovated. Foreign persons can generally purchase new dwellings with FIRB approval, subject to standard fees.'
  },
  'Established Dwelling': {
    fullName: 'Established Residential Property',
    definition: 'Any dwelling that is not a new dwelling - typically existing houses, apartments, or townhouses that have been previously occupied. Foreign persons face restrictions and higher FIRB fees (triple the standard rate) for established properties.'
  },
  'Vacant Land': {
    fullName: 'Vacant Residential Land',
    definition: 'Land without an existing dwelling, approved for residential development. Foreign persons need FIRB approval to purchase vacant land, with conditions to commence construction within 24 months and complete within 4 years.'
  },
  'Temporary Resident': {
    fullName: 'Temporary Visa Holder',
    definition: 'A person who holds a temporary visa allowing them to reside in Australia for more than 12 months (e.g., 457, 482, student visa). Can purchase one established dwelling as principal residence with FIRB approval, must sell upon departure.'
  },
  'Ordinarily Resident': {
    fullName: 'Ordinarily Resident in Australia',
    definition: 'Generally means residing in Australia with intention to continue residing. Australian citizens and permanent residents are ordinarily resident. Temporary residents may be considered ordinarily resident for FIRB purposes if they meet residency requirements.'
  },
  'Equity': {
    fullName: 'Property Equity',
    definition: 'The portion of the property you own outright. Calculated as: Property Value - Loan Balance. Equity grows as you pay down the loan and as the property value increases through capital growth.'
  },
  'Capital Growth': {
    fullName: 'Capital Growth / Appreciation',
    definition: 'The increase in property value over time due to market conditions, location factors, improvements, and economic growth. Typically expressed as an annual percentage increase.'
  },
  'Cash Flow': {
    fullName: 'Investment Cash Flow',
    definition: 'The net amount of cash moving in and out of an investment. Positive cash flow means rental income exceeds all expenses and loan repayments. Negative cash flow means you must contribute additional funds each period.'
  }
};

// Export as array for easier iteration
export const GLOSSARY_TERMS_ARRAY = Object.entries(GLOSSARY_TERMS).map(([term, details]) => ({
  term,
  ...details
}));




