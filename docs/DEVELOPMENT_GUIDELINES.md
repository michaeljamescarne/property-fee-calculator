# Development Guidelines: Property Investment Analysis Platform

## Overview

This document outlines the development workflow, coding standards, testing requirements, and deployment processes for the Property Investment Analysis Platform. All development must follow these guidelines to ensure code quality, maintainability, and reliability.

---

## 1. Development Workflow

### 1.1 Feature Development Process

Every feature must follow this workflow:

```
1. Create Feature Branch
   ↓
2. Develop Feature
   ↓
3. Write Tests
   ↓
4. Run Tests Locally
   ↓
5. Create Pull Request
   ↓
6. Code Review
   ↓
7. Address Feedback
   ↓
8. Merge to Develop
   ↓
9. Staging Deployment & Testing
   ↓
10. Merge to Main
   ↓
11. Production Deployment
```

### 1.2 Branch Strategy

#### Branch Naming Convention
- **Feature branches**: `feature/feature-name` (e.g., `feature/lead-capture`)
- **Bug fixes**: `fix/bug-description` (e.g., `fix/email-validation`)
- **Hotfixes**: `hotfix/issue-description` (e.g., `hotfix/critical-calculation-error`)
- **Refactoring**: `refactor/component-name` (e.g., `refactor/calculator-wizard`)

#### Branch Structure
```
main (production)
  └── develop (integration)
      ├── feature/homepage
      ├── feature/lead-capture
      ├── feature/calculator-wizard
      └── fix/email-validation
```

#### Branch Rules
- **main**: Production-ready code only. Protected branch requiring approval.
- **develop**: Integration branch for all features. All PRs merge here first.
- **Feature branches**: Created from `develop`, merged back to `develop`.

### 1.3 Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

#### Examples
```bash
feat(calculator): add investment quality analysis section

Implements ROI calculations, cash flow projections, and sensitivity analysis
as specified in PRD Section 3.3.

Closes #123

fix(auth): correct email validation regex

The previous regex was incorrectly rejecting valid email addresses
with plus signs.

refactor(components): extract reusable form components

Creates shared Input, Select, and Textarea components to reduce code duplication.
```

#### Commit Guidelines
- Use present tense ("add" not "added")
- Use imperative mood ("move" not "moves")
- First line should be 50 characters or less
- Reference issue numbers when applicable
- Explain "why" in the body, not "what"

---

## 2. Coding Standards

### 2.1 TypeScript

#### Type Safety
- **Strict Mode**: Always enabled
- **No `any` types**: Use `unknown` or proper types
- **Explicit return types**: Required for functions
- **Interface over type**: Prefer interfaces for object shapes

```typescript
// ✅ Good
interface UserInput {
  email: string;
  name?: string;
}

function calculateROI(input: UserInput): number {
  // ...
}

// ❌ Bad
function calculateROI(input: any): any {
  // ...
}
```

#### Naming Conventions
- **Variables**: `camelCase`
- **Functions**: `camelCase`
- **Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Files**: `kebab-case` for components, `camelCase` for utilities

#### File Organization
```
components/
  calculator/
    PropertyInputStep.tsx
    PropertyInputStep.test.tsx
    PropertyInputStep.types.ts
lib/
  calculations/
    investment-analytics.ts
    investment-analytics.test.ts
```

### 2.2 React/Next.js

#### Component Structure
```typescript
// 1. Imports (external, then internal)
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 3. Component
export default function Component({ title, onSubmit }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState<string>('');
  const t = useTranslations('Component');
  
  // 5. Event Handlers
  const handleSubmit = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### Component Guidelines
- **Functional components only**: No class components
- **Hooks**: Use custom hooks for reusable logic
- **Props destructuring**: In function parameters
- **Memoization**: Use `useMemo` and `useCallback` when appropriate
- **Error boundaries**: Wrap major sections

#### Next.js App Router
- **Server Components**: Default, use Client Components only when needed
- **API Routes**: Type-safe with Zod validation
- **Metadata**: Proper SEO metadata for all pages
- **Loading states**: Implement loading.tsx and error.tsx

### 2.3 Styling

#### Tailwind CSS
- **Utility-first**: Use Tailwind utilities primarily
- **Custom classes**: Only for complex, reusable patterns
- **Responsive**: Mobile-first approach
- **Dark mode**: Support if specified in requirements

```tsx
// ✅ Good
<div className="flex flex-col gap-4 p-6 bg-white rounded-base shadow-base">
  <h2 className="text-2xl font-semibold text-gray-900">Title</h2>
</div>

// ❌ Bad
<div className="my-custom-card">
  <h2 className="my-custom-title">Title</h2>
