# Interaction Specifications
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-05  
**Owner:** UX Designer

---

## Overview

This document defines interaction rules, component states, transitions, and behaviors for all UI elements in SRMS.

---

## Interaction Patterns

### 1. Buttons

#### Primary Button

**Purpose:** Main actions (Submit, Save, Confirm, Publish)

**States:**
- **Default:** Solid primary color (#2563EB), white text, slight shadow
- **Hover:** Darker shade (#1D4ED8), cursor pointer, scale 1.02
- **Active/Pressed:** Even darker (#1E40AF), scale 0.98
- **Focus:** Blue outline ring (2px), visible focus indicator
- **Disabled:** Gray (#9CA3AF), no pointer, opacity 0.6
- **Loading:** Spinner icon, "Processing..." text, disabled

**Transitions:**
- All state changes: 150ms ease-in-out
- Hover scale: 200ms ease-out
- Loading spinner: Fade in 100ms

**Keyboard Interaction:**
- Enter: Trigger click
- Space: Trigger click
- Tab: Move focus to next element

**Accessibility:**
- `role="button"` (if not `<button>`)
- `aria-label` if icon-only
- `aria-disabled="true"` when disabled
- Minimum touch target: 44x44px

---

#### Secondary Button

**Purpose:** Less important actions (Cancel, Back, Skip)

**States:**
- **Default:** White background, primary border, primary text
- **Hover:** Light blue background (#EFF6FF), darker border
- **Active:** Slightly darker background (#DBEAFE)
- **Focus:** Blue outline ring
- **Disabled:** Gray border and text, no pointer

**Same transitions and keyboard behavior as Primary**

---

#### Ghost/Text Button

**Purpose:** Tertiary actions, links disguised as buttons

**States:**
- **Default:** Transparent background, primary text, no border
- **Hover:** Light background (#F3F4F6), underline text
- **Active:** Darker background (#E5E7EB)
- **Focus:** Outline ring
- **Disabled:** Gray text

---

### 2. Form Inputs

#### Text Input

**States:**
- **Default:** White background, gray border, black text
- **Hover:** Slightly darker border (#9CA3AF)
- **Focus:** Primary border (#2563EB), blue ring, outline removed
- **Filled:** Normal state with content
- **Error:** Red border (#EF4444), red ring, error message below
- **Success:** Green border (#10B981), checkmark icon (optional)
- **Disabled:** Gray background (#F3F4F6), gray text, no pointer

**Validation Behavior:**
- **On Blur:** Validate after user leaves field
- **Real-Time:** For specific fields (password strength, username availability)
- **On Submit:** Validate all fields, focus first error

**Error Message:**
- Appears below input, red text (#DC2626)
- Icon: ⚠️ or ❌
- Clear, actionable text: "Email is required" (not "Invalid input")

**Keyboard Interaction:**
- Tab: Move to next field
- Shift+Tab: Move to previous field
- Enter: Submit form (if in form)
- Escape: Clear field (optional)

**Accessibility:**
- `<label>` associated with input (`for` attribute)
- `aria-invalid="true"` when error
- `aria-describedby` points to error message ID
- `required` attribute for required fields

---

#### Number Input

**Specific to Grade Entry:**
- Type: `type="number"` with `step="0.01"` (allow decimals)
- Min: `min="0"`, Max: `max="100"`
- Validation: 0-100, up to 2 decimal places
- Auto-select text on focus (easy overwrite)
- Numeric keyboard on mobile

**States:** Same as Text Input plus:
- **Out of Range:** Red border, error: "Score must be between 0 and 100"

---

#### Select/Dropdown

**States:**
- **Default:** Chevron down icon, closed
- **Open:** Dropdown menu visible, chevron up
- **Hover (option):** Highlight hovered option (light blue bg)
- **Selected:** Checkmark icon next to selected option
- **Focus:** Blue ring around select
- **Disabled:** Gray, no chevron

**Keyboard Interaction:**
- Enter/Space: Open dropdown
- Arrow Up/Down: Navigate options
- Enter: Select focused option
- Escape: Close dropdown without selecting
- Type letter: Jump to option starting with that letter

---

### 3. Tables

#### Data Table (Grade Entry, Result Viewing)

**States:**
- **Default:** Alternating row colors (#F9FAFB / white)
- **Hover Row:** Light blue background (#EFF6FF)
- **Selected Row:** Blue background (#DBEAFE), checkmark column
- **Sortable Column:** Clickable header, sort icon (↑↓)
- **Sorted:** Active sort icon (↑ or ↓), column highlighted

**Interactions:**
- **Click Header:** Sort by column (toggle asc/desc)
- **Click Row:** Select row (if selectable)
- **Checkbox Column:** Multi-select rows

**Keyboard Navigation:**
- Arrow Keys: Navigate cells (if inline editing)
- Tab: Move to next editable cell
- Enter: Start editing cell (if editable)
- Escape: Cancel editing

**Accessibility:**
- `<table>` with semantic markup
- `<thead>`, `<tbody>`, `<th scope="col">`
- `aria-sort="ascending|descending"` on sorted column
- `role="grid"` if advanced keyboard navigation

---

### 4. Modals/Dialogs

**States:**
- **Closed:** Not visible, not in DOM or hidden
- **Opening:** Fade in animation (200ms), backdrop blur
- **Open:** Fully visible, scrollable content, focus trapped
- **Closing:** Fade out animation (150ms)

**Backdrop:**
- Semi-transparent black (#000000 50% opacity)
- Blur effect (backdrop-filter: blur(4px))
- Click backdrop: Close modal (with confirmation if unsaved changes)

**Modal Content:**
- Centered on screen
- Max-width: 600px (medium), 900px (large)
- Shadow: Large elevation shadow
- Border-radius: 8px
- Padding: 24px

**Interactions:**
- **Escape Key:** Close modal
- **Click Backdrop:** Close modal
- **Close Button (X):** Top-right corner, close modal
- **Primary Action:** Bottom-right, closes modal
- **Cancel:** Bottom-right (secondary), closes modal

**Focus Management:**
- **On Open:** Focus first interactive element (usually close button or first input)
- **Focus Trap:** Tab cycles through modal elements only
- **On Close:** Return focus to trigger element

**Accessibility:**
- `role="dialog"` or `role="alertdialog"`
- `aria-modal="true"`
- `aria-labelledby` (modal title ID)
- `aria-describedby` (modal description ID)
- Prevent background scroll when open

---

### 5. Notifications/Toasts

**Types:**
- **Success:** Green background, checkmark icon
- **Error:** Red background, X icon
- **Warning:** Amber background, alert icon
- **Info:** Blue background, info icon

**Behavior:**
- **Appear:** Slide in from top-right, fade in (300ms)
- **Auto-Dismiss:** After 5 seconds (success/info), 7 seconds (error/warning)
- **Manual Dismiss:** X button, click to dismiss
- **Disappear:** Fade out + slide out (200ms)
- **Multiple Toasts:** Stack vertically, max 3 visible

**Accessibility:**
- `role="alert"` for errors
- `role="status"` for success/info
- `aria-live="polite"` or `aria-live="assertive"`
- Screen reader announces content

---

### 6. Navigation

#### Top Navbar

**States:**
- **Default:** Solid background, logo left, nav center, profile right
- **Hover (link):** Underline, lighter text color
- **Active (current page):** Bold, primary color, bottom border
- **Mobile:** Hamburger menu (≡), opens sidebar overlay

**Behavior:**
- Sticky: Stays at top on scroll
- Shadow: Appears on scroll down
- Mobile breakpoint: < 768px, switch to hamburger

---

#### Sidebar (Admin Only)

**States:**
- **Expanded:** Full width (240px), icons + text
- **Collapsed:** Narrow (64px), icons only
- **Hover (item):** Light background, cursor pointer
- **Active (current page):** Primary background, white text

**Behavior:**
- Toggle button: Expand/collapse sidebar
- Smooth transition: 300ms ease-in-out
- Persists state: LocalStorage saves preference

**Mobile:**
- Overlay sidebar, covers content
- Backdrop: Semi-transparent, closes on click
- Swipe from left: Opens sidebar
- Swipe right / Escape: Closes sidebar

---

### 7. Loading States

#### Spinner

**Usage:** Small actions (save, load)
**Appearance:** Circular spinner, primary color, 16px-24px
**Animation:** 360° rotation, 1s infinite linear

#### Skeleton Screen

**Usage:** Page/section loading
**Appearance:** Gray placeholder blocks, shimmer animation
**Animation:** Light gradient moves left-to-right (pulse effect)

#### Progress Bar

**Usage:** File upload, PDF generation, batch operations
**Appearance:** Horizontal bar, primary color fill
**Shows:** Percentage (0-100%) and/or time remaining

---

## State Transition Matrix

| From State | To State | Trigger | Transition |
|-----------|---------|---------|------------|
| Button Default | Hover | Mouse enter | 150ms color change |
| Button Hover | Active | Mouse down | Instant scale |
| Button Active | Loading | Click | Fade in spinner |
| Input Default | Focus | Click / Tab | Border color + ring |
| Input Focus | Error | Validation fail | Border color red |
| Modal Closed | Open | Trigger click | 200ms fade in |
| Modal Open | Closed | Escape / Click out | 150ms fade out |

---

## Timing Standards

- **Fast:** 100-150ms (instant feel)
- **Base:** 200-300ms (standard)
- **Slow:** 400-500ms (deliberate)

**Use Fast for:**
- Hover effects
- Button state changes
- Tooltip appearance

**Use Base for:**
- Modal open/close
- Page transitions
- Dropdown open

**Use Slow for:**
- Page animations
- Large content reveal

---

## Touch Gestures (Mobile/Tablet)

**Tap:**
- Single tap: Click/select
- Double tap: Zoom (where applicable)

**Swipe:**
- Swipe left: Next (in carousel/wizard)
- Swipe right: Back/previous
- Swipe down: Refresh (pull-to-refresh on lists)

**Pinch:**
- Pinch out: Zoom in (on zoomable content)
- Pinch in: Zoom out

**Minimum Touch Targets:** 44x44px (Apple), 48x48px (Android)

---

## Animation Principles

1. **Purpose:** Every animation should have a reason (feedback, guide attention)
2. **Performance:** Use CSS transforms (translate, scale) over position changes
3. **Subtlety:** Animations should feel natural, not distracting
4. **Respect Preferences:** Honor `prefers-reduced-motion` media query

---

**Document Status:** Complete  
**Owner:** UX Designer  
**Last Updated:** 2026-01-05
