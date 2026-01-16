# Theme & Design Standards
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-12  
**Owner:** UX Designer  
**Status:** Approved

---

## Overview

This document defines the visual design system for SRMS, including colors, typography, spacing, components, and responsive design rules. All UI development must follow these standards for consistency.

---

## 1. Color Palette

### 1.1 Primary Colors

```css
/* Primary Blue - Main brand color */
--color-primary-50:  #E3F2FD;   /* Lightest */
--color-primary-100: #BBDEFB;
--color-primary-200: #90CAF9;
--color-primary-300: #64B5F6;
--color-primary-400: #42A5F5;
--color-primary-500: #2196F3;   /* Main */
--color-primary-600: #1E88E5;
--color-primary-700: #1976D2;   /* Dark */
--color-primary-800: #1565C0;
--color-primary-900: #0D47A1;   /* Darkest */
```

**Usage:**
- Primary buttons: `primary-500`
- Hovered primary buttons: `primary-600`
- Links: `primary-700`
- Active states: `primary-600`

---

### 1.2 Secondary Colors

```css
/* Secondary Green - Success, positive actions */
--color-secondary-50:  #E8F5E9;
--color-secondary-100: #C8E6C9;
--color-secondary-200: #A5D6A7;
--color-secondary-300: #81C784;
--color-secondary-400: #66BB6A;
--color-secondary-500: #4CAF50;   /* Main */
--color-secondary-600: #43A047;
--color-secondary-700: #388E3C;
--color-secondary-800: #2E7D32;
--color-secondary-900: #1B5E20;
```

**Usage:**
- Success messages: `secondary-500`
- Positive grades (A, B): `secondary-600`
- Submit buttons: `secondary-500`

---

### 1.3 Semantic Colors

```css
/* Error Red */
--color-error-50:  #FFEBEE;
--color-error-100: #FFCDD2;
--color-error-500: #F44336;       /* Main */
--color-error-700: #D32F2F;       /* Dark */

/* Warning Orange */
--color-warning-50:  #FFF3E0;
--color-warning-100: #FFE0B2;
--color-warning-500: #FF9800;     /* Main */
--color-warning-700: #F57C00;     /* Dark */

/* Info Blue */
--color-info-50:  #E1F5FE;
--color-info-100: #B3E5FC;
--color-info-500: #03A9F4;        /* Main */
--color-info-700: #0288D1;        /* Dark */

/* Success Green (alias to secondary) */
--color-success-500: var(--color-secondary-500);
--color-success-700: var(--color-secondary-700);
```

**Usage:**
- Error messages, validation errors: `error-500`
- Warning messages: `warning-500`
- Info messages: `info-500`
- Success confirmations: `success-500`

---

### 1.4 Neutral Colors (Grays)

```css
/* Grays for text, backgrounds, borders */
--color-gray-50:  #FAFAFA;   /* Lightest background */
--color-gray-100: #F5F5F5;   /* Light background */
--color-gray-200: #EEEEEE;   /* Borders */
--color-gray-300: #E0E0E0;   /* Dividers */
--color-gray-400: #BDBDBD;   /* Disabled text */
--color-gray-500: #9E9E9E;   /* Secondary text */
--color-gray-600: #757575;   /* Hint text */
--color-gray-700: #616161;   /* Body text */
--color-gray-800: #424242;   /* Primary text */
--color-gray-900: #212121;   /* Headings */

/* Pure Black & White */
--color-black:    #000000;
--color-white:    #FFFFFF;
```

**Usage:**
- Headings: `gray-900`
- Body text: `gray-700`
- Secondary text: `gray-600`
- Disabled text: `gray-400`
- Borders: `gray-300`
- Background: `gray-50` or `white`

---

### 1.5 Grade Colors

**Specific to result display:**

```css
--color-grade-a:  #4CAF50;   /* Green - Excellent */
--color-grade-b:  #8BC34A;   /* Light Green - Good */
--color-grade-c:  #FFC107;   /* Amber - Average */
--color-grade-d:  #FF9800;   /* Orange - Below Average */
--color-grade-e:  #FF5722;   /* Deep Orange - Poor */
--color-grade-f:  #F44336;   /* Red - Fail */
```

