# Owner Requirements

## Functional Requirements (From ideas.md)

### 1. Custom Grading Scale
**Requirement:** Ability to define specific grade boundaries per department or level

**Details:**
- Support configurable grade boundaries (e.g., A=75-100, B=70-74, C=65-69, etc.)
- Allow different departments/levels to use different grading scales
- Example: Science department might use A=80-100, while Arts uses A=75-100
- Grade boundaries should be configurable by administrators
- System should automatically assign letter grades based on configured boundaries

**Priority:** P0 (Critical for MVP)

---

### 2. Auto Position Calculation
**Requirement:** System must automatically rank students within a class or subject based on their total scores

**Details:**
- Automatic ranking of students in each subject
- Automatic ranking of students overall (based on total/average scores)
- Handle tie scenarios (students with identical scores get the same position)
- Recalculate positions automatically when scores are updated
- Display position/rank clearly on report cards (e.g., "5th out of 45 students")

**Priority:** P0 (Critical for MVP)

---

### 3. Subject Weighting
**Requirement:** Support for different score weights

**Details:**
- Configurable percentage split between Continuous Assessment (CA) and Exams
- Example: CA=30%, Exam=70% (or any other split like CA=40%, Exam=60%)
- Different subjects may have different weighting rules
- System automatically calculates final score based on configured weightings
- Formula: Final Score = (CA × CA_Weight) + (Exam × Exam_Weight)

**Priority:** P0 (Critical for MVP)

---

### 4. PDF Result Export
**Requirement:** Generate clean, print-ready report cards for students to download

**Details:**
- Professional PDF format suitable for printing
- Include school logo/header
- Display all subjects with scores, grades, and positions
- Show overall performance summary (total, average, overall position)
- Include student details (name, class, term/session information)
- Downloadable by students/parents and administrators
- Consistent formatting and branding

**Priority:** P0 (Critical for MVP)

---

### 5. Term/Session History
**Requirement:** A robust archive to view and compare results from previous years or terms

**Details:**
- Store results for all past terms and academic sessions
- Allow users to select and view results from specific terms/sessions
- Compare performance across different terms (trend analysis)
- Historical data should remain accessible indefinitely
- Archive should be searchable by student, term, session, class, or subject

**Priority:** P1 (Important for MVP)

---

### 6. Admin Override
**Requirement:** High-level permission feature allowing administrators to manually adjust scores or settings if errors are found after submission

**Details:**
- Administrators can edit submitted results if errors are discovered
- Audit trail: log all manual adjustments (who, when, what changed)
- Teachers should be notified when their submitted scores are modified
- Override should be restricted to specific admin roles only
- Clear justification/reason field for each override

**Priority:** P1 (Important for MVP)

---

### 7. User Experience (UX) and Accessibility
**Requirement:** Very good user experience and accessibility, with responsive design perfect for devices

**Details:**
- Responsive design: works seamlessly on desktop, tablet, and mobile devices
- Intuitive, easy-to-navigate interface requiring minimal training
- Accessibility compliance: WCAG 2.1 AA standards
- Fast loading times even with large datasets
- Clear error messages and validation feedback
- Consistent visual design and branding
- Support for keyboard navigation
- Readable fonts and appropriate contrast ratios

**Priority:** P0 (Critical for MVP)

---

## Non-Functional Requirements

### Security and Privacy
- Secure authentication and authorization
- Role-based access control (Admin, Teacher, Student/Parent)
- Encryption of sensitive student data
- Protection against common web vulnerabilities (SQL injection, XSS, CSRF)

**Priority:** P0 (Critical for MVP)

---

### Performance
- Handle up to 10,000 students per school without performance degradation
- Report card generation should complete within 5 seconds
- Grade entry should be near-instantaneous
- System should remain responsive during peak usage (end of term)

**Priority:** P0 (Critical for MVP)

---

### Reliability
- 99.5% uptime during academic terms
- Daily automated backups of all data
- Ability to recover from failures without data loss
- Clear error handling and user-friendly error messages

**Priority:** P0 (Critical for MVP)

---

### Usability
- Teachers should be able to enter grades for a class of 40 students in under 15 minutes
- New users should be able to navigate basic functions without training
- Maximum 3 clicks to access any primary function
- Consistent UI patterns across all pages

**Priority:** P0 (Critical for MVP)

---

## Owner Constraints for Later Stages

### Budget Constraints
- Development should be cost-effective (optimize LLM token usage)
- Prefer open-source technologies to minimize licensing costs
- Cloud infrastructure should support pay-as-you-grow pricing

### Timeline Constraints
- MVP should be achievable within reasonable development timeline
- Focus on core features first, defer nice-to-have features to post-MVP

### Technology Constraints
- Must work across modern browsers (Chrome, Firefox, Safari, Edge)
- Should support users with varying levels of technical proficiency
- Avoid dependencies on proprietary or expensive third-party services where possible

### Scope Constraints (Explicit Exclusions for MVP)
- No integration with existing school management systems (manual data import acceptable)
- No real-time collaboration features (asynchronous workflow sufficient)
- No offline-first mobile apps (responsive web design sufficient)
- No AI-powered grading or suggestions (manual grade entry only)
- No financial/payment processing features
- No attendance tracking or other school management features beyond results

---

**Owner:** Business Owner  
**Attendances:** Product Manager  
**Last Updated:** 2025-12-30
