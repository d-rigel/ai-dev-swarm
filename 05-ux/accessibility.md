# Accessibility Requirements
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-05  
**Owner:** UX Designer  
**Target:** WCAG 2.1 Level AA Compliance

---

## Overview

SRMS is committed to accessibility for all users, including those with disabilities. We aim for WCAG 2.1 Level AA compliance across all features.

---

## WCAG 2.1 Principles

### 1. Perceivable
Information and UI components must be presentable to users in ways they can perceive.

### 2. Operable  
UI components and navigation must be operable by all users.

### 3. Understandable
Information and operation of the UI must be understandable.

### 4. Robust
Content must be robust enough for reliable interpretation by assistive technologies.

---

## WCAG 2.1 Level AA Checklist

### Perceivable

#### 1.1 Text Alternatives
- [x] All images have meaningful `alt` text
- [x] Decorative images have `alt=""` or `role="presentation"`
- [x] Icons paired with text or have `aria-label`
- [x] School logo has alt="[School Name] Logo"

#### 1.2 Time-Based Media
- [x] No auto-playing audio or video
- [x] If video tutorials added, provide captions and transcripts

#### 1.3 Adaptable
- [x] Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- [x] Headings in logical order (H1 → H2 → H3, no skipping)
- [x] Tables use `<th>`, `<caption>`, `scope` attributes
- [x] Form labels associated with inputs
- [x] Lists use `<ul>`, `<ol>`, `<li>`

#### 1.4 Distinguishable
- [x] **Color Contrast:**
  - Normal text: 4.5:1 minimum
  - Large text (18pt+): 3:1 minimum
  - UI components: 3:1 minimum
- [x] Color not sole means of conveying information
- [x] Text resizable up to 200% without loss of content
- [x] No images of text (use real text with CSS styling)

**Color Contrast Examples:**
| Element | Foreground | Background | Ratio | Pass? |
|---------|-----------|------------|-------|-------|
| Body text | #1F2937 | #FFFFFF | 13.6:1 | ✅ AAA |
| Primary button | #FFFFFF | #2563EB | 4.8:1 | ✅ AA |
| Error text | #DC2626 | #FFFFFF | 5.1:1 | ✅ AA |
| Success text | #059669 | #FFFFFF | 3.8:1 | ✅ AA (large) |

---

### Operable

#### 2.1 Keyboard Accessible
- [x] All functionality available via keyboard
- [x] Tab order logical (left-to-right, top-to-bottom)
- [x] No keyboard traps
- [x] Skip navigation link ("Skip to main content")
- [x] Keyboard shortcuts documented (if any)

**Key Bindings:**
- Tab: Next interactive element
- Shift+Tab: Previous interactive element
- Enter: Activate buttons, submit forms
- Space: Toggle checkboxes, activate buttons
- Arrow keys: Navigate dropdowns, radio groups
- Escape: Close modals/dialogs

#### 2.2 Enough Time
- [x] Session timeout warning (5 minutes before expiry)
- [x] User can extend session
- [x] No time limits on form completion
- [x] Auto-save for long forms (grade entry)

#### 2.3 Seizures
- [x] Nothing flashes more than 3 times per second
- [x] No rapid animations

#### 2.4 Navigable
- [x] Page titles unique and descriptive
- [x] Focus order follows visual order
- [x] **Focus visible** - 2px outline ring on all interactive elements
- [x] Link purpose clear from link text alone
- [x] Multiple ways to navigate (menu, search, breadcrumbs)
- [x] Headings describe page sections

**Page Titles:**
- Login: "Login - SRMS"
- Dashboard: "[Role] Dashboard - SRMS"
- Grade Entry: "Grade Entry: [Class] [Subject] - SRMS"

#### 2.5 Input Modalities
- [x] Touch targets minimum 44x44px
- [x] Pointer gestures have keyboard/touch alternative
- [x] No motion-activated functions

---

### Understandable

#### 3.1 Readable
- [x] Page language declared (`<html lang="en">`)
- [x] Language changes marked (`lang` attribute on element)
- [x] Readable font size (16px minimum for body text)
- [x] Line height 1.5 minimum
- [x] Paragraph width maximum 80 characters

#### 3.2 Predictable
- [x] Navigation consistent across pages
- [x] Components consistent (buttons, forms look the same everywhere)
- [x] Focus doesn't trigger unexpected changes
- [x] Forms submit only when user clicks submit button

#### 3.3 Input Assistance
- [x] Form labels always visible (not placeholder-only)
- [x] Error identification clear (red border + message)
- [x] Error messages specific and helpful
- [x] Error prevention (validation before submit)
- [x] Confirmation for destructive actions

**Error Message Examples:**
- ❌ "Invalid input" → Too vague
- ✅ "Email is required" → Specific
- ✅ "Score must be between 0 and 100" → Actionable

---

### Robust

