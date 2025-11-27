# Chinese Translation Plan

**Date**: October 14, 2025  
**Status**: In Progress  
**Estimated Time**: 6-8 hours total

---

## ✅ Completed Translations

### 1. Auth Section ✅

- Login modal (email, code verification)
- Auth provider messages
- Success/error states
- **Lines**: 29 keys
- **Status**: Complete and deployed

### 2. Nav Section ✅

- Navigation menu items
- **Lines**: 3 keys
- **Status**: Complete and deployed

### 3. FIRB Calculator ✅

- All calculator steps
- Form labels and validation
- Results display
- Investment analytics labels
- **Lines**: ~600 keys
- **Status**: Complete (already done in previous work)

---

## ⏳ Remaining Translations

### 1. FAQ Content 🔴 **LARGE TASK**

**Scope**:

- 990 lines in `lib/faq/faq-data.json`
- 85+ questions with detailed answers
- 8 categories
- Official source links
- Related questions

**Approach Options**:

#### **Option A: Full Manual Translation** (6-8 hours)

- Translate all 85+ questions and answers
- Maintain technical accuracy
- Preserve official terminology
- Ensure cultural appropriateness

#### **Option B: AI-Assisted Translation** (2-3 hours)

- Use AI to translate in batches
- Manual review and correction
- Verify technical terms
- Adjust for context

#### **Option C: Phased Approach** (Recommended)

1. **Phase 1**: Translate popular questions only (6 questions, ~30 min)
2. **Phase 2**: Translate category names and descriptions (~15 min)
3. **Phase 3**: Translate remaining questions in batches (4-5 hours)
4. **Phase 4**: Review and refine all translations (1 hour)

#### **Option D: Keep English for Now**

- FAQ remains English-only
- Add "English only" notice for Chinese users
- Defer translation to later phase
- Focus on calculator functionality (already translated)

---

## 📊 Translation Status Summary

| Section              | English | Chinese | Status      | Priority |
| -------------------- | ------- | ------- | ----------- | -------- |
| Auth                 | ✅      | ✅      | Complete    | High     |
| Nav                  | ✅      | ✅      | Complete    | High     |
| HomePage             | ✅      | ⏳      | Partial     | Medium   |
| Calculator           | ✅      | ✅      | Complete    | Critical |
| Investment Analytics | ✅      | ✅      | Complete    | High     |
| FAQ Content          | ✅      | ❌      | Not Started | Low      |
| Dashboard            | ✅      | ⏳      | Partial     | Medium   |
| Footer               | ✅      | ✅      | Complete    | Low      |

---

## 🎯 Recommended Approach

### **Immediate (Today)**

1. ✅ Auth translations - DONE
2. ✅ Nav translations - DONE
3. ⏳ Dashboard translations - Quick (15-20 min)
4. ⏳ HomePage translations - Quick (10-15 min)

### **Short-Term (This Week)**

5. ⏳ FAQ popular questions - Phase 1 (30 min)
6. ⏳ FAQ category names - Phase 2 (15 min)

### **Medium-Term (Next Week)**

7. ⏳ FAQ full content - Phase 3 (4-5 hours)
8. ⏳ Review and refine - Phase 4 (1 hour)

---

## 💡 FAQ Translation Strategy

Given the size of the FAQ content, I recommend:

### **Strategy 1: Localized FAQ Data File** (Recommended)

Create `lib/faq/faq-data-zh.json` with Chinese translations:

- Separate file for maintainability
- Easier to manage and update
- Clear separation of concerns
- Load based on locale

### **Strategy 2: Inline Translations**

Keep single file with both languages:

- More compact
- Harder to maintain
- Larger file size
- More complex structure

---

## 🚀 Next Steps

**What would you like to do?**

### **Option A: Quick Wins** (45 min)

- Dashboard translations
- HomePage translations
- FAQ popular questions
- Deploy and test

### **Option B: Full FAQ Translation** (6-8 hours)

- Create faq-data-zh.json
- Translate all 85+ questions
- Update FAQ loader to support locales
- Comprehensive testing

### **Option C: Defer FAQ** (Recommended)

- Complete dashboard & homepage (30 min)
- Test all existing features
- Add "English only" notice to FAQ
- Schedule FAQ translation for later

---

## 📋 Translation Quality Checklist

For any translations added:

- [ ] Technical terms accurate (FIRB, stamp duty, etc.)
- [ ] Currency formatting correct (¥ vs $)
- [ ] Date formatting localized
- [ ] Number formatting localized
- [ ] Cultural appropriateness
- [ ] Consistent terminology throughout
- [ ] No machine translation artifacts
- [ ] Proper Chinese punctuation (。，！？)
- [ ] Professional tone maintained

---

## 🎯 Current Priority

**Recommendation**: Complete **Option A (Quick Wins)** first

**Rationale**:

- Calculator already fully translated (most important)
- Auth now translated (users can login)
- Dashboard & Homepage are small, high-impact
- FAQ translation is large, lower priority
- Get 95% functionality with 20% effort

**After Quick Wins**:

- Test Chinese version thoroughly
- Deploy to production
- Gather user feedback
- Schedule FAQ translation based on demand

---

**What would you like to tackle next?**
