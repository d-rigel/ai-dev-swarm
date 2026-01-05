# Edge Cases & Error Handling
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-05  
**Owner:** UX Designer

---

## Overview

This document defines how the system handles edge cases, error scenarios, and unusual conditions.

---

## 1. Empty States

### No Data Available

**Scenario:** User views a page with no data (no students, no results, no classes)

**UI Treatment:**
- Empty state illustration (icon or SVG)
- Friendly message: "No [items] yet"
- Call-to-action button: "Add [Item]"
- Example: "No students enrolled yet. Click 'Add Student' to get started."

**Examples:**
- **No Classes:** "No classes created yet. Set up your first class to begin."
- **No Results:** "No results published yet. Results will appear here once published."
- **No Subjects:** "No subjects configured. Add subjects to continue."

---

### Search Returns No Results

**Scenario:** User searches for student/class and nothing matches

**UI Treatment:**
- Message: "No results found for '[search term]'"
- Suggestions:
  - "Try a different search term"
  - "Check spelling"
  - "Use student ID instead of name"
- Button: "Clear Search" or "View All"

---

## 2. Data Edge Cases

### Very Long Names

**Scenario:** Student name with 100+ characters, school name with 200+ characters

**Handling:**
- **Display:** Truncate with ellipsis (...) after reasonable length
- **Tooltip:** Show full name on hover
- **Forms:** Allow full entry, validate max length (e.g., 200 chars)
- **PDF:** Wrap text or use smaller font if needed

**Example:**
- Display: "Chukwuemeka Oluwasegun Adeb..." (40 chars)
- Hover: Shows full name in tooltip

---

### Special Characters & Unicode

**Scenario:** Names with é, ñ, ü, emojis, symbols

**Handling:**
- **Support:** Full Unicode support (UTF-8)
- **Display:** Show characters correctly
- **Validation:** Allow letters from all languages
- **Search:** Case-insensitive, accent-insensitive

**Examples:**
- José María García-López ✅
- 李明 (Chinese characters) ✅
- Mohammed Al-Fayed ✅
- Names with emojis ⚠️ (discouraged but not blocked)

---

### Extreme Scores

**Scenario:** Edge values in scoring

| Scenario | Value | Handling |
|----------|-------|----------|
| Perfect score | CA: 100, Exam: 100 | Final: 100.0, Grade: A |
| Zero score | CA: 0, Exam: 0 | Final: 0.0, Grade: F |
| Decimal precision | CA: 85.67, Exam: 92.33 | Final: 90.168 → 90.17 (2 decimals) |
| Just below grade boundary | Final: 74.99 | Grade: B (not rounded up to A) |
| Exactly on boundary | Final: 75.00 | Grade: A (inclusive lower bound) |

---

### Tied Positions

**Scenario:** Multiple students with identical final scores

**Handling:**
- **Same Rank:** All students with same score get same position
- **Skip Next:** If 3 students tie for 2nd, next is 5th (not 3rd)
- **Display:** "2nd (tied)" or just "2nd"
- **Sorting:** Secondary sort by student name (alphabetical)

**Example:**
- 1st: 95.0 (Student A)
- 2nd: 90.0 (Student B)
- 2nd: 90.0 (Student C) ← Tied
- 2nd: 90.0 (Student D) ← Tied
- 5th: 88.0 (Student E) ← Skip 3rd and 4th

---

## 3. Class Size Edge Cases

### Very Small Class

**Scenario:** Class with 1-5 students

**Handling:**
- Positions still calculated (1st, 2nd, 3rd, etc.)
- Statistics may be less meaningful
- Message: "Small class size - statistics may not be representative"

---

### Very Large Class

**Scenario:** Class with 100+ students

**Handling:**
- **Table:** Pagination (20-50 students per page)
- **Performance:** Optimize rendering, use virtual scrolling if >200
- **PDF Generation:** May take longer, show progress bar
- **Statistics:** Calculate efficiently (database aggregation)

---

## 4. Validation Errors

### Missing Required Fields

**Scenario:** User tries to submit form with empty required fields

**UI Treatment:**
- **Prevent Submission:** Button disabled or shows error
- **Highlight Fields:** Red border on empty required fields
- **Error Message:** "Please fill in all required fields"
- **Focus:** Move focus to first missing field

---

### Invalid Email Format

**Scenario:** User enters "notanemail" instead of "user@example.com"

**UI Treatment:**
- Error message: "Please enter a valid email address"
- Regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Example shown: "example@school.com"

---

### Invalid Score Range

**Scenario:** Teacher enters score 105 or -10

**UI Treatment:**
- Error message: "Score must be between 0 and 100"
- Red border on input
- Auto-clear invalid value OR auto-clamp to 0-100

---

### Duplicate Entry

**Scenario:** Admin tries to create class "Grade 7A" when it already exists

**UI Treatment:**
- Error message: "Class 'Grade 7A' already exists"
- Suggestion: "Use a different name or edit the existing class"
- Link to existing class (if applicable)

---

## 5. Network & System Errors

### Network Connection Lost

**Scenario:** User's internet drops mid-action

**UI Treatment:**
- Error notification: "No internet connection. Your changes will be saved when connection is restored."
- Retry button
- Auto-save to local storage (if possible)
- Auto-retry when connection restored

---

