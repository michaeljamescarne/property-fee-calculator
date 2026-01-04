# Pull Request: Login Restriction for Financial Analysis Sections

## Summary

This PR implements a login wall for premium financial analysis sections in the FIRB Calculator results page. Users must log in to view "Cash Flow Analysis", "10-Year Investment Projections", "Sensitivity Analysis", and "Tax Analysis" sections. When users complete the login flow from the results page, their calculation is automatically saved and the requested section is expanded.

## Features Implemented

### 1. Login Restriction for Premium Sections
- Restricted sections: Cash Flow Analysis, 10-Year Investment Projections, Sensitivity Analysis, Tax Analysis
- "Eligibility" and "Costs" sections remain freely accessible
- Clicking expand on restricted sections triggers "Login to View" modal

### 2. Enhanced Login Flow
- LoginModal now supports custom titles (e.g., "Login to View")
- LoginModal supports preventing redirect to dashboard (stays on results page)
- LoginModal supports async onSuccess callbacks

### 3. Auto-Save on Login
- When users log in from the results page, their calculation is automatically saved
- No manual "Save Calculation" button click required

### 4. Auto-Expand After Login
- After successful login, the requested section automatically expands
- User stays on the results page (no redirect to dashboard)

### 5. Hydration Mismatch Fix
- Fixed React hydration mismatch error in Navigation component
- DropdownMenu components now render client-side only to prevent ID mismatches

## Files Changed

### Core Feature Files
- `components/auth/LoginModal.tsx`
  - Added `title` prop for custom modal titles
  - Added `preventRedirect` prop to prevent dashboard redirect
  - Updated `onSuccess` to support async callbacks
  - Awaits async operations before any redirect

- `components/firb/ResultsPanel.tsx`
  - Added `pendingSectionId` state to track requested section
  - Added `restrictedSections` array for section IDs
  - Updated `toggleSection` to check authentication and show login modal
  - Created `saveCalculation` function to save calculations
  - Created `handleLoginSuccess` async function to save and expand section
  - Updated LoginModal usage with proper props

### Bug Fix
- `components/Navigation.tsx`
  - Added `isMounted` state for client-side rendering
  - Wrapped DropdownMenu components with mount check
  - Added disabled button placeholders for SSR
  - Fixed hydration mismatch error with Radix UI DropdownMenu

## User Experience Flow

### Before Login
1. User completes calculator wizard
2. Results page shows with "Eligibility" and "Costs" sections open
3. User clicks expand on restricted section (e.g., "Cash Flow Analysis")
4. "Login to View" modal appears

### After Login
1. User enters email and magic code
2. Calculation is automatically saved to their account
3. User stays on results page (no redirect)
4. Requested section automatically expands
5. User can now view all premium analysis sections

### Save Calculation Button
- Still works as before
- Redirects to dashboard after login (normal behavior)
- No changes to existing functionality

## Testing Checklist

- [x] Login restriction works for all 4 restricted sections
- [x] "Login to View" modal appears with correct title
- [x] Calculation is saved after login from results page
- [x] Requested section expands after login
- [x] User stays on results page (no redirect)
- [x] "Save Calculation" button still redirects to dashboard
- [x] Hydration mismatch error is resolved
- [x] DropdownMenu components work correctly after mount
- [x] No console errors

## Technical Notes

- Uses `useAuth` hook to check authentication status
- Async operations are properly awaited in LoginModal
- Client-side rendering prevents hydration mismatches
- Maintains backward compatibility with existing login flows

## Breaking Changes

None - all changes are backward compatible.









