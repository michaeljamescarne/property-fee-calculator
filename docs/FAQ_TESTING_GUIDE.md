# FAQ Testing Guide

## 🧪 Local Testing Instructions

### Start Local Server

```bash
cd /Users/michaelcarne/Sites/aupropertyinvestment/property-fee-calculator
npm run dev
```

Then visit: **http://localhost:3000/en/faq**

---

## ✅ Test Checklist

### Visual & Layout
- [ ] Page loads without errors
- [ ] Beige background displays correctly
- [ ] Hero section with gradient heading
- [ ] Search bar is prominent and styled correctly
- [ ] Popular questions grid (3 columns on desktop)
- [ ] Category navigation is visible
- [ ] FAQ accordions styled correctly
- [ ] CTA section at bottom with gradient

### Functionality

#### Search
- [ ] Type "FIRB" - see relevant results
- [ ] Type "student visa" - see related questions
- [ ] Type "stamp duty" - see cost-related FAQs
- [ ] Type "xyz123" - see "No results found" message
- [ ] Clear search button works
- [ ] Search is debounced (no lag when typing fast)

#### Navigation
- [ ] Click category pill - scrolls to category
- [ ] Sticky navigation appears when scrolling down
- [ ] Active category highlights
- [ ] All 6 categories visible

#### Accordions
- [ ] Click question - expands smoothly
- [ ] Click again - collapses smoothly
- [ ] Only one question open at a time (per category)
- [ ] Smooth chevron rotation
- [ ] Hover effects on questions

#### Links & Integration
- [ ] "Calculate Now" buttons work → goes to /firb-calculator
- [ ] Official source links open in new tabs
- [ ] Related questions show (when available)
- [ ] Popular question cards link correctly
- [ ] Bottom CTA links to calculator

#### URL Navigation
- [ ] Visit: http://localhost:3000/en/faq#faq-1
- [ ] Page loads and scrolls to question faq-1
- [ ] Question auto-expands (or can be clicked to expand)

### Mobile Responsive

#### iPhone Size (375px)
- [ ] Search bar is full width
- [ ] Popular questions stack vertically (1 column)
- [ ] Category navigation scrolls horizontally
- [ ] Accordions are readable
- [ ] Touch targets are large enough
- [ ] CTA button is accessible

#### Tablet Size (768px)
- [ ] Popular questions show 2 columns
- [ ] Category navigation visible
- [ ] Layout looks balanced

### Multi-Language

#### English
- [ ] Visit: http://localhost:3000/en/faq
- [ ] All text in English
- [ ] Navigation shows "FAQ"
- [ ] Questions load correctly

#### Chinese
- [ ] Visit: http://localhost:3000/zh/faq
- [ ] Page structure identical
- [ ] Navigation shows "常见问题"
- [ ] (Note: Full content translation in Phase 2)

### Performance
- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] No console warnings (except existing ones)
- [ ] Smooth scrolling
- [ ] No layout shift
- [ ] Search responds quickly

---

## 🔍 SEO Testing

### View Page Source
1. Right-click → "View Page Source"
2. Search for: `"@type": "FAQPage"`
3. Verify: You should see 3 JSON-LD scripts:
   - FAQPage with all questions
   - BreadcrumbList
   - WebPage with keywords

### Rich Results Test
1. Copy production URL: https://aupropertyinvestmentmc.vercel.app/en/faq
2. Visit: https://search.google.com/test/rich-results
3. Paste URL
4. Check for valid FAQPage markup
5. Verify no errors

### Schema Validator
1. Visit: https://validator.schema.org/
2. Paste production URL or HTML
3. Verify FAQPage validates
4. Check for warnings

---

## 🐛 Common Issues & Solutions

### Issue: FAQ page shows blank/white
**Solution**: Check browser console for errors, verify JSON data loaded

### Issue: Search doesn't work
**Solution**: Check that faq-data.json exists and is valid JSON

### Issue: Accordions don't expand
**Solution**: Check console for errors, verify state management

### Issue: Popular questions don't show
**Solution**: Verify questions have `popular: true` in data

### Issue: Schema.org scripts missing
**Solution**: Check page source, verify injectStructuredData function works

### Issue: Mobile category nav not scrolling
**Solution**: Check `overflow-x-auto` class is applied

---

## 📊 Content Verification

### Check These Questions Load
- faq-1: What is FIRB and why do I need approval?
- faq-22: What property can I buy on a temporary resident visa?
- faq-36: What is the current FIRB application fee?
- faq-41: What is the stamp duty surcharge and how much is it?
- faq-56: What are the penalties for non-compliance?

### Verify Data Accuracy
- [ ] FIRB fees match current 2025 schedule
- [ ] Stamp duty surcharges correct by state
- [ ] Land tax surcharges accurate
- [ ] Processing times reflect current standards
- [ ] Links to official sources work

---

## 🎯 User Flow Testing

### Scenario 1: Student Visa Holder
1. Visit FAQ page
2. Search: "student visa"
3. Find relevant questions
4. Click "Calculate Now"
5. Redirected to calculator
6. **Expected**: Smooth flow, relevant information

### Scenario 2: Cost Comparison
1. Visit FAQ page
2. Click "Costs & Fees" category
3. Read stamp duty surcharge Q&A
4. Read land tax surcharge Q&A
5. Click "Calculate Now"
6. **Expected**: Clear cost understanding

### Scenario 3: Mobile User
1. Visit on mobile device
2. Scroll through popular questions
3. Tap a question to expand
4. Read answer
5. Tap "Calculate Now"
6. **Expected**: Easy navigation, readable text

---

## 📱 Device Testing Matrix

| Device | Screen Size | Status |
|--------|-------------|--------|
| iPhone SE | 375px | ⏳ Test |
| iPhone 12 Pro | 390px | ⏳ Test |
| iPhone 14 Pro Max | 430px | ⏳ Test |
| iPad Mini | 768px | ⏳ Test |
| iPad Pro | 1024px | ⏳ Test |
| Desktop Small | 1280px | ⏳ Test |
| Desktop Large | 1920px | ⏳ Test |

---

## 🔗 Links to Test

### Local
- Homepage: http://localhost:3000/en
- FAQ: http://localhost:3000/en/faq
- FAQ Chinese: http://localhost:3000/zh/faq
- FAQ with hash: http://localhost:3000/en/faq#faq-1
- Calculator: http://localhost:3000/en/firb-calculator

### Production (After Merge)
- FAQ: https://aupropertyinvestmentmc.vercel.app/en/faq
- FAQ Chinese: https://aupropertyinvestmentmc.vercel.app/zh/faq

---

## ✅ Sign-Off Checklist

Before approving this PR, confirm:

- [ ] All tests passed
- [ ] Mobile responsive on real device
- [ ] Search functionality works
- [ ] Calculator links work
- [ ] No console errors
- [ ] Design matches Slite theme
- [ ] Content is accurate
- [ ] Links to official sources work
- [ ] Multi-language navigation works
- [ ] Build successful

---

## 🎉 Ready to Test!

Follow the checklist above and report any issues found. The FAQ system is designed to be comprehensive, user-friendly, and SEO-optimized.

**Happy Testing!** 🚀


