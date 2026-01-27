# Macro Benchmarks Research Guide

Step-by-step guide to find current values for all 8 macro benchmarks.

---

## 1. ASX Total Return (asx_total_return)

**What we need:** 5-year average total return (capital gains + dividends)

**Where to find it:**
- **ASX Website:** https://www.asx.com.au/
  - Go to Market Data → Market Statistics
  - Look for "Total Return Index" or "ASX 200 Total Return"
  - Calculate 5-year average annual return
  
- **Alternative:** Investment research sites
  - Vanguard, BlackRock, or major bank investment reports
  - Look for "Australian equities" 5-year average return

**Default:** 7.2%  
**Your value:** _____%

**Tips:**
- Total return includes both price appreciation and dividends
- Use 5-year average to smooth out volatility
- If hard to find, 7-8% is typical for Australian equities

---

## 2. Term Deposit Rate (term_deposit_rate)

**What we need:** Current 1-year term deposit interest rate

**Where to find it:**
- **RBA Website:** https://www.rba.gov.au/statistics/tables/
  - Look for "Deposit and Loan Rates"
  - Find "Term deposits - 1 year" rate
  
- **Alternative:** Bank comparison sites
  - Canstar: https://www.canstar.com.au/term-deposits/
  - Finder: https://www.finder.com.au/term-deposits
  - Look for average or "big 4 bank" rates

**Default:** 4.0%  
**Your value:** _____%

**Tips:**
- Rates change frequently with RBA cash rate
- Use average of major banks or RBA published rate
- 1-year is standard benchmark period

---

## 3. Bond Rate (bond_rate)

**What we need:** Current 10-year Australian Government Bond yield

**Where to find it:**
- **RBA Website:** https://www.rba.gov.au/statistics/tables/
  - Look for "Interest Rates - Government Securities"
  - Find "10-year Australian Government Bond" yield
  
- **Alternative:** Financial news sites
  - Bloomberg, Reuters, AFR (Australian Financial Review)
  - Search "Australian 10-year bond yield"

**Default:** 4.5%  
**Your value:** _____%

**Tips:**
- This is the yield (interest rate), not the price
- Updates daily with bond market
- Usually close to RBA cash rate + term premium

---

## 4. Savings Rate (savings_rate)

**What we need:** High interest savings account rate

**Where to find it:**
- **RBA Website:** https://www.rba.gov.au/statistics/tables/
  - Look for "Deposit and Loan Rates"
  - Find "Online savings accounts" or "At-call deposits"
  
- **Alternative:** Bank comparison sites
  - Canstar: https://www.canstar.com.au/savings-accounts/
  - Finder: https://www.finder.com.au/savings-accounts
  - Look for top-tier high interest savings rates

**Default:** 4.5%  
**Your value:** _____%

**Tips:**
- Rates vary significantly between banks
- Use average of top 4-5 high-interest accounts
- Or use RBA published average

---

## 5. CGT Withholding (cgt_withholding)

**What we need:** Non-resident capital gains tax withholding rate

**Where to find it:**
- **ATO Website:** https://www.ato.gov.au/
  - Search "CGT withholding" or "non-resident CGT"
  - Look for "Foreign residents capital gains withholding"
  
- **Direct link:** https://www.ato.gov.au/business/international-tax-for-business/foreign-residents-in-australia/capital-gains-tax/

**Default:** 12.5%  
**Your value:** _____% (likely still 12.5%)

**Tips:**
- This rate is usually fixed by legislation
- Check if there have been recent changes
- Only applies to non-residents selling property

---

## 6. Default Marginal Tax Rate (default_marginal_tax_rate)

**What we need:** Marginal tax rate for $120k-$180k income bracket

**Where to find it:**
- **ATO Website:** https://www.ato.gov.au/tax-rates-and-codes/
  - Look for "Individual tax rates"
  - Find bracket for $120,001 to $180,000
  
- **Current rates (2024-25):**
  - $120,001 - $180,000: 37c per $1 (37%)
  - Plus Medicare levy (usually 2%)

**Default:** 37.0%  
**Your value:** _____%

**Tips:**
- This is the marginal rate (not including Medicare)
- Use 37% for calculations (Medicare typically added separately)
- Check if using 2024-25 or 2025-26 rates

---

## 7. Default Interest Rate (default_interest_rate)

**What we need:** Current standard variable mortgage interest rate

**Where to find it:**
- **RBA Website:** https://www.rba.gov.au/statistics/tables/
  - Look for "Housing Loan Rates"
  - Find "Standard variable - owner occupier" or average
  
- **Alternative:** Bank websites
  - Big 4 banks (CBA, ANZ, Westpac, NAB) variable rates
  - Average them out

**Default:** 6.5%  
**Your value:** _____%

**Tips:**
- Standard variable is most common
- Rates = RBA cash rate (currently ~4.35%) + bank margin (~2-3%)
- Update monthly as rates change

---

## 8. Inflation Rate (inflation_rate)

**What we need:** Latest annual CPI inflation rate

**Where to find it:**
- **ABS Website:** https://www.abs.gov.au/
  - Search "Consumer Price Index" or "CPI"
  - Look for latest quarterly release
  - Find "Annual CPI increase"
  
- **Direct link:** https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation

**Default:** 3.0%  
**Your value:** _____%

**Tips:**
- Released quarterly (usually ~2 weeks after quarter end)
- Use "All Groups CPI" annual percentage change
- Check if it's the latest release

---

## Quick Research Checklist

Use this to track your progress:

- [ ] 1. ASX Total Return - Found: _____% (Source: _____________)
- [ ] 2. Term Deposit Rate - Found: _____% (Source: _____________)
- [ ] 3. Bond Rate - Found: _____% (Source: _____________)
- [ ] 4. Savings Rate - Found: _____% (Source: _____________)
- [ ] 5. CGT Withholding - Found: _____% (Source: _____________)
- [ ] 6. Default Marginal Tax Rate - Found: _____% (Source: _____________)
- [ ] 7. Default Interest Rate - Found: _____% (Source: _____________)
- [ ] 8. Inflation Rate - Found: _____% (Source: _____________)

---

## Research Tips

1. **Start with official sources:** RBA, ATO, ABS are most reliable
2. **Note the date:** Document when you collected each value
3. **Use averages when needed:** If rates vary, use average of major providers
4. **Check for recent changes:** Rates can change monthly/quarterly
5. **Document sources:** Note the exact page/URL where you found each value

---

## Estimated Research Time

- **Quick version (using defaults + spot checks):** 15-20 minutes
- **Thorough version (verifying all values):** 30-45 minutes

---

## Once You Have All Values

Come back with:
1. All 8 values filled in
2. Data sources documented
3. Collection date noted

Then I'll create the SQL INSERT statements for you!

---

## Quick Links Summary

- **RBA:** https://www.rba.gov.au/statistics/tables/
- **ABS:** https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation
- **ATO:** https://www.ato.gov.au/tax-rates-and-codes/
- **ASX:** https://www.asx.com.au/
- **Canstar:** https://www.canstar.com.au/

---

Good luck with your research! Let me know when you have all the values ready.