#### 4.1 Compatible
- [x] Valid HTML5 (no parsing errors)
- [x] Unique `id` attributes
- [x] Proper nesting of elements
- [x] ARIA used correctly:
  - `role` attributes appropriate
  - `aria-label` for icon buttons
  - `aria-labelledby` for sections
  - `aria-describedby` for hints
  - `aria-invalid="true"` for errors
  - `aria-required="true"` for required fields
  - `aria-live` for dynamic content
- [x] Name, Role, Value exposed for all UI components

---

## Screen Reader Support

### Supported Screen Readers
- **NVDA** (Windows)
- **JAWS** (Windows)
- **VoiceOver** (macOS, iOS)
- **TalkBack** (Android)

### Screen Reader Testing Checklist
- [ ] All pages read in logical order
- [ ] Form labels announced correctly
- [ ] Button purposes clear
- [ ] Table structure announced
- [ ] Error messages announced
- [ ] Success messages announced
- [ ] Modal focus trapped
- [ ] Skip link works

---

## ARIA Patterns

### Button
```html
<button type="button" aria-label="Download report card">
  <svg aria-hidden="true">...</svg>
  Download
</button>
```

### Form Input
```html
<label for="email">Email</label>
<input 
  type="email" 
  id="email" 
  aria-required="true"
  aria-invalid="false"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">Email is required</span>
```

### Modal
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Confirm Submission</h2>
  ...
</div>
```

### Alert/Notification
```html
<div role="alert" aria-live="assertive">
  Results published successfully!
</div>
```

### Progress Bar
```html
<div role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
  75% complete
</div>
```

---

## Keyboard Navigation Patterns

### Forms
1. Tab to first field
2. Fill in field
3. Tab to next field
4. Repeat
5. Tab to Submit button
6. Enter to submit

### Tables (Grade Entry)
1. Tab to first cell
2. Enter to edit
3. Type value
4. Tab to next cell (auto-saves)
5. Repeat

### Modals
1. Modal opens, focus on close button or first input
2. Tab cycles through modal only (focus trap)
3. Escape to close
4. Focus returns to trigger element

### Dropdowns
1. Tab to dropdown
2. Space/Enter to open
3. Arrow keys to navigate
4. Enter to select
5. Escape to close without selecting

---

## Mobile Accessibility

### Touch Targets
- **Minimum:** 44x44px (Apple), 48x48px (Android)
- **Spacing:** 8px between touch targets
- **Buttons:** Large, easy to tap

### Gestures
- All swipe gestures have button alternatives
- No complex multi-finger gestures required
- Pinch-to-zoom allowed

### Screen Reader (Mobile)
- VoiceOver (iOS) and TalkBack (Android) compatible
- All content accessible via swipe navigation

---

## Reduced Motion

### Respect User Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Users who enable "Reduce Motion" in OS settings see minimal or no animations.

---

## Testing Tools

### Automated Testing
- **WAVE** (Web Accessibility Evaluation Tool)
- **axe DevTools** (Browser extension)
- **Lighthouse** (Chrome DevTools)
- **Pa11y** (CLI tool)

### Manual Testing
- **Keyboard navigation** - Unplug mouse, navigate with keyboard only
- **Screen reader** - Test with NVDA or VoiceOver
- **Zoom** - Test at 200% zoom
- **Color blindness** - Test with color blind simulators

### Testing Checklist
- [ ] Automated scan (WAVE, axe) passes
- [ ] Keyboard navigation works for all features
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets 4.5:1 (or 3:1 for large text)
- [ ] Focus indicators visible
- [ ] Forms have labels
- [ ] Errors announced and associated
- [ ] Responsive at 200% zoom
- [ ] Works with reduced motion

---

## Accessibility Statement

**Commitment:**  
SRMS is committed to ensuring digital accessibility for users with disabilities. We continually improve the user experience and apply relevant accessibility standards.

**Conformance:**  
SRMS aims to conform to WCAG 2.1 Level AA standards.

**Feedback:**  
If you encounter accessibility barriers, please contact us at [accessibility@srms.com].

**Date:** 2026-01-05

---

## Implementation Guidelines

### For Developers

1. **Use semantic HTML** - `<button>`, `<nav>`, `<main>`, `<article>`
2. **Always include labels** - Every input needs a `<label>`
3. **Test with keyboard** - Can you navigate without a mouse?
4. **Check contrast** - Use tools to verify 4.5:1 ratio
5. **Add ARIA carefully** - Only when HTML isn't enough
6. **Focus management** - Visible focus ring, logical order
7. **Announce changes** - Use `aria-live` for dynamic content
8. **Test with screen reader** - At least once per feature

### For Designers

1. **Design focus states** - Don't remove outlines!
2. **Use high contrast** - Check with contrast checker
3. **Don't rely on color alone** - Use icons, text, patterns
4. **Keep touch targets large** - 44x44px minimum
5. **Design for zoom** - Layout shouldn't break at 200%
6. **Simple language** - Clear, concise, jargon-free

---

**Document Status:** Complete  
**Owner:** UX Designer  
**Review Date:** 2026-07-05 (6 months)  
**Last Updated:** 2026-01-05