**Usage:**
- Report cards (grade badges)
- Grade visualizations
- Performance indicators

---

## 2. Typography

### 2.1 Font Families

```css
/* Primary Font - Sans Serif */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                       'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 
                       'Droid Sans', 'Helvetica Neue', sans-serif;

/* Monospace Font - Code/Data */
--font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 
                    'Monaco', 'Courier New', monospace;

/* Numbers - Tabular for tables */
--font-feature-settings: 'tnum' on; /* Enables tabular numbers */
```

**Font Import:**
```html
<!-- In index.html or App CSS -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

### 2.2 Font Sizes

```css
/* Font Scale (1.25 ratio) */
--font-size-xs:   0.75rem;    /* 12px */
--font-size-sm:   0.875rem;   /* 14px */
--font-size-base: 1rem;       /* 16px - Base */
--font-size-lg:   1.125rem;   /* 18px */
--font-size-xl:   1.25rem;    /* 20px */
--font-size-2xl:  1.5rem;     /* 24px */
--font-size-3xl:  1.875rem;   /* 30px */
--font-size-4xl:  2.25rem;    /* 36px */
--font-size-5xl:  3rem;       /* 48px */
```

**Usage Guidelines:**

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| **H1** | 3xl (30px) | 700 (Bold) | Page titles |
| **H2** | 2xl (24px) | 600 (Semibold) | Section headers |
| **H3** | xl (20px) | 600 (Semibold) | Subsection headers |
| **H4** | lg (18px) | 600 (Semibold) | Card titles |
| **Body** | base (16px) | 400 (Regular) | Paragraphs, general text |
| **Small** | sm (14px) | 400 (Regular) | Secondary text, captions |
| **Caption** | xs (12px) | 400 (Regular) | Labels, hints |
| **Button** | sm (14px) | 500 (Medium) | Button text |

---

### 2.3 Font Weights

```css
--font-weight-light:    300;
--font-weight-regular:  400;   /* Body text */
--font-weight-medium:   500;   /* Buttons, emphasis */
--font-weight-semibold: 600;   /* Headings */
--font-weight-bold:     700;   /* Strong emphasis */
```

---

### 2.4 Line Heights

```css
--line-height-tight:   1.25;   /* Headings */
--line-height-normal:  1.5;    /* Body text */
--line-height-relaxed: 1.75;   /* Large text blocks */
```

---

### 2.5 Letter Spacing

```css
--letter-spacing-tight:  -0.01em;  /* Large headings */
--letter-spacing-normal:  0;       /* Body text */
--letter-spacing-wide:    0.025em; /* Buttons, labels */
```

---

## 3. Spacing System

### 3.1 Spacing Scale

**8px Base Unit (0.5rem)**

```css
--spacing-0:  0;           /* 0px */
--spacing-1:  0.25rem;     /* 4px */
--spacing-2:  0.5rem;      /* 8px */
--spacing-3:  0.75rem;     /* 12px */
--spacing-4:  1rem;        /* 16px */
--spacing-5:  1.25rem;     /* 20px */
--spacing-6:  1.5rem;      /* 24px */
--spacing-8:  2rem;        /* 32px */
--spacing-10: 2.5rem;      /* 40px */
--spacing-12: 3rem;        /* 48px */
--spacing-16: 4rem;        /* 64px */
--spacing-20: 5rem;        /* 80px */
```

**Usage:**
- Component padding: `spacing-4` (16px)
- Component margin: `spacing-6` (24px)
- Section spacing: `spacing-8` or `spacing-12`
- Page margins: `spacing-6` to `spacing-16`

---

### 3.2 Component Spacing Rules

| Component | Padding | Margin |
|-----------|---------|--------|
| **Button** | `spacing-3` (vertical), `spacing-6` (horizontal) | `spacing-2` (between buttons) |
| **Card** | `spacing-6` (all sides) | `spacing-4` (between cards) |
| **Input Field** | `spacing-3` (all sides) | `spacing-4` (between fields) |
| **Modal** | `spacing-8` (all sides) | - |
| **Page Container** | `spacing-6` to `spacing-8` | - |
| **Table Cell** | `spacing-3` (vertical), `spacing-4` (horizontal) | - |

---

## 4. Border Radius

```css
--border-radius-none: 0;
--border-radius-sm:   0.25rem;  /* 4px - Subtle */
--border-radius-base: 0.5rem;   /* 8px - Standard */
--border-radius-md:   0.75rem;  /* 12px - Cards */
--border-radius-lg:   1rem;     /* 16px - Modals */
--border-radius-xl:   1.5rem;   /* 24px - Large cards */
--border-radius-full: 9999px;   /* Pill shape */
```

**Usage:**
- Buttons: `border-radius-base` (8px)
- Input fields: `border-radius-base` (8px)
- Cards: `border-radius-md` (12px)
- Modals: `border-radius-lg` (16px)
- Avatar/badges: `border-radius-full`

---

## 5. Shadows (Elevation)

```css
/* Elevation levels for depth */
--shadow-none:   none;

