# Functional Requirements
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2025-12-30  
**Owner:** Product Manager

---

## Table of Contents
1. [Authentication & User Management](#1-authentication--user-management) (FR-001 to FR-010)
2. [School & Academic Setup](#2-school--academic-setup) (FR-011 to FR-020)
3. [Grading Configuration](#3-grading-configuration) (FR-021 to FR-030)
4. [Grade Entry & Management](#4-grade-entry--management) (FR-031 to FR-045)
5. [Calculation Engine](#5-calculation-engine) (FR-046 to FR-055)
6. [Report Card Generation](#6-report-card-generation) (FR-056 to FR-065)
7. [Result Viewing & Access](#7-result-viewing--access) (FR-066 to FR-075)
8. [Admin Tools & Workflow](#8-admin-tools--workflow) (FR-076 to FR-085)
9. [User Experience & Accessibility](#9-user-experience--accessibility) (FR-086 to FR-095)

---

## 1. Authentication & User Management

### FR-001: User Registration (Admin-Created Accounts)

**User Story:** As an Administrator, I want to create user accounts for teachers, students, and parents, so that they can access the system with appropriate permissions.

**Description:**  
Administrators can create user accounts and assign roles (Admin, Teacher, Student, Parent). The system generates initial credentials and sends them to users.

**Behavior:**
- Admin navigates to User Management → Add New User
- Admin enters user details: Full Name, Email, Role, Class/Department (if applicable)
- System validates email uniqueness and format
- System generates temporary password
- System creates user account with specified role
- System sends credentials via email (or displays for manual sharing)
- Parent accounts are linked to specific student account(s)

**Acceptance Criteria:**
- [ ] Admin can create accounts for all 4 roles (Admin, Teacher, Student, Parent)
- [ ] Email addresses must be unique across the system
- [ ] Temporary password must be at least 8 characters with mixed case and numbers
- [ ] Parent accounts must be linkable to 1 or more student accounts
- [ ] Success confirmation message displayed after account creation
- [ ] Invalid email format triggers validation error

**Priority:** P0  
**Dependencies:** None

---

### FR-002: User Login

**User Story:** As a User (any role), I want to log in securely with my credentials, so that I can access my authorized features.

**Description:**  
Users log in using email and password. System validates credentials and creates a session.

**Behavior:**
- User navigates to login page
- User enters email and password
- System validates credentials against database
- If valid: System creates session and redirects to role-appropriate dashboard
- If invalid: System displays error message "Invalid email or password"
- System locks account after 5 failed login attempts
- System requires CAPTCHA after 3 failed attempts

**Acceptance Criteria:**
- [ ] Valid credentials grant access to appropriate dashboard
- [ ] Invalid credentials display generic error (don't reveal which field is wrong)
- [ ] Account locked after 5 failed attempts within 15 minutes
- [ ] CAPTCHA appears after 3 failed attempts
- [ ] Session expires after 4 hours of inactivity
- [ ] Password field is masked (hidden characters)

**Priority:** P0  
**Dependencies:** FR-001

---

### FR-003: Password Reset

**User Story:** As a User, I want to reset my forgotten password, so that I can regain access to my account.

**Description:**  
Users can request password reset via email link.

**Behavior:**
- User clicks "Forgot Password" on login page
- User enters email address
- System sends password reset link to email (if account exists)
- Link expires after 1 hour
- User clicks link and sets new password
- New password must meet complexity requirements (8+ chars, mixed case, number)
- System invalidates old password and creates session

**Acceptance Criteria:**
- [ ] Password reset link sent to valid email addresses
- [ ] Link expires after 1 hour
- [ ] New password meets complexity requirements
- [ ] User can log in immediately with new password
- [ ] System doesn't reveal whether email exists (security)

**Priority:** P0  
**Dependencies:** FR-002

---

### FR-004: Password Change

**User Story:** As a User, I want to change my password while logged in, so that I can maintain account security.

**Description:**  
Logged-in users can change their password.

**Behavior:**
- User navigates to Profile → Change Password
- User enters current password, new password, and confirmation
- System validates current password
- System validates new password complexity
- System validates new password matches confirmation
- System updates password and shows success message

**Acceptance Criteria:**
- [ ] Current password must be correct to proceed
- [ ] New password must meet complexity requirements
- [ ] New password must match confirmation field
- [ ] Success message displayed after change
- [ ] User remains logged in after password change

**Priority:** P0  
**Dependencies:** FR-002

---

### FR-005: Role-Based Access Control (RBAC)

**User Story:** As a System, I must enforce role-based permissions, so that users can only access features appropriate to their role.

**Description:**  
System enforces permissions based on user roles.

**Permissions by Role:**

**Administrator:**
- Full access to all features
- User management (create, edit, deactivate users)
- School configuration
- Grading scale configuration
- Result approval/rejection
- Result override (post-publication)
- View all results across school

**Teacher:**
- Grade entry for assigned classes/subjects only
- View results for assigned classes only
- Edit own profile
- Cannot access user management or school configuration

**Student:**
- View own results only
- Download own report cards
- Edit own profile (limited fields)
- Cannot access grade entry or admin features

**Parent:**
- View linked student(s) results only
- Download linked student(s) report cards
- Cannot access any management features

**Acceptance Criteria:**
- [ ] Each role sees only authorized menu items
- [ ] Unauthorized access attempts redirect to error page
- [ ] API endpoints validate user role before processing requests
- [ ] Teachers cannot view other teachers' classes
- [ ] Students/Parents cannot access admin or teacher features

**Priority:** P0  
**Dependencies:** FR-001, FR-002

---

### FR-006: User Profile Management

**User Story:** As a User, I want to view and edit my profile information, so that my details are up to date.

**Description:**  
Users can view and edit their profile details (limited by role).

**Editable Fields by Role:**
- **All Roles:** Profile photo, phone number, display name
- **Admin/Teacher:** Bio/description
- **Student:** None additional (name changes via admin only)
- **Parent:** None additional

**Non-Editable Fields:**
- Email address (requires admin approval to change)
- Role
- Account creation date

**Acceptance Criteria:**
- [ ] Users can upload profile photo (max 2MB, JPG/PNG only)
- [ ] Changes save successfully with confirmation message
- [ ] Email change requires admin approval (not directly editable)
- [ ] Invalid phone number format triggers validation error

**Priority:** P0  
**Dependencies:** FR-002

---

### FR-007: Session Management

**User Story:** As a System, I must manage user sessions securely, so that unauthorized access is prevented.

**Description:**  
System creates and manages user sessions with timeout and logout capabilities.

**Behavior:**
- Session created upon successful login
- Session stores: User ID, Role, Login timestamp, Last activity timestamp
- Session expires after 4 hours of inactivity
- User can manually logout (destroys session)
- Warning displayed 5 minutes before timeout
- Concurrent sessions allowed (max 3 devices per user)

**Acceptance Criteria:**
- [ ] Session expires after 4 hours of inactivity
- [ ] Logout button destroys session immediately
- [ ] Warning displayed 5 minutes before auto-logout
- [ ] User can extend session from warning dialog
- [ ] Expired session redirects to login page
- [ ] Max 3 concurrent sessions per user

**Priority:** P0  
**Dependencies:** FR-002

---

### FR-008: User Deactivation

**User Story:** As an Administrator, I want to deactivate user accounts (not delete), so that former users cannot access the system while preserving historical data.

**Description:**  
Admins can deactivate (suspend) user accounts. Deactivated accounts cannot log in but historical data remains intact.

**Behavior:**
- Admin navigates to User Management
- Admin selects user and clicks "Deactivate"
- System confirms action
- System sets user status to "Inactive"
- Deactivated user cannot log in (receives "Account inactive" message)
- Historical data (grades entered, results) remain unchanged
- Admin can reactivate account later

**Acceptance Criteria:**
- [ ] Deactivated users cannot log in
- [ ] Historical grades/results remain in system
- [ ] Deactivation is reversible (can be reactivated)
- [ ] Deactivation logs timestamp and admin who performed action
- [ ] Active sessions for deactivated user are terminated

**Priority:** P0  
**Dependencies:** FR-001

---

### FR-009: Bulk User Import (CSV)

**User Story:** As an Administrator, I want to import multiple users from a CSV file, so that I can onboard an entire school efficiently.

**Description:**  
Admin can upload CSV file with user details to create multiple accounts at once.

**CSV Format:**
```
Full Name, Email, Role, Class/Grade (optional), Parent Email (for students, optional)
```

**Behavior:**
- Admin navigates to User Management → Bulk Import
- Admin uploads CSV file
- System validates CSV format and data
- System displays preview of users to be created
- System shows validation errors (duplicate emails, invalid roles, etc.)
- Admin confirms import
- System creates accounts and generates passwords
- System provides summary report (X created, Y failed with reasons)

**Acceptance Criteria:**
- [ ] CSV file must follow specified format
- [ ] Duplicate emails in CSV or database are rejected
- [ ] Invalid roles trigger validation error
- [ ] Preview shows all users before final import
- [ ] Summary report shows success/failure count
- [ ] Failed rows downloadable with error reasons

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-001

---

### FR-010: Audit Trail for User Actions

**User Story:** As an Administrator, I want to see an audit log of sensitive user actions, so that I can track accountability.

**Description:**  
System logs critical user actions with timestamp, user, and action details.

**Logged Actions:**
- User account creation/deactivation
- Password resets
- Role changes
- Result overrides
- Grading configuration changes

**Log Fields:**
- Timestamp
- User ID and name
- Action type
- Details (what changed)
- IP address

**Acceptance Criteria:**
- [ ] All sensitive actions are logged automatically
- [ ] Logs are immutable (cannot be edited or deleted)
- [ ] Admin can view logs filtered by user, action type, date range
- [ ] Logs include sufficient detail to understand what happened
- [ ] Logs retained for minimum 2 years

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-001, FR-002

---

## 2. School & Academic Setup

### FR-011: School Profile Configuration

**User Story:** As an Administrator, I want to configure my school's profile, so that it appears correctly on report cards and throughout the system.

**Description:**  
Admin sets up school profile including name, logo, contact details, and branding.

**Configurable Fields:**
- School name
- School logo (uploaded image)
- Address
- Phone number
- Email
- Website
- School motto/tagline (optional)

**Behavior:**
- Admin navigates to School Settings → Profile
- Admin enters/uploads school details
- System validates logo file (max 5MB, JPG/PNG only, recommended 500x500px)
- Admin saves changes
- Logo appears on report cards and throughout UI

**Acceptance Criteria:**
- [ ] School name appears in header/footer of all pages
- [ ] Logo displays on report cards and login page
- [ ] Contact details accessible from About/Contact page
- [ ] Logo file size validated (max 5MB)
- [ ] Logo aspect ratio maintained (no distortion)

**Priority:** P0  
**Dependencies:** FR-001

---

### FR-012: Academic Year Management

**User Story:** As an Administrator, I want to create and manage academic years, so that results are organized by year.

**Description:**  
Admin creates academic years (e.g., 2024-2025, 2025-2026) with start and end dates.

**Behavior:**
- Admin navigates to School Settings → Academic Years
- Admin clicks "Add Academic Year"
- Admin enters year name (e.g., "2024-2025") and start/end dates
- System validates dates (start < end, no overlapping years)
- Admin marks one year as "Active" (current year)
- Only one year can be active at a time

**Acceptance Criteria:**
- [ ] Academic year name is unique
- [ ] Start date must be before end date
- [ ] No overlapping academic years allowed
- [ ] Only one year marked as "Active" at a time
- [ ] System defaults to active year in dropdowns

**Priority:** P0  
**Dependencies:** FR-011

---

### FR-013: Term/Session Management

**User Story:** As an Administrator, I want to create terms within an academic year, so that results are organized by term.

**Description:**  
Admin creates terms/sessions within each academic year (e.g., Term 1, Term 2, Term 3).

**Behavior:**
- Admin navigates to Academic Year detail page
- Admin clicks "Add Term"
- Admin enters term name (e.g., "Term 1"), start date, end date
- System validates dates (within academic year boundaries, no overlap)
- Admin marks one term as "Active" (current term)
- Results are associated with specific term

**Acceptance Criteria:**
- [ ] Term dates must fall within academic year dates
- [ ] Terms within same year cannot overlap
- [ ] Only one term marked as "Active" per academic year
- [ ] Term name is required and unique within academic year
- [ ] System defaults to active term in grade entry

**Priority:** P0  
**Dependencies:** FR-012

---

### FR-014: Class/Grade Level Setup

**User Story:** As an Administrator, I want to create classes/grade levels, so that students can be organized.

**Description:**  
Admin creates classes (e.g., Grade 7A, Grade 8B, Year 10 Science Class).

**Behavior:**
- Admin navigates to School Settings → Classes
- Admin clicks "Add Class"
- Admin enters class name, grade level, academic year
- Admin optionally assigns a class teacher
- Students are assigned to classes during account creation or later

**Acceptance Criteria:**
- [ ] Class name is unique within academic year
- [ ] Class must belong to an academic year
- [ ] Class can have optional class teacher assigned
- [ ] Class can be edited or deactivated
- [ ] Deactivating class doesn't delete historical data

**Priority:** P0  
**Dependencies:** FR-012

---

### FR-015: Subject Configuration

**User Story:** As an Administrator, I want to configure subjects per grade level, so that teachers can enter grades for appropriate subjects.

**Description:**  
Admin defines subjects available for each grade level/class.

**Behavior:**
- Admin navigates to School Settings → Subjects
- Admin clicks "Add Subject"
- Admin enters subject name (e.g., "Mathematics", "English", "Biology")
- Admin selects applicable grade levels/classes
- Admin optionally sets default weighting (CA %, Exam %)
- Subject can be assigned to multiple classes

**Acceptance Criteria:**
- [ ] Subject name is unique within school
- [ ] Subject can be assigned to multiple classes
- [ ] Subject has optional default weighting (can be overridden per class)
- [ ] Deactivating subject doesn't delete historical grades
- [ ] Subject list appears in grade entry for assigned classes

**Priority:** P0  
**Dependencies:** FR-014

---

### FR-016: Teacher-Class-Subject Assignment

**User Story:** As an Administrator, I want to assign teachers to specific classes and subjects, so that they can enter grades only for their assigned areas.

**Description:**  
Admin assigns teachers to teach specific subjects in specific classes.

**Behavior:**
- Admin navigates to Teacher Management
- Admin selects teacher
- Admin assigns class + subject combinations (e.g., Grade 7A Mathematics, Grade 7B Mathematics)
- Teacher can only enter grades for assigned combinations
- Admin can remove assignments

**Acceptance Criteria:**
- [ ] Teacher can be assigned multiple class-subject combinations
- [ ] Teacher sees only assigned combinations in grade entry
- [ ] Assignment can be added/removed at any time
- [ ] Removing assignment doesn't delete historical grades
- [ ] Teacher receives notification when new assignment is added

**Priority:** P0  
**Dependencies:** FR-014, FR-015

---

### FR-017: Student Enrollment in Classes

**User Story:** As an Administrator, I want to enroll students in classes, so that they appear in grade entry rosters.

**Description:**  
Admin assigns students to classes for each academic year/term.

**Behavior:**
- Admin navigates to Class detail page
- Admin clicks "Enroll Students"
- Admin selects students from list or uploads CSV
- Students are enrolled in class
- Enrolled students appear in teacher's grade entry roster
- Students can be moved between classes

**Acceptance Criteria:**
- [ ] Student can be enrolled in one class per academic year
- [ ] Student can be moved to different class mid-year
- [ ] Historical grades remain when student moves class
- [ ] Bulk enrollment via CSV supported
- [ ] Enrolled students automatically appear in grade entry

**Priority:** P0  
**Dependencies:** FR-014, FR-001

---

### FR-018: Academic Calendar View

**User Story:** As a User, I want to view the academic calendar, so that I know important dates.

**Description:**  
System displays academic year, terms, and important dates in calendar view.

**Behavior:**
- User navigates to Academic Calendar
- System displays:
  - Current academic year
  - Terms with start/end dates
  - Current term highlighted
  - Grade submission deadlines (if set)
  - Result publication dates (if set)

**Acceptance Criteria:**
- [ ] Calendar shows current academic year by default
- [ ] Users can switch to previous/future academic years
- [ ] Current term is clearly highlighted
- [ ] Important dates are color-coded
- [ ] Mobile-responsive calendar view

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-012, FR-013

---

### FR-019: Class Roster Export

**User Story:** As a Teacher, I want to export my class roster, so that I can use it offline or in other applications.

**Description:**  
Teachers can export list of students in their classes to CSV.

**Behavior:**
- Teacher navigates to Class view
- Teacher clicks "Export Roster"
- System generates CSV with columns: Student Name, ID, Email, Class
- File downloads automatically

**Acceptance Criteria:**
- [ ] CSV includes all enrolled students in class
- [ ] CSV format is standard and opens in Excel
- [ ] Export includes student ID, name, email, class
- [ ] Export respects teacher's assigned classes (no access to other classes)
- [ ] File naming: [ClassName]_Roster_[Date].csv

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-016, FR-017

---

### FR-020: School Settings Validation

**User Story:** As a System, I must validate school configuration before allowing grade entry, so that data integrity is maintained.

**Description:**  
System checks that minimum configuration is complete before teachers can enter grades.

**Required Configuration:**
- School profile (name, logo)
- At least one academic year
- At least one active term
- At least one class
- At least one subject
- Grading scale defined

**Behavior:**
- If configuration incomplete, system shows warning on dashboard
- Grade entry is disabled until configuration is complete
- Admin receives checklist of missing items
- System guides admin through setup wizard (optional)

**Acceptance Criteria:**
- [ ] Grade entry disabled if configuration incomplete
- [ ] Clear error message indicates missing items
- [ ] Admin dashboard shows configuration status
- [ ] Setup wizard available for first-time setup
- [ ] Teachers see "Configuration in progress" message if setup incomplete

**Priority:** P0  
**Dependencies:** FR-011 through FR-016

---

## 3. Grading Configuration

### FR-021: Grading Scale Definition (School-Wide)

**User Story:** As an Administrator, I want to define a school-wide grading scale, so that letter grades are assigned consistently.

**Description:**  
Admin defines mapping of score ranges to letter grades (e.g., A=75-100, B=70-74, C=65-69, etc.).

**Behavior:**
- Admin navigates to School Settings → Grading Scales
- Admin clicks "Add Grading Scale"
- Admin enters scale name (e.g., "Standard Scale")
- Admin defines grade boundaries:
  - Grade A: Min 75, Max 100
  - Grade B: Min 70, Max 74
  - Grade C: Min 65, Max 69
  - Grade D: Min 60, Max 64
  - Grade F: Min 0, Max 59
- System validates no gaps or overlaps
- Admin saves scale
- Scale becomes available for department/level assignment

**Acceptance Criteria:**
- [ ] Score ranges must not have gaps (every possible score 0-100 is covered)
- [ ] Score ranges must not overlap
- [ ] Grade letters can be customized (A, B, C or Distinction, Merit, Pass, etc.)
- [ ] At least one grading scale must be defined
- [ ] Scale can be edited (affects future grades only, not historical)

**Priority:** P0  
**Dependencies:** FR-011

---

### FR-022: Department/Level-Specific Grading Scales

**User Story:** As an Administrator, I want to assign different grading scales to different departments or grade levels, so that institutional policies are respected.

**Description:**  
Admin can assign different grading scales to different departments/classes.

**Example:**
- Science Department: A=80-100, B=70-79, C=60-69
- Arts Department: A=75-100, B=65-74, C=55-64

**Behavior:**
- Admin creates multiple grading scales (FR-021)
- Admin navigates to Department/Class settings
- Admin assigns appropriate grading scale
- System applies correct scale during grade calculation
- Reports show which scale was used

**Acceptance Criteria:**
- [ ] Multiple grading scales can exist simultaneously
- [ ] Each class/department can have its own scale
- [ ] System applies correct scale automatically during calculations
- [ ] Report cards indicate which scale was used
- [ ] Default scale applies if no specific scale assigned

**Priority:** P0  
**Dependencies:** FR-021, FR-014

---

### FR-023: Subject Weighting Configuration

**User Story:** As an Administrator, I want to configure subject weighting (CA vs Exam percentages), so that final scores are calculated correctly.

**Description:**  
Admin defines percentage contribution of Continuous Assessment (CA) vs Exam to final score.

**Behavior:**
- Admin navigates to Subject settings
- Admin sets weighting for each subject:
  - CA Weight: 30%
  - Exam Weight: 70%
  - (Total must equal 100%)
- System validates total = 100%
- Different subjects can have different weightings
- Formula applied: Final Score = (CA × 0.30) + (Exam × 0.70)

**Acceptance Criteria:**
- [ ] CA% + Exam% must equal 100%
- [ ] Weighting can be different per subject
- [ ] Common presets available (30/70, 40/60, 50/50)
- [ ] Weighting displayed during grade entry
- [ ] Changes to weighting affect future calculations only (not historical)

**Priority:** P0  
**Dependencies:** FR-015

---

### FR-024: Grading Scale Preview

**User Story:** As an Administrator, I want to preview how a grading scale will assign grades, so that I can verify correctness before activation.

**Description:**  
Admin can preview grading scale with sample scores.

**Behavior:**
- Admin views grading scale detail page
- System shows table:
  - Score Range | Letter Grade | Sample Score
  - 75-100 | A | 85 → A
  - 70-74 | B | 72 → B
  - etc.
- Admin can test with custom scores
- Preview shows grade assignment for any score

**Acceptance Criteria:**
- [ ] Preview table shows all grade boundaries
- [ ] Admin can input test scores to see grade assignment
- [ ] Preview updates in real-time as boundaries change
- [ ] Visual indicator shows where score falls in range

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-021

---

### FR-025: Grading Policy Documentation

**User Story:** As an Administrator, I want to document grading policies, so that teachers and parents understand the system.

**Description:**  
Admin can add text description of grading policies.

**Behavior:**
- Admin navigates to School Settings → Grading Policy
- Admin enters policy description (rich text editor)
- Policy includes:
  - Grading scale explanation
  - Weighting rationale
  - How positions are calculated
  - Rounding rules
  - Tie-breaking rules
- Policy visible to all users
- Policy appears on report cards (optional footer)

**Acceptance Criteria:**
- [ ] Rich text editor supports formatting (bold, lists, etc.)
- [ ] Policy accessible from Help/About section
- [ ] Policy can optionally appear on report cards
- [ ] Policy can be updated at any time
- [ ] Change history tracked (who, when)

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-021

---

### FR-026: Grade Rounding Rules

**User Story:** As an Administrator, I want to define rounding rules for final scores, so that calculations are consistent.

**Description:**  
Admin specifies how decimal scores are rounded.

**Options:**
- Round to nearest integer (85.5 → 86)
- Round down (floor: 85.9 → 85)
- Round up (ceiling: 85.1 → 86)
- Keep 1 decimal place (85.67 → 85.7)
- Keep 2 decimal places (85.674 → 85.67)

**Behavior:**
- Admin selects rounding rule in Grading Configuration
- Rule applies to all final score calculations
- Rounding happens after weighting calculation
- Rounded score used for grade assignment and position calculation

**Acceptance Criteria:**
- [ ] Rounding rule applies consistently across all calculations
- [ ] Rule documented in grading policy
- [ ] Report cards show rounded scores
- [ ] Unrounded scores stored in database for accuracy

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-021

---

### FR-027: Minimum Pass Score Configuration

**User Story:** As an Administrator, I want to define minimum pass score, so that students below threshold are clearly identified.

**Description:**  
Admin sets minimum score required to pass (e.g., 40, 50, 60).

**Behavior:**
- Admin sets "Minimum Pass Score" (e.g., 50)
- Scores below minimum marked as "Failed" on reports
- Failed subjects highlighted in red on report card
- Overall pass/fail status calculated (pass all subjects to pass overall)

**Acceptance Criteria:**
- [ ] Minimum pass score configurable (default 50)
- [ ] Failed subjects clearly marked on report cards
- [ ] Overall status shown (Passed / Failed)
- [ ] Pass rate statistics available to admin
- [ ] Can be set globally or per subject

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-021

---

### FR-028: Grade Promotion Criteria

**User Story:** As an Administrator, I want to define criteria for student promotion to next grade, so that decisions are consistent.

**Description:**  
Admin defines rules for grade promotion (e.g., must pass minimum X subjects, minimum average score Y).

**Behavior:**
- Admin sets promotion criteria:
  - Must pass at least X subjects (e.g., 5 out of 8)
  - Minimum overall average (e.g., 50%)
  - Required subjects that must be passed (e.g., Math, English)
- System evaluates each student against criteria
- Promotion status shown on report (Promoted / Not Promoted / Conditional)

**Acceptance Criteria:**
- [ ] Promotion criteria configurable per grade level
- [ ] System auto-calculates promotion status
- [ ] Status shown on report card
- [ ] Admin can override auto-calculation
- [ ] Promotion statistics available (% promoted)

**Priority:** P2 (Future)  
**Dependencies:** FR-021, FR-027

---

### FR-029: Grading Scale Import/Export

**User Story:** As an Administrator, I want to export/import grading scales, so that I can share configurations across schools.

**Description:**  
Admin can export grading scale configuration to JSON/CSV and import from file.

**Behavior:**
- Admin clicks "Export Grading Scale"
- System generates JSON file with all scale definitions
- Admin can import scale from file in another school instance
- Import validates format and prevents conflicts

**Acceptance Criteria:**
- [ ] Export includes all grade boundaries and weightings
- [ ] Import validates file format
- [ ] Import prevents duplicate scale names
- [ ] Import allows renaming during import
- [ ] Export file is human-readable (JSON format)

**Priority:** P2 (Future)  
**Dependencies:** FR-021

---

### FR-030: Grading Configuration Change Impact Analysis

**User Story:** As an Administrator, I want to understand the impact of changing grading configuration, so that I don't inadvertently affect existing results.

**Description:**  
Before saving grading configuration changes, system shows impact analysis.

**Behavior:**
- Admin modifies grading scale or weighting
- System calculates impact:
  - Number of students affected
  - Number of grade changes (if applied retroactively)
  - Number of position changes
- Admin chooses:
  - Apply to future grades only (recommended)
  - Apply retroactively (requires justification and confirmation)
- System logs configuration change

**Acceptance Criteria:**
- [ ] Impact analysis shows before confirmation
- [ ] Default is "future grades only"
- [ ] Retroactive application requires explicit confirmation
- [ ] Configuration changes logged in audit trail
- [ ] Affected students notified if grades change

**Priority:** P2 (Future)  
**Dependencies:** FR-021, FR-023

---

## 4. Grade Entry & Management

### FR-031: Grade Entry Interface (Individual Entry)

**User Story:** As a Teacher, I want to enter grades for my students easily, so that I can complete the task quickly.

**Description:**  
Teacher accesses grade entry form and enters CA and Exam scores for each student.

**Behavior:**
- Teacher navigates to Grade Entry
- Teacher selects Class, Subject, Term
- System displays roster of students (auto-populated from enrollment)
- For each student, teacher enters:
  - Continuous Assessment (CA) score (0-100)
  - Exam score (0-100)
- System validates scores are within range (0-100)
- System auto-calculates and displays:
  - Final Score (weighted average)
  - Letter Grade (based on grading scale)
  - Position (ranking within class)
- Teacher saves as "Draft" or "Submit for Approval"

**Acceptance Criteria:**
- [ ] Only assigned class-subject combinations appear in dropdown
- [ ] Student roster auto-populated from enrollment
- [ ] Scores must be 0-100 (decimals allowed)
- [ ] Final score, grade, and position auto-calculate in real-time
- [ ] "Save Draft" allows editing later
- [ ] "Submit" locks grades and sends to admin for approval
- [ ] Progress indicator shows X of Y students completed

**Priority:** P0  
**Dependencies:** FR-016, FR-017, FR-021, FR-023

---

### FR-032: Grade Entry Validation

**User Story:** As a System, I must validate grade entries, so that data quality is maintained.

**Description:**  
System validates grade entries before saving.

**Validation Rules:**
- Score must be numeric
- Score must be 0-100 (inclusive)
- Decimals allowed (up to 2 decimal places)
- Both CA and Exam scores required (unless subject has different config)
- No duplicate entries for same student-subject-term

**Behavior:**
- Real-time validation as teacher types
- Invalid entries highlighted in red
- Error message displayed below field
- Submit button disabled until all validations pass
- Bulk validation summary if multiple errors

**Acceptance Criteria:**
- [ ] Invalid scores show error message immediately
- [ ] Non-numeric input rejected
- [ ] Scores >100 or <0 rejected
- [ ] Decimals beyond 2 places rounded/rejected
- [ ] Submit disabled until all errors resolved
- [ ] Clear error messages (e.g., "Score must be between 0 and 100")

**Priority:** P0  
**Dependencies:** FR-031

---

### FR-033: Draft vs Submitted Status

**User Story:** As a Teacher, I want to save grades as draft before final submission, so that I can review and edit later.

**Description:**  
Grades can be saved in "Draft" or "Submitted" status.

**Draft Status:**
- Teacher can edit/delete anytime
- Not visible to students/parents
- Not included in admin approval queue
- Indicator shows "Draft" badge

**Submitted Status:**
- Locked from teacher editing (unless rejected by admin)
- Visible in admin approval queue
- Not yet visible to students/parents
- Indicator shows "Pending Approval" badge

**Behavior:**
- Teacher clicks "Save Draft" → status = Draft
- Teacher clicks "Submit for Approval" → status = Submitted, sends to admin queue
- Teacher can submit multiple class-subjects at once
- Confirmation dialog before submission

**Acceptance Criteria:**
- [ ] Draft grades can be edited/deleted by teacher
- [ ] Submitted grades locked from teacher editing
- [ ] Clear status indicator on grade entry page
- [ ] Teacher receives confirmation after submission
- [ ] Admin can see submitted grades in approval queue

**Priority:** P0  
**Dependencies:** FR-031

---

### FR-034: Bulk Grade Import (CSV/Excel)

**User Story:** As a Teacher, I want to import grades from a spreadsheet, so that I don't have to enter them manually.

**Description:**  
Teacher uploads CSV/Excel file with grades for bulk import.

**CSV Format:**
```
Student ID, Student Name, CA Score, Exam Score
S001, John Doe, 85, 90
S002, Jane Smith, 78, 88
```

**Behavior:**
- Teacher navigates to Grade Entry → Import
- Teacher selects Class, Subject, Term
- Teacher uploads CSV/Excel file
- System validates file format and data
- System shows preview with calculated final scores and grades
- System highlights validation errors (invalid scores, unknown students)
- Teacher confirms import
- Grades imported with "Draft" status

**Acceptance Criteria:**
- [ ] CSV and Excel (.xlsx) formats supported
- [ ] Student matched by ID or Name
- [ ] Unknown students flagged as errors
- [ ] Invalid scores flagged as errors
- [ ] Preview shows final calculated values
- [ ] Import creates draft grades (not auto-submitted)
- [ ] Failed rows downloadable with error reasons

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-031

---

### FR-035: Grade Entry Progress Tracking

**User Story:** As a Teacher, I want to see my grade entry progress, so that I know what's left to complete.

**Description:**  
System tracks and displays teacher's grade entry progress.

**Behavior:**
- Dashboard shows progress per class-subject:
  - Total students: 40
  - Grades entered (draft + submitted): 32
  - Remaining: 8
  - Progress bar: 80%
- Visual indicator: Green (100%), Yellow (50-99%), Red (<50%)
- Deadline countdown if deadline set
- Reminder notifications when deadline approaching

**Acceptance Criteria:**
- [ ] Progress calculated correctly (draft + submitted counts as entered)
- [ ] Progress bar updates in real-time
- [ ] Dashboard shows all assigned class-subjects
- [ ] Deadline displayed if set by admin
- [ ] Reminder sent 3 days before deadline

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-031

---

### FR-036: Grade Entry Deadline Management

**User Story:** As an Administrator, I want to set grade entry deadlines, so that results are processed on time.

**Description:**  
Admin sets deadlines for grade submission per term.

**Behavior:**
- Admin navigates to Term settings
- Admin sets "Grade Submission Deadline" date and time
- Teachers see deadline on grade entry page
- System sends reminders:
  - 7 days before deadline
  - 3 days before deadline
  - 1 day before deadline
- After deadline, teachers can still submit (soft deadline) with warning
- Admin can make deadline hard (no submission after deadline)

**Acceptance Criteria:**
- [ ] Deadline configurable per term
- [ ] Teachers notified at 7, 3, 1 days before deadline
- [ ] Deadline displayed prominently on grade entry page
- [ ] Submission after deadline shows warning
- [ ] Admin can enforce hard deadline (blocks submission)

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-013, FR-031

---

### FR-037: Edit Submitted Grades (Before Approval)

**User Story:** As a Teacher, I want to request edit access to submitted grades, so that I can correct errors before approval.

**Description:**  
Teacher can request to edit grades that are submitted but not yet approved.

**Behavior:**
- Teacher views submitted grades (status: Pending Approval)
- Teacher clicks "Request Edit"
- System sends request to admin with reason field
- Admin approves or rejects request
- If approved, grades revert to Draft status
- Teacher edits and re-submits

**Acceptance Criteria:**
- [ ] Teacher can request edit for submitted (not approved) grades only
- [ ] Reason field required for edit request
- [ ] Admin receives notification of edit request
- [ ] Admin can approve/reject with comments
- [ ] Approved request reverts grades to Draft
- [ ] Edit requests logged in audit trail

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-033

---

### FR-038: Grade Entry Comments/Remarks

**User Story:** As a Teacher, I want to add comments on individual student performance, so that context is provided beyond just scores.

**Description:**  
Teacher can add text remarks for each student-subject.

**Behavior:**
- Grade entry form includes "Remarks" text field per student
- Character limit: 500 characters
- Remarks appear on report card
- Common remarks available as quick-select templates:
  - "Excellent performance"
  - "Good progress"
  - "Needs improvement"
  - "Exceptional effort"
- Teacher can customize or type free-form text

**Acceptance Criteria:**
- [ ] Remarks field available for each student
- [ ] Character limit: 500
- [ ] Quick-select templates available
- [ ] Remarks appear on report card
- [ ] Remarks optional (not required)
- [ ] Remarks saved with Draft and Submitted grades

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-031

---

### FR-039: View Class Performance Summary

**User Story:** As a Teacher, I want to see class performance statistics, so that I can understand overall performance.

**Description:**  
After grade entry, teacher can view class statistics.

**Statistics Shown:**
- Highest score in class
- Lowest score in class
- Class average
- Pass rate (% above minimum pass score)
- Grade distribution (how many A's, B's, C's, etc.)

**Behavior:**
- Teacher views class-subject grades
- System calculates and displays statistics
- Visual charts: Bar chart for grade distribution, histogram for score distribution
- Statistics update in real-time as grades entered

**Acceptance Criteria:**
- [ ] Statistics calculated correctly
- [ ] Visual charts clear and readable
- [ ] Statistics shown for submitted grades only (not draft)
- [ ] Class average rounded to 2 decimal places
- [ ] Responsive design (works on mobile)

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-031

---

### FR-040: Grade Entry Keyboard Shortcuts

**User Story:** As a Teacher, I want keyboard shortcuts for grade entry, so that I can work faster.

**Description:**  
Teacher can use keyboard to navigate and enter grades efficiently.

**Shortcuts:**
- Tab: Move to next field
- Shift+Tab: Move to previous field
- Enter: Save current row and move to next student
- Ctrl+S: Save all as draft
- Ctrl+Enter: Submit all for approval
- Escape: Cancel changes

**Acceptance Criteria:**
- [ ] All shortcuts work as described
- [ ] Shortcuts documented in help tooltip
- [ ] Tab order logical (CA → Exam → Next student)
- [ ] Enter saves current row automatically
- [ ] Ctrl+S shows confirmation message

**Priority:** P2 (Future)  
**Dependencies:** FR-031

---

### FR-041: Grade Entry Auto-Save

**User Story:** As a Teacher, I want grades to auto-save as I type, so that I don't lose work if browser crashes.

**Description:**  
System auto-saves draft grades every 30 seconds.

**Behavior:**
- As teacher types, changes stored in browser local storage
- Every 30 seconds, system syncs to server
- "Saving..." indicator appears during sync
- "All changes saved" indicator when complete
- If connection lost, changes saved locally and synced when reconnected
- On page reload, unsaved changes restored from local storage

**Acceptance Criteria:**
- [ ] Auto-save every 30 seconds
- [ ] Visual indicator shows save status
- [ ] Local storage used for offline capability
- [ ] Unsaved changes recovered after browser crash
- [ ] Teacher can disable auto-save (opt-in manual save only)

**Priority:** P2 (Future)  
**Dependencies:** FR-031

---

### FR-042: Grade Entry Multi-Class View

**User Story:** As a Teacher teaching same subject to multiple classes, I want to enter grades for all classes in one view, so that I can work more efficiently.

**Description:**  
Teacher can see grade entry for multiple classes side-by-side.

**Behavior:**
- Teacher selects Subject (e.g., Mathematics)
- System shows all assigned classes for that subject (Grade 7A, 7B, 7C)
- Tabbed interface or dropdown to switch between classes
- Progress shown for each class
- Teacher can work on one class at a time or switch as needed

**Acceptance Criteria:**
- [ ] All assigned classes for subject shown
- [ ] Easy navigation between classes
- [ ] Progress tracked per class
- [ ] Saves independent for each class
- [ ] No cross-contamination of grades between classes

**Priority:** P2 (Future)  
**Dependencies:** FR-031

---

### FR-043: Grade Entry Mobile Optimization

**User Story:** As a Teacher using mobile device, I want optimized grade entry interface, so that I can work on the go.

**Description:**  
Grade entry interface adapts for mobile screens.

**Behavior:**
- Mobile view: One student per screen (card format)
- Swipe left/right to navigate between students
- Large touch-friendly input fields
- Numeric keyboard auto-opens for score fields
- Progress indicator shows current position (Student 5 of 40)
- Same validation and calculation as desktop

**Acceptance Criteria:**
- [ ] Mobile-optimized layout (responsive design)
- [ ] Touch-friendly input fields (min 44px touch targets)
- [ ] Swipe gestures work smoothly
- [ ] Numeric keyboard for score fields
- [ ] All features available (save draft, submit)
- [ ] Works on iOS and Android browsers

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-031

---

### FR-044: Grade Entry Undo/Redo

**User Story:** As a Teacher, I want to undo/redo changes during grade entry, so that I can quickly fix mistakes.

**Description:**  
Teacher can undo last change or redo undone change.

**Behavior:**
- Ctrl+Z (or Undo button): Revert last change
- Ctrl+Y (or Redo button): Reapply undone change
- Undo history: Last 20 changes
- Clear history on submit (prevent undoing submitted grades)

**Acceptance Criteria:**
- [ ] Undo reverts last change correctly
- [ ] Redo reapplies undone change
- [ ] Undo history limited to 20 changes
- [ ] Undo/Redo buttons enabled/disabled appropriately
- [ ] Keyboard shortcuts work
- [ ] History cleared on submit

**Priority:** P2 (Future)  
**Dependencies:** FR-031

---

### FR-045: Grade Entry Duplicate Detection

**User Story:** As a System, I must prevent duplicate grade entries for the same student-subject-term, so that data integrity is maintained.

**Description:**  
System checks for duplicate entries before saving.

**Behavior:**
- When teacher attempts to enter grades for student-subject-term
- System checks if entry already exists
- If exists (draft or submitted), system shows warning:
  - "Grades already entered for this student in this subject for Term 1"
  - Options: "Edit Existing" or "Cancel"
- Teacher cannot create duplicate entry
- System prevents duplicates at database level (unique constraint)

**Acceptance Criteria:**
- [ ] Duplicate detection before save
- [ ] Clear warning message shown
- [ ] Teacher redirected to edit existing entry
- [ ] Database unique constraint prevents duplicates
- [ ] Works for both manual and bulk import

**Priority:** P0  
**Dependencies:** FR-031

---

## 5. Calculation Engine

### FR-046: Automatic Final Score Calculation

**User Story:** As a System, I must automatically calculate final scores using configured weighting, so that teachers don't have to do manual math.

**Description:**  
System calculates final score using formula: Final Score = (CA × CA_Weight) + (Exam × Exam_Weight).

**Example:**
- CA Score: 80
- Exam Score: 90
- CA Weight: 30%
- Exam Weight: 70%
- Final Score = (80 × 0.30) + (90 × 0.70) = 24 + 63 = 87

**Behavior:**
- Calculation triggered when both CA and Exam scores entered
- Calculation uses weighting configured for subject
- Result rounded according to configured rounding rule
- Final score displayed immediately (real-time calculation)
- Calculation logged for audit purposes

**Acceptance Criteria:**
- [ ] Formula applied correctly
- [ ] Calculation happens in real-time as scores entered
- [ ] Correct weighting used per subject
- [ ] Rounding rule applied
- [ ] Calculation result stored in database
- [ ] Manual override not allowed (ensures consistency)

**Priority:** P0  
**Dependencies:** FR-023, FR-026, FR-031

---

### FR-047: Automatic Letter Grade Assignment

**User Story:** As a System, I must automatically assign letter grades based on final scores and grading scale, so that grades are consistent.

**Description:**  
System maps final score to letter grade using configured grading scale.

**Example:**
- Final Score: 87
- Grading Scale: A=75-100, B=70-74, C=65-69
- Letter Grade: A

**Behavior:**
- After final score calculated, system looks up grading scale
- System finds range that contains final score
- System assigns corresponding letter grade
- Letter grade displayed immediately
- Correct grading scale used (department/level-specific if configured)

**Acceptance Criteria:**
- [ ] Correct grading scale used for student's class/department
- [ ] Letter grade assigned correctly based on score range
- [ ] Assignment happens in real-time
- [ ] Edge cases handled (score exactly on boundary)
- [ ] No manual override (ensures consistency)

**Priority:** P0  
**Dependencies:** FR-021, FR-022, FR-046

---

### FR-048: Automatic Position/Ranking Calculation (Per Subject)

**User Story:** As a System, I must automatically rank students within a class/subject based on final scores, so that positions are accurate and up-to-date.

**Description:**  
System calculates position (rank) for each student within their class for each subject.

**Ranking Logic:**
- Students ranked by final score (highest to lowest)
- Rank 1 = highest score, Rank 2 = 2nd highest, etc.
- Ties handled: Students with same score get same rank (e.g., two students with 85 both get Rank 3)
- Next rank after tie skips (if two students tied for Rank 3, next is Rank 5, not Rank 4)

**Behavior:**
- Position calculated after final score calculated
- Position recalculated when any student's score changes
- Position shown as "3rd out of 40 students"
- Position used for report cards and statistics

**Acceptance Criteria:**
- [ ] Position calculated correctly (highest score = 1st)
- [ ] Ties handled correctly (same score = same rank)
- [ ] Rank skipping after ties works correctly
- [ ] Position recalculates automatically when scores change
- [ ] Position shown in ordinal format (1st, 2nd, 3rd, 4th, etc.)
- [ ] Position calculated per class per subject (not across multiple classes)

**Priority:** P0  
**Dependencies:** FR-046

---

### FR-049: Automatic Overall Position Calculation

**User Story:** As a System, I must calculate overall position based on total/average across all subjects, so that students know their overall class rank.

**Description:**  
System calculates overall position for each student based on aggregate performance across all subjects.

**Calculation Method:**
- Option A: Total of all final scores across subjects
- Option B: Average of all final scores across subjects
- (Admin configures which method to use)

**Example (Total Method):**
- Student A: Math 85, English 90, Science 88 → Total = 263
- Student B: Math 80, English 92, Science 87 → Total = 259
- Overall Position: Student A = 1st, Student B = 2nd

**Behavior:**
- Overall position calculated after all subject grades entered
- Ties handled same as subject positions
- Overall position shown on report card
- Overall position recalculates if any subject score changes

**Acceptance Criteria:**
- [ ] Overall position calculated using configured method (total or average)
- [ ] Only students with all subjects graded are ranked (partial grades excluded)
- [ ] Ties handled correctly
- [ ] Recalculates automatically when subject scores change
- [ ] Overall position shown as "5th out of 45 students overall"

**Priority:** P0  
**Dependencies:** FR-046, FR-048

---

### FR-050: Tie Handling in Rankings

**User Story:** As a System, I must handle ties correctly when multiple students have the same score, so that rankings are fair.

**Description:**  
When multiple students have identical scores, they receive the same rank.

**Tie Handling Rules:**
- Students with same final score get same rank
- Next rank skips by number of tied students
- Example: Three students tied at 85 (all get Rank 2), next student is Rank 5 (not Rank 3)

**Display Format:**
- Report card shows: "2nd (tied)" when multiple students share rank
- Or: "2nd out of 40" without explicitly stating "tied"
- Admin configurable

**Acceptance Criteria:**
- [ ] Students with identical scores assigned same rank
- [ ] Rank skipping calculated correctly
- [ ] Tied ranks clearly indicated on reports (if configured)
- [ ] Tie handling consistent across subject and overall rankings
- [ ] No arbitrary tie-breaking (all ties are equal)

**Priority:** P0  
**Dependencies:** FR-048, FR-049

---

### FR-051: Real-Time Recalculation on Score Changes

**User Story:** As a System, I must recalculate all affected values when a score changes, so that data is always current.

**Description:**  
When teacher edits a score, system recalculates:
1. Final score (weighted average)
2. Letter grade
3. Subject position (for all students in class)
4. Overall position (for all students in class)

**Behavior:**
- Trigger: Teacher modifies CA or Exam score
- System recalculates final score for that student
- System recalculates positions for entire class (subject and overall)
- Changes reflected immediately in UI
- No manual refresh required

**Acceptance Criteria:**
- [ ] Final score recalculated immediately when CA or Exam changes
- [ ] Letter grade updates if final score crosses boundary
- [ ] All students' positions recalculated (not just edited student)
- [ ] UI updates in real-time (no page refresh)
- [ ] Performance acceptable even for large classes (100+ students)

**Priority:** P0  
**Dependencies:** FR-046, FR-047, FR-048, FR-049

---

### FR-052: Calculation Audit Trail

**User Story:** As a System, I must log all calculations with inputs and results, so that calculations can be audited and verified.

**Description:**  
System logs calculation details for auditing.

**Logged Information:**
- Timestamp
- Student ID
- Subject
- Input: CA score, Exam score, Weighting %
- Output: Final score, Letter grade, Position
- Grading scale used
- Calculation formula

**Behavior:**
- Every calculation logged automatically
- Admin can view calculation log for any student
- Log immutable (cannot be edited or deleted)
- Log helps troubleshoot disputes

**Acceptance Criteria:**
- [ ] All calculations logged automatically
- [ ] Log includes sufficient detail to reproduce calculation
- [ ] Admin can search/filter log by student, subject, date
- [ ] Log is immutable
- [ ] Log retained for minimum 2 years

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-046, FR-047, FR-048

---

### FR-053: Calculation Error Handling

**User Story:** As a System, I must handle calculation errors gracefully, so that system remains stable.

**Description:**  
System handles edge cases in calculations.

**Edge Cases:**
- Missing weighting configuration → Use default 50/50
- Missing grading scale → Cannot assign letter grade, show error
- Division by zero → Prevent with validation
- Negative scores → Prevented by input validation
- Scores >100 → Prevented by input validation
- Student with no scores → Exclude from rankings

**Behavior:**
- If error occurs, system logs error and shows user-friendly message
- Calculation doesn't fail silently
- Admin notified of calculation errors
- Fallback to safe defaults where possible

**Acceptance Criteria:**
- [ ] Missing weighting uses default
- [ ] Missing grading scale shows clear error
- [ ] Edge cases don't crash system
- [ ] Errors logged for admin review
- [ ] User-friendly error messages (not technical jargon)

**Priority:** P0  
**Dependencies:** FR-046, FR-047, FR-048

---

### FR-054: Calculation Performance Optimization

**User Story:** As a System, I must calculate efficiently even for large classes, so that users don't experience delays.

**Description:**  
System optimizes calculations for performance.

**Performance Targets:**
- Calculate final score: <100ms
- Calculate position for class of 100 students: <500ms
- Recalculate all positions when score changes: <1 second
- Batch calculation for entire school: <5 minutes

**Optimization Techniques:**
- Calculate on-demand (not precomputed)
- Cache grading scales and weightings
- Batch calculations where possible
- Use database indexes for lookups
- Async calculation for large batches

**Acceptance Criteria:**
- [ ] UI remains responsive during calculations
- [ ] No noticeable delay for classes <50 students
- [ ] Acceptable delay (<2 seconds) for classes up to 100 students
- [ ] Progress indicator for batch calculations
- [ ] Calculations don't block other operations

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-046 through FR-051

---

### FR-055: Calculation Formula Documentation

**User Story:** As a User, I want to understand how calculations are performed, so that results are transparent.

**Description:**  
System provides documentation explaining calculation formulas.

**Documentation Includes:**
- Final score formula: (CA × CA%) + (Exam × Exam%)
- Rounding rules
- Grading scale boundaries
- Position calculation logic (including tie handling)
- Overall position calculation method

**Behavior:**
- Documentation accessible from Help section
- Tooltip on report card shows calculation for specific student
- Example calculations provided
- Non-technical language

**Acceptance Criteria:**
- [ ] Formula documentation accessible to all users
- [ ] Examples provided for clarity
- [ ] Non-technical language used
- [ ] Tooltip shows calculation breakdown
- [ ] Documentation updated when configuration changes

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-046 through FR-051

---

## 6. Report Card Generation

### FR-056: PDF Report Card Generation

**User Story:** As a Student/Parent, I want to download a professional PDF report card, so that I have a print-ready academic record.

**Description:** System generates PDF report card with school branding, all subject results, and overall performance summary.

**Behavior:**
- User clicks "Download Report Card" button
- System generates PDF including: School logo/header, Student details, Term/session info, All subjects with CA, Exam, Final score, Grade, Position, Overall total/average/position, Class teacher's signature block
- PDF downloads automatically
- File named: [StudentName]_[Term]_ReportCard.pdf

**Acceptance Criteria:**
- [ ] PDF generated within 5 seconds
- [ ] Professional formatting suitable for printing
- [ ] School logo and branding included
- [ ] All subjects and scores displayed correctly
- [ ] Overall statistics included
- [ ] File size < 1MB

**Priority:** P0  
**Dependencies:** FR-046 through FR-051

---

### FR-057: Report Card Customization

**User Story:** As an Administrator, I want to customize report card layout and content, so that it matches school requirements.

**Description:** Admin configures report card template.

**Customizable Elements:**
- School logo position
- Header/footer text
- Color scheme
- Font styles
- Include/exclude class statistics
- Include/exclude remarks section
- Signature blocks

**Acceptance Criteria:**
- [ ] Admin can preview changes before saving
- [ ] Custom template applied to all generated reports
- [ ] Multiple templates supported (one per grade level)
- [ ] Template changes don't affect historical PDFs

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-056

---

### FR-058: Batch Report Card Generation

**User Story:** As an Administrator/Teacher, I want to generate report cards for entire class at once, so that I don't have to generate individually.

**Description:** System generates PDFs for all students in a class with one action.

**Behavior:**
- Admin/Teacher selects class and term
- Clicks "Generate All Report Cards"
- System generates PDFs for all students
- PDFs packaged in ZIP file for download
- Progress indicator shows generation status

**Acceptance Criteria:**
- [ ] All student PDFs generated correctly
- [ ] ZIP file contains all PDFs
- [ ] File naming: [ClassName]_Term[X]_ReportCards.zip
- [ ] Generation completes within 2 minutes for class of 50
- [ ] Progress indicator shows % complete

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-056

---

### FR-059: Report Card Watermarking

**User Story:** As an Administrator, I want to add watermarks to draft/unofficial reports, so that published vs draft reports are distinguishable.

**Description:** Reports not yet officially published show "DRAFT" or "UNOFFICIAL" watermark.

**Behavior:**
- If results not yet published by admin: PDF shows "DRAFT" watermark
- After publication: No watermark (official report)
- Watermark: Diagonal, semi-transparent, centered

**Acceptance Criteria:**
- [ ] Draft reports clearly marked with watermark
- [ ] Published reports have no watermark
- [ ] Watermark doesn't obscure important information
- [ ] Watermark configurable (text and opacity)

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-056

---

### FR-060: Report Card Digital Signatures

**User Story:** As an Administrator, I want report cards to include digital signatures/stamps, so that authenticity is verified.

**Description:** Reports include digital signature or stamp from school.

**Behavior:**
- Admin uploads authorized signature images
- System embeds signature on PDF
- QR code generated for verification (optional)
- QR code links to verification page

**Acceptance Criteria:**
- [ ] Signature image embedded correctly
- [ ] QR code scannable and verifies authenticity
- [ ] Verification page shows: Student name, Term, Issue date, Authenticity status
- [ ] Prevents PDF tampering detection (optional)

**Priority:** P2 (Future)  
**Dependencies:** FR-056

---

### FR-061-065: Additional Report Features

**FR-061:** Report card email delivery to parents  
**FR-062:** Report card printing queue management  
**FR-063:** Report card revision history  
**FR-064:** Multi-language report cards  
**FR-065:** Report card accessibility (screen reader compatible PDFs)

*(Detailed specs available on request)*

---

## 7. Result Viewing & Access

### FR-066: Student Result Viewing

**User Story:** As a Student, I want to view my results online, so that I can access them anytime without physical report card.

**Description:** Student logs in and views current and past results.

**Behavior:**
- Student navigates to "My Results"
- System displays latest term results by default
- Student can select different term from dropdown
- Results show: All subjects with CA, Exam, Final score, Grade, Position, Overall total, average, position
- Download PDF button available

**Acceptance Criteria:**
- [ ] Only published results visible (unpublished show "Coming soon")
- [ ] Results display correctly on mobile and desktop
- [ ] Historical terms accessible via dropdown
- [ ] PDF download button works
- [ ] Page load time < 2 seconds

**Priority:** P0  
**Dependencies:** FR-046 through FR-051

---

### FR-067: Parent Result Viewing

**User Story:** As a Parent, I want to view my child's results, so that I can monitor their academic progress.

**Description:** Parent logs in and views linked student(s) results.

**Behavior:**
- Parent account linked to one or more student accounts
- Parent navigates to "Children's Results"
- If multiple children: Select child from dropdown
- View same result details as student view
- Download PDF available

**Acceptance Criteria:**
- [ ] Parent can view all linked children's results
- [ ] Easy switching between multiple children
- [ ] Same features as student view (PDF download, term selection)
- [ ] Cannot view other students' results

**Priority:** P0  
**Dependencies:** FR-066

---

### FR-068: Result Comparison Across Terms

**User Story:** As a Student/Parent, I want to compare performance across multiple terms, so that I can see progress over time.

**Description:** System shows comparison view of results across terms.

**Behavior:**
- Select subject (e.g., Mathematics)
- System displays scores from all available terms in table or graph
- Visual indicators: Green (improved), Red (declined), Yellow (same)
- Trend line showing performance trajectory

**Acceptance Criteria:**
- [ ] Comparison works for individual subjects and overall performance
- [ ] Visual charts clear and easy to understand
- [ ] At least 2 terms required for comparison
- [ ] Mobile-friendly visualization

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-066

---

### FR-069: Class Statistics Display

**User Story:** As a Student/Parent, I want to see class statistics, so that I can understand performance in context.

**Description:** Results page shows class-level statistics.

**Statistics Shown:**
- Highest score in class
- Lowest score in class
- Class average
- Student's percentile rank

**Acceptance Criteria:**
- [ ] Statistics calculated correctly
- [ ] Anonymous (doesn't reveal other students' identities)
- [ ] Optional (admin can disable)
- [ ] Updates when results change

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-066

---

### FR-070-075: Additional Result Viewing Features

**FR-070:** Result notification (email/SMS when published)  
**FR-071:** Result sharing (share PDF via link)  
**FR-072:** Result printing from web interface  
**FR-073:** Result performance insights (AI-generated suggestions)  
**FR-074:** Result verification by external parties  
**FR-075:** Result export (CSV/Excel for personal records)

*(Detailed specs available on request)*

---

## 8. Admin Tools & Workflow

### FR-076: Result Approval Workflow

**User Story:** As an Administrator, I want to review and approve results before publication, so that quality is ensured.

**Description:** Admin reviews submitted results before making them visible to students/parents.

**Behavior:**
- Teacher submits results → Status: Pending Approval
- Admin navigates to Approval Queue
- Admin views submitted results by class/subject
- Admin can: Approve, Reject (with reason), or Request corrections
- Approved results → Status: Approved (ready for publication)
- Rejected results → Reverted to Draft, teacher notified

**Acceptance Criteria:**
- [ ] Approval queue shows all pending results
- [ ] Admin can approve/reject individually or in batch
- [ ] Rejection requires reason (sent to teacher)
- [ ] Approved results awaiting publication step
- [ ] Email notifications sent to teachers

**Priority:** P0  
**Dependencies:** FR-033

---

### FR-077: Result Publication Control

**User Story:** As an Administrator, I want to control when results become visible to students/parents, so that I can publish at the appropriate time.

**Description:** Admin publishes approved results to make them visible.

**Behavior:**
- Admin navigates to Publication Management
- Selects term and classes to publish
- Clicks "Publish Results"
- System makes results visible to students/parents
- System sends notifications (email/SMS if enabled)
- Publication logged with timestamp and admin

**Acceptance Criteria:**
- [ ] Only approved results can be published
- [ ] Publication can be done per class or school-wide
- [ ] Published results immediately visible to students/parents
- [ ] Notifications sent upon publication
- [ ] Publication is reversible (un-publish if needed)

**Priority:** P0  
**Dependencies:** FR-076

---

### FR-078: Admin Result Override

**User Story:** As an Administrator, I want to override published results if errors are discovered, so that corrections can be made.

**Description:** Admin can edit published results with justification and audit trail.

**Behavior:**
- Admin searches for student result
- Clicks "Override" button
- Modifies incorrect score(s)
- Enters mandatory justification
- System recalculates affected values
- System logs override in audit trail
- System notifies teacher of change
- Updated PDF regenerated automatically

**Acceptance Criteria:**
- [ ] Override requires justification (text field, 50-500 chars)
- [ ] All changes logged with admin, timestamp, old/new values
- [ ] Teacher notified via email
- [ ] Recalculation happens automatically
- [ ] Students see updated results immediately
- [ ] Audit trail immutable

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-077

---

### FR-079: School-Wide Reports

**User Story:** As an Administrator, I want to generate school-wide performance reports, so that I can analyze overall academic performance.

**Description:** Admin can generate analytics reports.

**Reports Available:**
- Pass/Fail rates by class/subject
- Grade distribution across school
- Top performers (by class, by subject, overall)
- Performance trends over multiple terms
- Teacher performance (classes they teach)

**Acceptance Criteria:**
- [ ] Reports generated within 30 seconds
- [ ] Export to PDF/Excel available
- [ ] Filters: Term, Class, Subject, Grade Level
- [ ] Visual charts included
- [ ] Scheduled reports (auto-generate monthly)

**Priority:** P1 (Post-MVP)  
**Dependencies:** FR-076, FR-077

---

### FR-080-085: Additional Admin Features

**FR-080:** Bulk result deletion (with confirmation)  
**FR-081:** Result archive management  
**FR-082:** Data export for external systems  
**FR-083:** Admin dashboard with KPIs  
**FR-084:** System health monitoring  
**FR-085:** User activity logs  

*(Detailed specs available on request)*

---

## 9. User Experience & Accessibility

### FR-086: Responsive Design

**User Story:** As a User, I want the system to work on any device, so that I can use it on desktop, tablet, or mobile.

**Description:** UI adapts to screen size.

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Acceptance Criteria:**
- [ ] All features accessible on mobile
- [ ] Touch-friendly buttons (min 44px)
- [ ] Readable text without zooming
- [ ] Horizontal scrolling not required
- [ ] Works on iOS and Android browsers

**Priority:** P0  
**Dependencies:** None

---

### FR-087: WCAG 2.1 AA Compliance

**User Story:** As a User with disabilities, I want the system to be accessible, so that I can use it independently.

**Description:** System meets WCAG 2.1 Level AA standards.

**Requirements:**
- Keyboard navigation support (no mouse required)
- Screen reader compatibility
- Sufficient color contrast (4.5:1 for text)
- Alt text for images
- Form labels and ARIA attributes
- Focus indicators visible
- Skip navigation links

**Acceptance Criteria:**
- [ ] Passes automated accessibility tests (WAVE, axe)
- [ ] Keyboard navigation works for all features
- [ ] Screen reader announces content correctly
- [ ] Color contrast ratios meet 4.5:1 minimum
- [ ] Forms have proper labels and error messages

**Priority:** P0  
**Dependencies:** None

---

### FR-088: Loading States and Feedback

**User Story:** As a User, I want to see clear feedback when system is processing, so that I know the system is working.

**Description:** System shows loading indicators and progress feedback.

**Behavior:**
- Button shows spinner during processing
- Page-level loader for navigation
- Progress bars for long operations (bulk import, batch PDF generation)
- Success/error toasts after actions
- Estimated time remaining for long tasks

**Acceptance Criteria:**
- [ ] Loading indicators appear within 300ms
- [ ] Users know system is processing (not frozen)
- [ ] Long operations show progress percentage
- [ ] Success/error messages clear and helpful
- [ ] Timeout messages if operation fails

**Priority:** P0  
**Dependencies:** None

---

### FR-089: Error Handling and Messages

**User Story:** As a User, I want clear error messages when something goes wrong, so that I know how to fix it.

**Description:** System provides helpful error messages.

**Error Message Guidelines:**
- Explain what went wrong
- Suggest how to fix
- Avoid technical jargon
- Be polite and supportive

**Examples:**
- ❌ Bad: "Error 500: Internal Server Error"
- ✅ Good: "We couldn't save your grades. Please check your internet connection and try again."

**Acceptance Criteria:**
- [ ] All error scenarios have user-friendly messages
- [ ] Messages explain the problem
- [ ] Messages suggest next steps
- [ ] Technical details hidden from users (logged for admin)
- [ ] Consistent tone and style

**Priority:** P0  
**Dependencies:** None

---

### FR-090: Browser Compatibility

**User Story:** As a User, I want the system to work on modern browsers, so that I don't need special software.

**Description:** System works on modern browsers.

**Supported Browsers:**
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

**NOT Supported:**
- Internet Explorer (any version)

**Acceptance Criteria:**
- [ ] All features work on supported browsers
- [ ] Consistent appearance across browsers
- [ ] Graceful degradation for older browsers
- [ ] Warning message for unsupported browsers

**Priority:** P0  
**Dependencies:** None

---

### FR-091-095: Additional UX Features

**FR-091:** Dark mode support  
**FR-092:** Customizable interface language  
**FR-093:** Help tooltips and onboarding  
**FR-094:** User preference settings  
**FR-095:** System status page  

*(Detailed specs available on request)*

---

## Summary

**Total Functional Requirements:** 95
- **P0 (MVP Critical):** 60 requirements
- **P1 (Post-MVP Important):** 25 requirements
- **P2 (Future):** 10 requirements

**Requirements Distribution:**
1. Authentication & User Management: 10 requirements
2. School & Academic Setup: 10 requirements
3. Grading Configuration: 10 requirements
4. Grade Entry & Management: 15 requirements
5. Calculation Engine: 10 requirements
6. Report Card Generation: 10 requirements
7. Result Viewing & Access: 10 requirements
8. Admin Tools & Workflow: 10 requirements
9. User Experience & Accessibility: 10 requirements

**All requirements include:**
- User story
- Detailed description
- Behavior specification
- Acceptance criteria
- Priority (P0/P1/P2)
- Dependencies

---

**Document Status:** Complete  
**Next Steps:** Create non-functional-requirements.md and out-of-scope.md

**Owner:** Product Manager  
**Last Updated:** 2025-12-30