</div>
```

#### Style Guide Compliance
- Follow `STYLE_GUIDE.md` for all styling
- Use design tokens (colors, spacing, typography)
- Maintain consistency with Attio-inspired design

### 2.4 Code Quality

#### ESLint Rules
- Extend Next.js recommended config
- Add TypeScript ESLint plugin
- Enforce React hooks rules
- Require consistent imports

#### Code Formatting
- **Prettier**: Auto-format on save
- **Line length**: 100 characters max
- **Trailing commas**: Yes
- **Semicolons**: Yes

#### Code Review Checklist
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] No console.logs or debug code
- [ ] Error handling is implemented
- [ ] Accessibility requirements met
- [ ] Responsive design tested
- [ ] Performance considerations addressed
- [ ] Security best practices followed

---

## 3. Testing Requirements

### 3.1 Testing Strategy

#### Test Pyramid
```
        /\
       /  \        E2E Tests (few)
      /    \
     /  __  \      Integration Tests (some)
    /  /    \ \
   /__/______\__\  Unit Tests (many)
```

### 3.2 Unit Tests

#### Requirements
- **Coverage**: Minimum 80% for calculation logic, 60% for UI components
- **Framework**: Vitest or Jest
- **Location**: `*.test.ts` or `*.test.tsx` files

#### What to Test
- **Calculation functions**: All edge cases
- **Utility functions**: Input/output validation
- **Custom hooks**: State changes and side effects
- **Pure functions**: Mathematical operations

```typescript
// Example: investment-analytics.test.ts
import { describe, it, expect } from 'vitest';
import { calculateROI } from './investment-analytics';

describe('calculateROI', () => {
  it('should calculate ROI correctly for positive cash flow', () => {
    const input = {
      initialInvestment: 100000,
      annualCashFlow: 5000,
      holdPeriod: 10,
    };
    
    const result = calculateROI(input);
    
    expect(result).toBeCloseTo(0.05, 2);
  });
  
  it('should handle zero cash flow', () => {
    const input = {
      initialInvestment: 100000,
      annualCashFlow: 0,
      holdPeriod: 10,
    };
    
    const result = calculateROI(input);
    
    expect(result).toBe(0);
  });
});
```

### 3.3 Integration Tests

#### Requirements
- **Framework**: Playwright or Cypress
- **Coverage**: Critical user flows
- **Location**: `tests/integration/`

#### What to Test
- **API endpoints**: Request/response validation
- **Database operations**: CRUD operations
- **Authentication flows**: Login, signup, password reset
- **Calculator workflow**: Complete calculation flow

```typescript
// Example: calculator-flow.test.ts
import { test, expect } from '@playwright/test';

test('complete calculator flow', async ({ page }) => {
  await page.goto('/calculator');
  
  // Step 1: Property Input
  await page.fill('[name="propertyPrice"]', '500000');
  await page.selectOption('[name="state"]', 'NSW');
  await page.click('button:has-text("Next")');
  
  // Step 2: User Profile
  await page.selectOption('[name="citizenship"]', 'australian');
  await page.click('button:has-text("Next")');
  
  // Step 3: Financial Details
  await page.fill('[name="weeklyRent"]', '500');
  await page.click('button:has-text("Calculate")');
  
  // Verify results
  await expect(page.locator('[data-testid="results-section"]')).toBeVisible();
  await expect(page.locator('[data-testid="roi-metric"]')).toContainText('5.2%');
});
```

### 3.4 E2E Tests

#### Requirements
- **Framework**: Playwright
- **Coverage**: Key user journeys
- **Location**: `tests/e2e/`

#### What to Test
- **Complete user flows**: Homepage → Calculator → Results → PDF
- **Multi-language**: Switching between English and Chinese
- **Error scenarios**: Invalid inputs, API failures
- **Accessibility**: Keyboard navigation, screen readers

### 3.5 Testing Checklist

Before creating a PR, ensure:
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Error scenarios handled
- [ ] Performance tested (if applicable)
- [ ] Accessibility tested

---

## 4. Pull Request Process

### 4.1 PR Creation

#### PR Title
Follow conventional commits format:
```
feat(calculator): add investment quality analysis
fix(auth): correct email validation
refactor(components): extract reusable form components
```

#### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation
- [ ] Performance improvement

## Related Issues
Closes #123
Relates to #456

## Changes Made
- Added investment quality analysis section
- Implemented ROI calculations
- Added sensitivity analysis

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Tested on mobile devices
- [ ] Tested in Chrome, Firefox, Safari

## Screenshots (if applicable)
[Add screenshots or GIFs]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No console.logs or debug code
- [ ] Error handling implemented
- [ ] Accessibility requirements met
```

### 4.2 PR Requirements