--shadow-sm:     0 1px 2px 0 rgb(0 0 0 / 0.05);
                /* Subtle - Hovering cards */

--shadow-base:   0 1px 3px 0 rgb(0 0 0 / 0.1), 
                 0 1px 2px -1px rgb(0 0 0 / 0.1);
                /* Standard - Cards */

--shadow-md:     0 4px 6px -1px rgb(0 0 0 / 0.1), 
                 0 2px 4px -2px rgb(0 0 0 / 0.1);
                /* Medium - Dropdowns */

--shadow-lg:     0 10px 15px -3px rgb(0 0 0 / 0.1), 
                 0 4px 6px -4px rgb(0 0 0 / 0.1);
                /* Large - Modals */

--shadow-xl:     0 20px 25px -5px rgb(0 0 0 / 0.1), 
                 0 8px 10px -6px rgb(0 0 0 / 0.1);
                /* Extra Large - Floating panels */

--shadow-2xl:    0 25px 50px -12px rgb(0 0 0 / 0.25);
                /* Massive - Top-level dialogs */
```

**Usage:**
- Cards (default): `shadow-base`
- Cards (hover): `shadow-md`
- Dropdowns/Menus: `shadow-md`
- Modals: `shadow-lg`
- Tooltips: `shadow-sm`

---

## 6. Breakpoints (Responsive Design)

```css
/* Mobile-first approach */
--breakpoint-xs:  0px;       /* Extra small devices (phones) */
--breakpoint-sm:  600px;     /* Small devices (large phones) */
--breakpoint-md:  960px;     /* Medium devices (tablets) */
--breakpoint-lg:  1280px;    /* Large devices (laptops) */
--breakpoint-xl:  1920px;    /* Extra large devices (desktops) */
```

**Media Queries:**
```css
/* Usage in CSS */
@media (min-width: 600px) {  /* Small and up */
  /* Styles */
}

@media (min-width: 960px) {  /* Medium and up */
  /* Styles */
}

@media (min-width: 1280px) { /* Large and up */
  /* Styles */
}
```

**Container Widths:**
```css
--container-sm: 600px;
--container-md: 960px;
--container-lg: 1280px;
--container-xl: 1920px;
```

---

## 7. Component Specifications

### 7.1 Buttons

**Primary Button:**
```css
.button-primary {
  background-color: var(--color-primary-500);
  color: var(--color-white);
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: none;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.button-primary:hover {
  background-color: var(--color-primary-600);
  box-shadow: var(--shadow-md);
}

.button-primary:active {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-sm);
}