### Server Error (500)

**Scenario:** Backend crashes or database error

**UI Treatment:**
- Error message: "Something went wrong on our end. Please try again in a moment."
- Avoid technical details (don't show stack trace to user)
- Log error for debugging
- Retry button
- Contact support link (if persists)

---

### Timeout

**Scenario:** PDF generation takes >30 seconds

**UI Treatment:**
- Progress message: "This is taking longer than expected..."
- Option to continue waiting OR cancel
- If timeout: "Generation timed out. Please try again or contact support if issue persists."

---

### Session Expired

**Scenario:** User inactive for 4+ hours, session expires

**UI Treatment:**
- Modal: "Your session has expired for security. Please log in again."
- Preserve unsaved work if possible (local storage)
- Redirect to login
- After login, restore context (return to same page)

---

## 6. Permission Errors

### Unauthorized Access

**Scenario:** Teacher tries to access admin-only page

**UI Treatment:**
- Redirect to 403 Forbidden page
- Message: "You don't have permission to access this page."
- Suggestion: "Contact your administrator if you think this is an error."
- Button: "Go to Dashboard"

---

### Read-Only Access

**Scenario:** Parent tries to edit student profile

**UI Treatment:**
- Disable edit buttons (grayed out)
- Tooltip: "You don't have permission to edit this"
- All inputs read-only
- Message at top: "You're viewing this in read-only mode"

---

## 7. Date & Time Edge Cases

### Past Dates

**Scenario:** Admin tries to create term with past dates

**Handling:**
- **Allow:** Historical data entry is valid
- **Warning:** "This term is in the past. Are you sure?"
- **Validation:** Dates must be logical (start < end)

---

### Overlapping Terms

**Scenario:** Admin creates Term 2 with dates that overlap Term 1

**Handling:**
- **Prevent:** Validation error
- **Message:** "Term dates overlap with Term 1 (Sept 1 - Dec 15)"
- **Suggestion:** "Adjust dates or edit existing term"

---

## 8. File Upload Edge Cases

### File Too Large

**Scenario:** School logo upload >5MB

**UI Treatment:**
- Error: "File size must be less than 5MB"
- Show current file size: "Your file: 8.2MB"
- Suggestion: "Try compressing the image"

---

### Invalid File Type

**Scenario:** User uploads .txt file as logo

**UI Treatment:**
- Error: "Invalid file type. Please upload JPG or PNG."
- Accepted formats clearly listed
- File picker pre-filtered (accept attribute)

---

### Corrupted File

**Scenario:** Image file is corrupted

**UI Treatment:**
- Error: "Unable to process file. File may be corrupted."
- Suggestion: "Try a different file"

---

## 9. Performance Edge Cases

### Slow Loading

**Scenario:** Page takes >3 seconds to load

**UI Treatment:**
- Skeleton screens (not blank page)
- Progress indicators
- Message if >10 seconds: "Loading is taking longer than usual..."

---

### Large Result Set

**Scenario:** School-wide report with 10,000 students

**UI Treatment:**
- **Pagination:** 50-100 rows per page
- **Lazy Loading:** Load data as user scrolls
- **Filters:** Allow narrowing results (by class, grade, etc.)
- **Export:** Offer CSV download for full dataset

---

## 10. Browser Compatibility

### Unsupported Browser

**Scenario:** User opens site in Internet Explorer

**UI Treatment:**
- Banner at top: "Your browser is not supported"
- Message: "For the best experience, please use Chrome, Firefox, Safari, or Edge"
- Download links to supported browsers
- Functionality may be limited or broken

---

### JavaScript Disabled

**Scenario:** User has JavaScript disabled

**UI Treatment:**
- Noscript tag message: "This application requires JavaScript. Please enable JavaScript in your browser settings."
- Link to instructions

---

## 11. Concurrent Access

### Multiple Users Editing Same Data

**Scenario:** Two teachers editing grades for same class simultaneously

**Handling:**
- **Optimistic Locking:** Last write wins
- **Warning:** "Another user may have modified this data. Your changes will overwrite theirs."
- **OR Conflict Detection:** Show both versions, ask user to resolve
- **Best Practice:** Assign classes to single teacher to avoid conflicts

---

## 12. Audit & Compliance Edge Cases

### Override Without Justification

**Scenario:** Admin tries to override result without entering reason

**UI Treatment:**
- **Prevent:** Submit button disabled until justification entered
- **Validation:** Minimum 50 characters
- **Error:** "Justification is required (minimum 50 characters)"

---

### Viewing Audit Logs

**Scenario:** No audit entries yet

**UI Treatment:**
- Empty state: "No audit entries yet"
- Message: "Changes to results will be logged here"

---

## Summary Table

| Edge Case | Handling Strategy |
|-----------|------------------|
| Empty data | Friendly message + CTA |
| Long names | Truncate + tooltip |
| Special chars | Full Unicode support |
| Extreme scores | Proper rounding & boundaries |
| Tied positions | Same rank, skip next |
| Network errors | Retry + local save |
| Permission errors | Clear message + redirect |
| File uploads | Validate size & type |
| Slow loading | Skeleton + progress |
| Concurrent edits | Last write wins + warning |

---

**Document Status:** Complete  
**Owner:** UX Designer  
**Last Updated:** 2026-01-05