#### Code Quality
- **Linting**: No ESLint errors or warnings
- **Type checking**: No TypeScript errors
- **Formatting**: Prettier formatted
- **Build**: Project builds successfully
- **Tests**: All tests pass

#### Review Requirements
- **Minimum reviewers**: 1 (can be self-review for small changes)
- **Approval required**: Yes, from at least 1 reviewer
- **Status checks**: All CI checks must pass

#### PR Size Guidelines
- **Small PRs preferred**: < 400 lines changed
- **Large PRs**: Break into smaller PRs when possible
- **Maximum size**: 1000 lines (exceptional cases)

### 4.3 Code Review Process

#### Reviewer Responsibilities
1. **Functionality**: Does the code work as intended?
2. **Code quality**: Follows standards and best practices
3. **Testing**: Adequate test coverage
4. **Security**: No security vulnerabilities
5. **Performance**: No performance regressions
6. **Documentation**: Code is well-documented

#### Review Comments
- **Be constructive**: Provide actionable feedback
- **Explain why**: Help developer understand
- **Suggest alternatives**: Offer solutions
- **Be respectful**: Professional and courteous

#### Review Response
- **Address all comments**: Fix or explain
- **Request changes**: If significant issues
- **Approve**: If code is ready to merge

### 4.4 PR Merge Process

#### Before Merging
- [ ] All reviewers approved
- [ ] All CI checks passed
- [ ] Conflicts resolved (if any)
- [ ] Branch is up to date with `develop`

#### Merge Strategy
- **Squash and merge**: Preferred for feature branches
- **Merge commit**: For important features (preserves history)
- **Rebase and merge**: Not recommended (can cause issues)

#### After Merging
- **Delete branch**: Clean up merged branches
- **Update issue**: Close related issues
- **Deploy to staging**: Automatic deployment

---

## 5. Deployment Process

### 5.1 Environment Strategy

#### Development
- **Branch**: `develop`
- **Purpose**: Integration testing
- **Deployment**: Automatic on merge
- **URL**: `staging.example.com`

#### Production
- **Branch**: `main`
- **Purpose**: Live application
- **Deployment**: Manual approval required
- **URL**: `example.com`

### 5.2 Pre-Deployment Checklist

#### Code Quality
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build succeeds
- [ ] No security vulnerabilities

#### Functionality
- [ ] Feature tested in staging
- [ ] Manual QA completed
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Mobile responsive

#### Documentation
- [ ] README updated (if needed)
- [ ] API documentation updated
- [ ] User documentation updated
- [ ] Changelog updated

#### Configuration
- [ ] Environment variables set
- [ ] Database migrations run (if needed)
- [ ] Feature flags configured
- [ ] Monitoring configured

### 5.3 Deployment Steps

#### Staging Deployment (Automatic)
1. Merge PR to `develop`
2. CI/CD pipeline triggers
3. Run tests
4. Build application
5. Deploy to staging
6. Run smoke tests
7. Notify team

#### Production Deployment (Manual)
1. **Prepare Release**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   ```

2. **Merge to Main**
   ```bash
   git checkout main
   git pull origin main
   git merge release/v1.0.0
   git tag v1.0.0
   git push origin main --tags
   ```

3. **Deploy**
   - CI/CD pipeline triggers
   - Run full test suite
   - Build production bundle
   - Deploy to production
   - Run smoke tests
   - Monitor for errors

4. **Post-Deployment**
   - Verify deployment success
   - Monitor error logs
   - Check analytics
   - Notify stakeholders

### 5.4 Rollback Procedure

#### When to Rollback
- Critical bugs in production
- Performance degradation
- Security vulnerabilities
- Data corruption risks

#### Rollback Steps
1. **Identify Issue**: Confirm problem severity
2. **Revert Commit**: 
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. **Deploy Rollback**: Automatic deployment
4. **Verify**: Confirm issue resolved
5. **Investigate**: Root cause analysis
6. **Document**: Update incident log

---

## 6. Security Best Practices

### 6.1 Code Security

#### Input Validation
- **Always validate**: Never trust user input
- **Use Zod**: For runtime validation
- **Sanitize**: Clean user inputs
- **Type checking**: Use TypeScript

```typescript
// ✅ Good
import { z } from 'zod';

const emailSchema = z.string().email();
const validatedEmail = emailSchema.parse(userInput);