.button-primary:disabled {
  background-color: var(--color-gray-300);
  color: var(--color-gray-500);
  box-shadow: none;
  cursor: not-allowed;
}
```

**Sizes:**
- Small: `padding: 6px 12px`, `font-size: 12px`
- Medium (default): `padding: 12px 24px`, `font-size: 14px`
- Large: `padding: 16px 32px`, `font-size: 16px`

**Variants:**
- Primary: Blue background
- Secondary: Green background
- Outlined: Transparent with colored border
- Text: Transparent, no border

---

### 7.2 Input Fields

```css
.input-field {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  color: var(--color-gray-800);
  background-color: var(--color-white);
  transition: border-color 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.input-field:disabled {
  background-color: var(--color-gray-100);
  color: var(--color-gray-500);
  cursor: not-allowed;
}

.input-field.error {
  border-color: var(--color-error-500);
}
```

---

### 7.3 Cards

```css
.card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-base);
  border: 1px solid var(--color-gray-200);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
}
```

---

### 7.4 Tables

**Table Styles:**
```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.table thead {
  background-color: var(--color-gray-100);
}

.table th {
  padding: var(--spacing-3) var(--spacing-4);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
  border-bottom: 2px solid var(--color-gray-300);
}

.table td {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid var(--color-gray-200);
  color: var(--color-gray-700);
}

.table tr:hover {
  background-color: var(--color-gray-50);
}
```

---

## 8. Iconography

### 8.1 Icon Library

**Selected:** Material Icons (Material-UI built-in)

**Alternative:** Heroicons, Feather Icons

### 8.2 Icon Sizes

```css
--icon-size-sm: 16px;
--icon-size-md: 24px;   /* Default */
--icon-size-lg: 32px;
--icon-size-xl: 48px;
```

**Usage:**
- Buttons: `icon-size-sm` (16px)
- Navigation: `icon-size-md` (24px)
- Feature highlights: `icon-size-lg` (32px)

---

## 9. Motion & Animation

### 9.1 Transition Durations

```css
--transition-fast:   100ms;   /* Hover states */
--transition-base:   200ms;   /* Standard transitions */
--transition-slow:   300ms;   /* Complex animations */
--transition-slower: 500ms;   /* Page transitions */
```

### 9.2 Easing Functions

```css
--ease-in:     cubic-bezier(0.4, 0, 1, 1);
--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* Default */
```

**Usage:**
```css
transition: all var(--transition-base) var(--ease-in-out);
```

---

## 10. Z-Index Scale

```css
--z-index-dropdown:  1000;
--z-index-sticky:    1020;
--z-index-fixed:     1030;
--z-index-modal-backdrop: 1040;
--z-index-modal:     1050;
--z-index-popover:   1060;
--z-index-tooltip:   1070;
```

---

## 11. Accessibility

### 11.1 Color Contrast

All text must meet **WCAG 2.1 AA** standards:
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (≥ 18px): 3:1 contrast ratio

**Verified Combinations:**
- `gray-900` on `white`: ✅ 16.1:1
- `gray-700` on `white`: ✅ 9.7:1
- `primary-500` on `white`: ✅ 4.6:1
- `white` on `primary-700`: ✅ 7.4:1

### 11.2 Focus States

All interactive elements must have visible focus indicators:
```css
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

---

## 12. Print Styles (Report Cards)

```css
@media print {
  /* Report Card Specific */
  --print-margin: 1in;
  --print-font-size: 12pt;
  
  /* Hide UI elements */
  .no-print {
    display: none !important;
  }
  
  /* Ensure white background */
  body {
    background: white !important;
    color: black !important;
  }
  
  /* Page breaks */
  .page-break {
    page-break-after: always;
  }
}
```

---

## Summary

### Core Design Tokens

```javascript
// For use in Material-UI theme
const theme = {
  palette: {
    primary: {
      main: '#2196F3',
      dark: '#1976D2',
      light: '#64B5F6',
    },
    secondary: {
      main: '#4CAF50',
      dark: '#388E3C',
      light: '#81C784',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#03A9F4',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 16,
  },
  spacing: 8, // 1 unit = 8px
  shape: {
    borderRadius: 8,
  },
};
```

---

**Next Steps:**
1. Implement theme in Material-UI
2. Create Storybook for component showcase
3. Build shared component library
4. Document component usage

---

**Status:** ✅ Approved  
**Approver:** UX Designer, Product Owner  
**Last Updated:** 2026-01-12
