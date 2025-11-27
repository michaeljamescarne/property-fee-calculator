# Style Guide: Property Investment Analysis Platform

## Overview

This style guide is based on the design aesthetic of [Attio.com](https://attio.com/), a modern, AI-native CRM platform. The goal is to create a professional, clean, and trustworthy interface that instills confidence in property investors while maintaining a sophisticated, approachable feel.

---

## Design Principles

### Core Philosophy
1. **Modern & Professional**: Clean, uncluttered interfaces that convey expertise
2. **Trustworthy**: Design that instills confidence in financial calculations
3. **Approachable**: Accessible to both first-time and experienced investors
4. **Data-Driven**: Clear visualization of financial data and analytics
5. **International**: Design that works across cultures (especially Australian and Chinese markets)

---

## Color Palette

### Primary Colors

#### Primary Blue (Attio-inspired)
- **Main**: `#2563EB` (Blue-600) - Primary CTA buttons
- **Dark**: `#1D4ED8` (Blue-700) - Hover states
- **Light**: `#3B82F6` (Blue-500) - Active links
- **Lighter**: `#60A5FA` (Blue-400) - Subtle accents
- **Lightest**: `#DBEAFE` (Blue-100) - Backgrounds

**Usage**: Primary CTAs, links, active states, key interactive elements

**Note**: Attio uses a distinct blue for CTAs. Alternative: `#215EAC` (closer to Attio's blue) can be used as primary if preferred.

#### Primary Accent (Optional)
- **Main**: `#7C3AED` (Violet-600)
- **Dark**: `#6D28D9` (Violet-700)
- **Light**: `#8B5CF6` (Violet-500)

**Usage**: Secondary CTAs, highlights, gradients, special features (use sparingly)

### Neutral Colors (Attio Monochromatic Approach)

#### Grays
- **White**: `#FFFFFF` - Primary backgrounds
- **Gray-50**: `#F9FAFB` - Subtle backgrounds
- **Gray-100**: `#F3F4F6` - Card backgrounds, hover states
- **Gray-200**: `#E5E7EB` - Borders, dividers
- **Gray-300**: `#D1D5DB` - Disabled states
- **Gray-400**: `#9CA3AF` - Placeholder text
- **Gray-500**: `#6B7280` - Secondary text
- **Gray-600**: `#4B5563` - Secondary text, icons
- **Gray-700**: `#374151` - Muted text
- **Gray-800**: `#1F2937` - Dark text
- **Gray-900**: `#111827` - Primary text
- **Black**: `#000000` - Headlines, strong emphasis

**Usage**: Primary text, backgrounds, borders, dividers. Attio uses a monochromatic gray scale with subtle variations for depth.

### Semantic Colors

#### Success
- **Main**: `#10B981` (Green-500)
- **Light**: `#D1FAE5` (Green-100)
- **Dark**: `#059669` (Green-600)

**Usage**: Success messages, positive indicators, completion states

#### Warning
- **Main**: `#F59E0B` (Amber-500)
- **Light**: `#FEF3C7` (Amber-100)
- **Dark**: `#D97706` (Amber-600)

**Usage**: Warnings, cautionary information, pending states

#### Error
- **Main**: `#EF4444` (Red-500)
- **Light**: `#FEE2E2` (Red-100)
- **Dark**: `#DC2626` (Red-600)

**Usage**: Errors, destructive actions, negative indicators

#### Info
- **Main**: `#3B82F6` (Blue-500)
- **Light**: `#DBEAFE` (Blue-100)
- **Dark**: `#2563EB` (Blue-600)

**Usage**: Informational messages, tooltips, help text

### Background Colors

#### Page Backgrounds
- **Primary**: `#FFFFFF` (White)
- **Secondary**: `#F9FAFB` (Gray-50)
- **Tertiary**: `#F3F4F6` (Gray-100)
- **Alternate**: `#FFFFFF` with subtle gradient overlay

#### Card/Surface Backgrounds
- **Default**: `#FFFFFF` (White)
- **Hover**: `#F9FAFB` (Gray-50)
- **Selected**: `#EDE9FE` (Violet-100)
- **Subtle**: `#F9FAFB` (Gray-50)

### Text Colors

- **Primary Text**: `#111827` (Gray-900)
- **Secondary Text**: `#4B5563` (Gray-600)
- **Tertiary Text**: `#6B7280` (Gray-500)
- **Placeholder**: `#9CA3AF` (Gray-400)
- **Disabled**: `#D1D5DB` (Gray-300)
- **Link**: `#2563EB` (Blue-600)
- **Link Hover**: `#1D4ED8` (Blue-700)
- **White Text**: `#FFFFFF` (on colored backgrounds)

---

## Typography

### Font Family

#### Primary Font: Inter
- **Font Stack**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`
- **Source**: Google Fonts or self-hosted
- **Character**: Modern, clean, highly readable, professional

#### Monospace Font (for numbers/data)
- **Font Stack**: `'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace`
- **Usage**: Financial figures, calculations, code snippets

### Font Sizes

#### Display (Hero Headlines)
- **XL**: `72px` / `4.5rem` (line-height: 1.1)
- **Large**: `60px` / `3.75rem` (line-height: 1.1)
- **Medium**: `48px` / `3rem` (line-height: 1.2)

#### Headings
- **H1**: `36px` / `2.25rem` (line-height: 1.2, font-weight: 700)
- **H2**: `30px` / `1.875rem` (line-height: 1.3, font-weight: 600)
- **H3**: `24px` / `1.5rem` (line-height: 1.4, font-weight: 600)
- **H4**: `20px` / `1.25rem` (line-height: 1.4, font-weight: 600)
- **H5**: `18px` / `1.125rem` (line-height: 1.5, font-weight: 600)
- **H6**: `16px` / `1rem` (line-height: 1.5, font-weight: 600)

#### Body Text
- **Large**: `18px` / `1.125rem` (line-height: 1.6, font-weight: 400)
- **Base**: `16px` / `1rem` (line-height: 1.6, font-weight: 400)
- **Small**: `14px` / `0.875rem` (line-height: 1.5, font-weight: 400)
- **XSmall**: `12px` / `0.75rem` (line-height: 1.4, font-weight: 400)

#### UI Elements
- **Button Large**: `16px` / `1rem` (line-height: 1.5, font-weight: 500)
- **Button Base**: `14px` / `0.875rem` (line-height: 1.5, font-weight: 500)
- **Button Small**: `14px` / `0.875rem` (line-height: 1.4, font-weight: 500)
- **Input**: `16px` / `1rem` (line-height: 1.5, font-weight: 400)
- **Label**: `14px` / `0.875rem` (line-height: 1.5, font-weight: 500)
- **Caption**: `12px` / `0.75rem` (line-height: 1.4, font-weight: 400)

### Font Weights

- **Light**: 300
- **Regular**: 400 (default)
- **Medium**: 500 (UI elements, emphasis)
- **Semibold**: 600 (headings, labels)
- **Bold**: 700 (headings, strong emphasis)

---

## Spacing & Layout

### Spacing Scale

Based on 8px base unit:

- **0**: `0px`
- **1**: `4px` / `0.25rem`
- **2**: `8px` / `0.5rem`
- **3**: `12px` / `0.75rem`
- **4**: `16px` / `1rem`
- **5**: `20px` / `1.25rem`
- **6**: `24px` / `1.5rem`
- **8**: `32px` / `2rem`
- **10**: `40px` / `2.5rem`
- **12**: `48px` / `3rem`
- **16**: `64px` / `4rem`
- **20**: `80px` / `5rem`
- **24**: `96px` / `6rem`

### Container Widths

- **Full Width**: 100%
- **Container**: `1280px` max-width
- **Content**: `1024px` max-width
- **Narrow**: `768px` max-width
- **Sidebar**: `280px` width

### Border Radius (Attio Style)

- **None**: `0px`
- **Small**: `4px` / `0.25rem` - **Attio Standard** (buttons, inputs, cards)
- **Base**: `8px` / `0.5rem`
- **Medium**: `12px` / `0.75rem`
- **Large**: `16px` / `1rem`
- **XLarge**: `24px` / `1.5rem`
- **Full**: `9999px` (for pills/badges)

**Note**: Attio primarily uses `4px` border radius for most UI elements, creating a more angular, modern look.

### Shadows

- **None**: `none`
- **Small**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Base**: `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)`
- **Medium**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Large**: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **XLarge**: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

---

## Components

### Buttons

#### Primary Button (Attio Style)
- **Background**: `#2563EB` (Blue-600) or `#215EAC` (Attio blue)
- **Text**: `#FFFFFF` (White)
- **Hover**: `#1D4ED8` (Blue-700) or darker shade
- **Active**: `#1E40AF` (Blue-800)
- **Padding**: `12px 24px`
- **Border Radius**: `4px` (Attio uses 4px, not 8px)
- **Font**: 16px, Medium (500)
- **Shadow**: Subtle or none (Attio uses minimal shadows)

#### Secondary Button (Attio Style)
- **Background**: `#FFFFFF` (White)
- **Text**: `#2563EB` (Blue-600) or `#215EAC` (Attio blue)
- **Border**: `1px solid #2563EB` (Blue-600) or `#215EAC`
- **Hover**: `#F9FAFB` (Gray-50) background
- **Padding**: `12px 24px`
- **Border Radius**: `4px` (Attio uses 4px)

#### Ghost Button
- **Background**: Transparent
- **Text**: `#4B5563` (Gray-600)
- **Hover**: `#F3F4F6` (Gray-100) background
- **Padding**: `12px 24px`
- **Border Radius**: `8px`

#### Button Sizes
- **Large**: `16px 32px` padding, `18px` font
- **Base**: `12px 24px` padding, `16px` font
- **Small**: `8px 16px` padding, `14px` font

### Input Fields

#### Text Input (Attio Style)
- **Background**: `#FFFFFF` (White)
- **Border**: `1px solid #CCCCCC` (Light Gray) or `#E5E7EB` (Gray-200)
- **Border Radius**: `4px` (Attio uses 4px)
- **Padding**: `10px` or `12px 16px`
- **Font**: 16px, Regular (400)
- **Focus**: Border `#2563EB` (Blue-600) or `#215EAC`, minimal ring
- **Error**: Border `#EF4444` (Red-500)
- **Disabled**: Background `#F9FAFB` (Gray-50), text `#9CA3AF` (Gray-400)

#### Textarea
- Same styling as text input
- **Min Height**: `120px`
- **Resize**: Vertical only

#### Select/Dropdown
- Same base styling as text input
- **Dropdown Arrow**: `#6B7280` (Gray-500)

### Cards

#### Default Card
- **Background**: `#FFFFFF` (White)
- **Border**: `1px solid #E5E7EB` (Gray-200)
- **Border Radius**: `12px`
- **Padding**: `24px`
- **Shadow**: Base shadow
- **Hover**: Medium shadow (optional)

#### Elevated Card
- Same as default
- **Shadow**: Medium shadow

#### Interactive Card
- Same as default
- **Hover**: Background `#F9FAFB` (Gray-50), border `#2563EB` (Blue-600)
- **Cursor**: Pointer

### Navigation

#### Header/Navbar
- **Background**: `#FFFFFF` (White) with `#F9FAFB` (Gray-50) subtle background
- **Border**: `1px solid #E5E7EB` (Gray-200) bottom border
- **Height**: `64px`
- **Padding**: `0 24px`
- **Sticky**: Yes, with backdrop blur

#### Navigation Links (Attio Style)
- **Default**: `#000000` (Black) - Attio uses black for navigation
- **Hover**: `#666666` (Gray) with underline effect
- **Active**: `#2563EB` (Blue-600) or `#215EAC`, font-weight: 500
- **Font**: 14px, Medium (500)
- **Hover Effect**: Subtle underline with color change to gray

### Badges

#### Default Badge
- **Background**: `#F3F4F6` (Gray-100)
- **Text**: `#374151` (Gray-700)
- **Padding**: `4px 12px`
- **Border Radius**: `9999px` (full)
- **Font**: 12px, Medium (500)

#### Primary Badge
- **Background**: `#DBEAFE` (Blue-100)
- **Text**: `#1E40AF` (Blue-800)
- Same padding and radius

#### Success Badge
- **Background**: `#D1FAE5` (Green-100)
- **Text**: `#059669` (Green-600)
- Same padding and radius

### Alerts

#### Info Alert
- **Background**: `#DBEAFE` (Blue-100)
- **Border**: `1px solid #60A5FA` (Blue-400)
- **Text**: `#1E40AF` (Blue-800)
- **Icon**: Blue-600
- **Padding**: `16px`
- **Border Radius**: `8px`

#### Success Alert
- **Background**: `#D1FAE5` (Green-100)
- **Border**: `1px solid #10B981` (Green-500)
- **Text**: `#059669` (Green-600)

#### Warning Alert
- **Background**: `#FEF3C7` (Amber-100)
- **Border**: `1px solid #F59E0B` (Amber-500)
- **Text**: `#D97706` (Amber-600)

#### Error Alert
- **Background**: `#FEE2E2` (Red-100)
- **Border**: `1px solid #EF4444` (Red-500)
- **Text**: `#DC2626` (Red-600)

---

## Data Visualization

### Charts & Graphs

#### Color Palette for Charts
1. **Primary**: `#2563EB` (Blue-600)
2. **Secondary**: `#7C3AED` (Violet-600)
3. **Success**: `#10B981` (Green-500)
4. **Warning**: `#F59E0B` (Amber-500)
5. **Error**: `#EF4444` (Red-500)
6. **Neutral**: `#6B7280` (Gray-500)
7. **Accent 1**: `#EC4899` (Pink-500)
8. **Accent 2**: `#14B8A6` (Teal-500)

#### Chart Backgrounds
- **Background**: `#FFFFFF` (White)
- **Grid Lines**: `#E5E7EB` (Gray-200)
- **Axis Labels**: `#6B7280` (Gray-500)
- **Data Labels**: `#111827` (Gray-900)

### Tables

#### Table Header
- **Background**: `#F9FAFB` (Gray-50)
- **Text**: `#374151` (Gray-700)
- **Font**: 14px, Semibold (600)
- **Padding**: `12px 16px`
- **Border**: `1px solid #E5E7EB` (Gray-200) bottom

#### Table Row
- **Background**: `#FFFFFF` (White)
- **Hover**: `#F9FAFB` (Gray-50)
- **Padding**: `12px 16px`
- **Border**: `1px solid #E5E7EB` (Gray-200) bottom

#### Table Cell
- **Text**: `#111827` (Gray-900)
- **Font**: 14px, Regular (400)

---

## Responsive Design

### Breakpoints

- **Mobile**: `0px - 767px`
- **Tablet**: `768px - 1023px`
- **Desktop**: `1024px - 1279px`
- **Large Desktop**: `1280px+`

### Mobile Considerations

- **Font Sizes**: Reduce by 10-15% on mobile
- **Spacing**: Reduce padding/margins by 20-30% on mobile
- **Touch Targets**: Minimum 44px × 44px
- **Navigation**: Hamburger menu on mobile
- **Cards**: Full width on mobile, stacked

---

## Animations & Transitions

### Transitions

- **Default**: `150ms ease-in-out`
- **Fast**: `100ms ease-in-out`
- **Slow**: `300ms ease-in-out`
- **Smooth**: `200ms cubic-bezier(0.4, 0, 0.2, 1)`

### Hover Effects

- **Buttons**: Background color change, slight shadow increase
- **Cards**: Shadow elevation, slight scale (1.01)
- **Links**: Color change, underline on hover (optional)

### Loading States

- **Skeleton**: `#F3F4F6` (Gray-100) background with shimmer animation
- **Spinner**: Primary blue color, smooth rotation
- **Progress Bar**: Primary blue gradient

---

## Accessibility

### Color Contrast

- **AA Standard**: All text meets WCAG 2.1 AA (4.5:1 ratio)
- **AAA Standard**: Critical text meets AAA (7:1 ratio)
- **Large Text**: 3:1 ratio minimum (18px+)

### Focus States

- **Focus Ring**: `2px solid #2563EB` (Blue-600)
- **Focus Offset**: `2px`
- **Outline**: Never remove, always visible

### Interactive Elements

- **Keyboard Navigation**: All interactive elements keyboard accessible
- **ARIA Labels**: Proper labels for screen readers
- **Skip Links**: Available for keyboard users

---

## Implementation Notes

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#DBEAFE',
          100: '#DBEAFE',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
        accent: {
          100: '#EDE9FE',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        // 8px base unit
      },
      borderRadius: {
        'base': '8px',
        'medium': '12px',
      },
    },
  },
}
```

### CSS Variables

```css
:root {
  /* Primary Colors */
  --color-primary: #2563EB;
  --color-primary-dark: #1D4ED8;
  --color-primary-light: #3B82F6;
  
  /* Accent Colors */
  --color-accent: #7C3AED;
  --color-accent-dark: #6D28D9;
  
  /* Neutral Colors */
  --color-gray-50: #F9FAFB;
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-900: #111827;
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --spacing-base: 8px;
  
  /* Shadows */
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

---

## Brand Guidelines

### Logo Usage
- **Primary**: Full color logo on light backgrounds
- **Secondary**: Monochrome logo on colored backgrounds
- **Minimum Size**: 120px width for main logo
- **Clear Space**: 2x logo height around logo

### Imagery
- **Style**: Professional, modern, clean
- **Photography**: High-quality, natural lighting
- **Illustrations**: Minimal, geometric, modern
- **Icons**: Consistent line style, 24px default size

### Voice & Tone
- **Professional**: Authoritative but approachable
- **Clear**: Simple, jargon-free language
- **Helpful**: User-focused, supportive
- **Confident**: Demonstrates expertise without arrogance

---

## Examples

### Hero Section
- **Background**: White with subtle gradient (`#F9FAFB` to `#FFFFFF`)
- **Headline**: 72px, Bold, Gray-900
- **Subheadline**: 24px, Regular, Gray-600
- **CTA**: Primary blue button, 24px padding
- **Spacing**: 96px vertical spacing between elements

### Calculator Form
- **Card**: White background, 12px border radius, base shadow
- **Input Fields**: 16px padding, 8px border radius
- **Labels**: 14px, Semibold, Gray-700
- **Help Text**: 12px, Regular, Gray-500
- **Error Messages**: Red-500, 14px, with icon

### Results Dashboard
- **Section Headers**: 24px, Semibold, Gray-900
- **Metric Cards**: White background, subtle border, medium shadow
- **Charts**: Clean, minimal, primary blue accent
- **Data Tables**: Alternating row backgrounds (Gray-50)

---

## References

- **Attio Design Inspiration**: [https://attio.com/](https://attio.com/)
- **Inter Font**: [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)
- **Tailwind CSS**: [https://tailwindcss.com/](https://tailwindcss.com/)
- **WCAG Guidelines**: [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Document Status

**Version**: 1.0  
**Created**: January 2025  
**Status**: Ready for Implementation  
**Owner**: Design & Development Team