// ❌ Bad
const email = userInput; // No validation
```

#### Authentication
- **Secure tokens**: Use HTTP-only cookies
- **Password hashing**: bcrypt or similar
- **Rate limiting**: Prevent brute force
- **Session management**: Secure session handling

#### API Security
- **Authentication**: Verify on all endpoints
- **Authorization**: Check user permissions
- **Rate limiting**: Prevent abuse
- **CORS**: Configure properly
- **Input validation**: Validate all inputs

### 6.2 Dependency Management

#### Regular Updates
- **Check weekly**: For security updates
- **Update promptly**: Critical vulnerabilities
- **Test updates**: Before deploying
- **Pin versions**: Lock dependency versions

#### Security Scanning
- **npm audit**: Run regularly
- **Dependabot**: Enable automated PRs
- **Snyk**: Additional scanning
- **Review updates**: Before merging

### 6.3 Environment Variables

#### Secrets Management
- **Never commit**: Secrets to repository
- **Use .env files**: For local development
- **Use secrets manager**: For production (Vercel, AWS, etc.)
- **Rotate regularly**: Update secrets periodically

#### Required Variables
- `DATABASE_URL`: Supabase connection
- `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-only)
- `RESEND_API_KEY`: Email service key
- `NEXT_PUBLIC_APP_URL`: Application URL

---

## 7. Performance Standards

### 7.1 Performance Targets

#### Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

#### Page Load
- **Homepage**: < 2s
- **Calculator**: < 3s
- **Results**: < 2s
- **PDF Generation**: < 5s

### 7.2 Optimization Techniques

#### Code Splitting
- **Route-based**: Split by pages
- **Component-based**: Lazy load heavy components
- **Dynamic imports**: Load on demand

```typescript
// ✅ Good
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loading />,
  ssr: false,
});

// ❌ Bad
import HeavyComponent from './HeavyComponent'; // Loads immediately
```

#### Image Optimization
- **Next.js Image**: Use `next/image`
- **Proper sizing**: Set width/height
- **Lazy loading**: Load below fold
- **Format**: WebP when possible

#### Caching
- **Static assets**: Long cache headers
- **API responses**: Cache when appropriate
- **CDN**: Use for static files

---

## 8. Documentation Requirements

### 8.1 Code Documentation

#### Inline Comments
- **Complex logic**: Explain why, not what
- **Non-obvious**: Document unusual patterns
- **TODOs**: Mark with issue numbers
- **API functions**: JSDoc comments

```typescript
/**
 * Calculates ROI for property investment over hold period
 * @param initialInvestment - Total upfront investment
 * @param annualCashFlow - Net annual cash flow
 * @param holdPeriod - Number of years to hold property
 * @returns ROI as decimal (e.g., 0.05 for 5%)
 */
export function calculateROI(
  initialInvestment: number,
  annualCashFlow: number,
  holdPeriod: number
): number {
  // Implementation
}
```

### 8.2 README Files

#### Project README
- Project description
- Setup instructions
- Development workflow
- Testing instructions
- Deployment process

#### Component Documentation
- Purpose and usage
- Props/API
- Examples
- Related components

### 8.3 API Documentation

#### Endpoints
- URL and method
- Request format
- Response format
- Error codes
- Examples

---

## 9. Monitoring & Logging

### 9.1 Error Tracking

#### Error Monitoring
- **Sentry**: For error tracking
- **Log levels**: Debug, Info, Warn, Error
- **Context**: Include relevant data
- **Alerts**: Critical errors notify team

```typescript
// ✅ Good
try {
  // operation
} catch (error) {
  logger.error('Failed to calculate ROI', {
    error,
    userId,
    inputData,
  });
  throw error;
}
```

### 9.2 Analytics

#### User Analytics
- **Page views**: Track navigation
- **User actions**: Button clicks, form submissions
- **Errors**: Track failed operations
- **Performance**: Monitor load times

#### Business Metrics
- **Calculations performed**: Track usage
- **PDF downloads**: Track feature usage
- **Lead captures**: Track conversions
- **User registrations**: Track growth

---

## 10. Checklist Summary

### Before Creating PR
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Manual testing completed
- [ ] Documentation updated
- [ ] No security issues

### Before Merging PR
- [ ] Code reviewed and approved
- [ ] All CI checks pass
- [ ] Tests pass
- [ ] No merge conflicts
- [ ] PR description complete

### Before Production Deployment
- [ ] Staging testing completed
- [ ] Performance acceptable
- [ ] Security review passed
- [ ] Documentation updated
- [ ] Monitoring configured
- [ ] Rollback plan ready

---

## 11. Resources

### Tools
- **Version Control**: Git, GitHub
- **CI/CD**: GitHub Actions, Vercel
- **Testing**: Vitest, Playwright
- **Linting**: ESLint, Prettier
- **Monitoring**: Sentry, Vercel Analytics

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Document Status

**Version**: 1.0  
**Created**: January 2025  
**Status**: Active  
**Owner**: Development Team  
**Last Updated**: January 2025

