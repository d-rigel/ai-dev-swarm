# Data Flow
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-11  
**Owner:** Software Architect  
**Status:** Draft

---

## Overview

This document details how data flows through the SRMS across different user interactions and system processes. Each flow includes request-response patterns, data transformations, and system state changes.

---

## 1. User Authentication Flow

### 1.1 Login Flow

**Actors:** User (any role), Frontend, Backend, Database

**Flow:**

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant DB as Database
    
    User->>Frontend: 1. Navigate to login page
    Frontend->>User: 2. Display login form
    User->>Frontend: 3. Enter email & password<br/>Click "Login"
    
    Frontend->>Frontend: 4. Validate input format<br/>(email format, password not empty)
    
    alt Validation fails
        Frontend->>User: 5a. Display validation error
    else Validation passes
        Frontend->>Backend: 5b. POST /api/auth/login<br/>Body: {email, password}
        
        Backend->>Backend: 6. Sanitize input
        Backend->>DB: 7. SELECT * FROM users<br/>WHERE email = ?
        DB-->>Backend: 8. Return user record (or null)
        
        alt User not found
            Backend-->>Frontend: 9a. 401 Unauthorized<br/>{error: "Invalid credentials"}
            Frontend-->>User: 10a. Display error message
        else User found
            Backend->>Backend: 9b. Compare password hash<br/>bcrypt.compare(password, user.password_hash)
            
            alt Password incorrect
                Backend->>DB: 10b. Log failed login attempt
                Backend-->>Frontend: 11b. 401 Unauthorized<br/>{error: "Invalid credentials"}
                Frontend-->>User: 12b. Display error message
            else Password correct
                Backend->>Backend: 10c. Generate JWT token<br/>Payload: {user_id, school_id, role, exp}
                Backend->>DB: 11c. Log successful login
                Backend-->>Frontend: 12c. 200 OK<br/>{token, user: {id, name, role}}
                
                Frontend->>Frontend: 13. Store token securely<br/>(localStorage/sessionStorage)
                Frontend->>Frontend: 14. Store user info in state
                Frontend->>User: 15. Redirect to dashboard<br/>(based on role)
            end
        end
    end
```

**Data Transformations:**

| Stage | Data Input | Data Output |
|-------|------------|-------------|
| **Client Input** | Email (string), Password (string) | - |
| **Frontend Validation** | Raw input | Validated email, password |
| **API Request** | {email, password} | JSON payload |
| **Backend Processing** | {email, password} | Password hash comparison |
| **Token Generation** | user_id, school_id, role | JWT token (encrypted) |
| **API Response** | JWT + user object | {token, user: {...}} |
| **Client Storage** | Token + user data | Stored in localStorage |

---

### 1.2 Authenticated Request Flow

**Every subsequent request after login**

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant DB as Database
    
    Frontend->>Frontend: 1. Retrieve token from storage
    Frontend->>Backend: 2. GET /api/resource<br/>Header: Authorization: Bearer {token}
    
    Backend->>Backend: 3. Extract token from header
    Backend->>Backend: 4. Verify JWT signature
    
    alt Token invalid/expired
        Backend-->>Frontend: 5a. 401 Unauthorized<br/>{error: "Invalid token"}
        Frontend->>Frontend: 6a. Clear token
        Frontend->>Frontend: 7a. Redirect to login
    else Token valid
        Backend->>Backend: 5b. Decode token payload<br/>{user_id, school_id, role}
        Backend->>Backend: 6b. Check role permissions<br/>for requested resource
        
        alt Permission denied
            Backend-->>Frontend: 7b. 403 Forbidden<br/>{error: "Access denied"}
            Frontend-->>Frontend: 8b. Display error message
        else Permission granted
            Backend->>DB: 7c. Query data<br/>WHERE school_id = token.school_id
            DB-->>Backend: 8c. Return filtered data
            Backend-->>Frontend: 9c. 200 OK<br/>{data}
            Frontend-->>Frontend: 10c. Update UI with data
        end
    end
```

**Security Mechanisms:**

1. **JWT Signature Verification** - Ensures token hasn't been tampered with
2. **Expiration Check** - Tokens expire after 4 hours
3. **Tenant Isolation** - `school_id` from token filters all queries
4. **Role-Based Access** - Middleware checks role before processing request

---

## 2. School Setup Flow (First-Time Configuration)

### 2.1 Complete Setup Flow

**Actor:** Administrator (first login)

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant DB as Database
    
    Admin->>Frontend: 1. Login (first time)
    Frontend->>Backend: 2. GET /api/school/status
    Backend->>DB: 3. Check if school setup complete
    DB-->>Backend: 4. setup_complete = false
    Backend-->>Frontend: 5. {setup_required: true}
    Frontend->>Admin: 6. Redirect to setup wizard
    
    Note over Admin,DB: Step 1: School Profile
    
    Admin->>Frontend: 7. Enter school details<br/>(name, logo, address, email)
    Admin->>Frontend: 8. Upload logo file
    Frontend->>Backend: 9. POST /api/school/profile<br/>Body: FormData (multipart)
    Backend->>Backend: 10. Validate school name (unique)
    Backend->>Backend: 11. Process logo upload<br/>(resize, validate format)
    Backend->>DB: 12. Save file to storage<br/>Get file URL
    Backend->>DB: 13. INSERT/UPDATE schools table
    DB-->>Backend: 14. Return school record
    Backend-->>Frontend: 15. 200 OK {school}
    Frontend->>Admin: 16. Show success, move to Step 2
    
    Note over Admin,DB: Step 2: Academic Year
    
    Admin->>Frontend: 17. Enter year name, start/end dates
    Frontend->>Backend: 18. POST /api/academic-years<br/>{name, start_date, end_date}
    Backend->>Backend: 19. Validate dates<br/>(start < end, not overlap)
    Backend->>DB: 20. INSERT academic_years<br/>SET is_active = true
    DB-->>Backend: 21. Return academic year
    Backend-->>Frontend: 22. 200 OK {academic_year}
    Frontend->>Admin: 23. Show success, move to Step 3
    
    Note over Admin,DB: Step 3: Terms
    
    Admin->>Frontend: 24. Create 3 terms with dates
    Frontend->>Backend: 25. POST /api/terms/bulk<br/>[{name, start, end}, ...]
    Backend->>Backend: 26. Validate no date overlap
    Backend->>DB: 27. INSERT terms (batch)
    DB-->>Backend: 28. Return created terms
    Backend-->>Frontend: 29. 200 OK {terms: [...]}
    Frontend->>Admin: 30. Show success, move to Step 4
    
    Note over Admin,DB: Step 4: Classes
    
    Admin->>Frontend: 31. Create classes (e.g., 7A, 8B)
    Frontend->>Backend: 32. POST /api/classes/bulk<br/>[{name, grade_level}, ...]
    Backend->>DB: 33. INSERT classes (batch)
    DB-->>Backend: 34. Return created classes
    Backend-->>Frontend: 35. 200 OK {classes: [...]}
    Frontend->>Admin: 36. Show success, move to Step 5
    
    Note over Admin,DB: Step 5: Subjects
    
    Admin->>Frontend: 37. Create subjects<br/>Assign to classes<br/>Set CA/Exam percentages
    Frontend->>Backend: 38. POST /api/subjects/bulk<br/>[{name, ca_pct, exam_pct}, ...]
    Backend->>Backend: 39. Validate percentages sum to 100%
    Backend->>DB: 40. INSERT subjects
    Backend->>DB: 41. INSERT class_subject mappings
    Backend->>DB: 42. INSERT grading_scales
    DB-->>Backend: 43. Return created records
    Backend->>DB: 44. UPDATE school<br/>SET setup_complete = true
    Backend-->>Frontend: 45. 200 OK {subjects: [...]}
    Frontend->>Admin: 46. Show setup complete message<br/>Redirect to dashboard
```

**Data Created:**

| Entity | Example Data |
|--------|-------------|
| **School** | {id: 1, name: "Green Valley High", logo_url: "/uploads/logo.png", setup_complete: true} |
| **Academic Year** | {id: 1, school_id: 1, name: "2025-2026", start_date: "2025-09-01", end_date: "2026-06-30", is_active: true} |
| **Terms** | [{id: 1, academic_year_id: 1, name: "Term 1", start_date: "2025-09-01", end_date: "2025-12-15", is_active: true}, ...] |
| **Classes** | [{id: 1, school_id: 1, name: "Grade 7A", grade_level: 7}, ...] |
| **Subjects** | [{id: 1, school_id: 1, name: "Mathematics"}, {id: 2, school_id: 1, name: "English"}, ...] |
| **Class-Subject** | [{class_id: 1, subject_id: 1}, {class_id: 1, subject_id: 2}, ...] |
| **Grading Scales** | [{subject_id: 1, ca_percentage: 40, exam_percentage: 60}, ...] |

---

## 3. Grade Entry Flow

### 3.1 Teacher Enters Grades for a Class

**Actor:** Teacher

```mermaid
sequenceDiagram
    participant Teacher
    participant Frontend
    participant Backend
    participant CalcEngine as Calculation Engine
    participant DB as Database
    
    Note over Teacher,DB: Load Grade Entry Form
    
    Teacher->>Frontend: 1. Navigate to Grade Entry
    Frontend->>Teacher: 2. Show form to select:<br/>Class, Subject, Term
    Teacher->>Frontend: 3. Select "Grade 7A", "Mathematics", "Term 1"
    Frontend->>Backend: 4. GET /api/classes/1/students?term_id=1&subject_id=1
    Backend->>DB: 5. Query students enrolled in class<br/>LEFT JOIN existing grades
    DB-->>Backend: 6. Return student list with existing grades
    Backend-->>Frontend: 7. 200 OK<br/>[{student_id, name, ca_score, exam_score}, ...]
    Frontend->>Teacher: 8. Display grade entry table<br/>(40 students, 2 columns each)
    
    Note over Teacher,DB: Enter Grades
    
    Teacher->>Frontend: 9. Enter CA & Exam scores<br/>for all students
    Teacher->>Frontend: 10. Click "Submit Grades"
    
    Frontend->>Frontend: 11. Validate all scores<br/>(0-100 range, numeric)
    
    alt Validation fails
        Frontend->>Teacher: 12a. Highlight invalid cells<br/>Show error message
    else Validation passes
        Frontend->>Backend: 12b. POST /api/grades/bulk<br/>{term_id, class_id, subject_id,<br/>grades: [{student_id, ca, exam}, ...]}
        
        Backend->>Backend: 13. Verify teacher assigned to class
        Backend->>Backend: 14. Re-validate scores server-side
        Backend->>DB: 15. Get grading scale<br/>(CA%, Exam% for subject)
        DB-->>Backend: 16. {ca_percentage: 40, exam_percentage: 60}
        
        Backend->>Backend: 17. Begin transaction
        
        loop For each student
            Backend->>Backend: 18. Calculate total_score<br/>= (ca * 0.4) + (exam * 0.6)
            Backend->>DB: 19. INSERT/UPDATE grades<br/>{student_id, ca, exam, total_score}
        end
        
        Backend->>CalcEngine: 20. Trigger recalculation<br/>for class_id, term_id
        
        CalcEngine->>DB: 21. Get all subjects for class
        DB-->>CalcEngine: 22. [Math, English, Science, ...]
        
        CalcEngine->>DB: 23. Get all grades for each student<br/>across all subjects
        DB-->>CalcEngine: 24. Student grades by subject
        
        loop For each student
            CalcEngine->>CalcEngine: 25. Calculate average<br/>= SUM(total_scores) / COUNT(subjects)
        end
        
        CalcEngine->>CalcEngine: 26. Sort students by average DESC
        CalcEngine->>CalcEngine: 27. Assign position (1, 2, 3, ...)
        
        CalcEngine->>DB: 28. UPDATE grades<br/>SET average, position
        DB-->>CalcEngine: 29. Update successful
        
        CalcEngine-->>Backend: 30. Calculation complete
        
        Backend->>DB: 31. Commit transaction
        Backend->>DB: 32. Log audit record<br/>(teacher_id, "GRADE_ENTRY", timestamp)
        
        Backend-->>Frontend: 33. 200 OK<br/>{success: true,<br/>updated_count: 40}
        Frontend->>Teacher: 34. Show success message<br/>"Grades saved successfully"
        Frontend->>Frontend: 35. Update table with calculated data<br/>(totals, averages, positions)
    end
```

**Data Transformations:**

| Stage | Input | Processing | Output |
|-------|-------|------------|--------|
| **Teacher Input** | CA: 85, Exam: 78 | - | Raw scores |
| **Validation** | Raw scores | Check 0-100 range | Valid scores |
| **Total Calculation** | CA: 85, Exam: 78, Scale: (40%, 60%) | (85 × 0.4) + (78 × 0.6) | Total: 80.8 |
| **Average Calculation** | Math: 80.8, English: 75, Science: 82 | (80.8 + 75 + 82) / 3 | Average: 79.27 |
| **Position Calculation** | All students' averages | Sort DESC, assign rank | Position: 5 |
| **Database Storage** | Calculated values | Persist to DB | Saved grades |

---

### 3.2 Grade Modification (Admin Override)

**Actor:** Administrator

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant DB as Database
    
    Admin->>Frontend: 1. Navigate to specific student's result
    Frontend->>Backend: 2. GET /api/grades/{student_id}?term_id=1
    Backend->>DB: 3. Query grades
    DB-->>Backend: 4. Return grade records
    Backend-->>Frontend: 5. 200 OK {grades: [...]}
    Frontend->>Admin: 6. Display grades (with lock status)
    
    Admin->>Frontend: 7. Click "Edit" on Mathematics
    Frontend->>Backend: 8. POST /api/grades/{id}/unlock<br/>(requires admin permission)
    Backend->>DB: 9. UPDATE grades SET is_locked = false
    Backend-->>Frontend: 10. 200 OK
    Frontend->>Admin: 11. Enable editing
    
    Admin->>Frontend: 12. Change CA: 85 → 90
    Admin->>Frontend: 13. Click "Save"
    Frontend->>Backend: 14. PUT /api/grades/{id}<br/>{ca_score: 90, reason: "Correction"}
    
    Backend->>Backend: 15. Verify admin permission
    Backend->>DB: 16. SELECT old grade values
    DB-->>Backend: 17. {ca_score: 85, ...}
    
    Backend->>DB: 18. UPDATE grades<br/>SET ca_score = 90, total_score = recalculated
    Backend->>DB: 19. INSERT audit_log<br/>{user_id, action: "GRADE_MODIFIED",<br/>old_value: 85, new_value: 90, reason}
    Backend->>Backend: 20. Trigger recalculation for class
    Backend-->>Frontend: 21. 200 OK {updated_grade}
    
    Frontend->>Admin: 22. Show success + audit trail entry
```

**Audit Trail Data:**

```json
{
  "id": 1234,
  "user_id": 5,
  "user_name": "Admin John",
  "action": "GRADE_MODIFIED",
  "entity_type": "grade",
  "entity_id": 789,
  "old_value": "{\"ca_score\": 85, \"total_score\": 80.8}",
  "new_value": "{\"ca_score\": 90, \"total_score\": 83.8}",
  "reason": "Correction after exam re-marking",
  "timestamp": "2026-01-11T10:30:00Z"
}
```

---

## 4. Report Card Generation Flow

### 4.1 Bulk Report Generation for a Class

**Actor:** Administrator

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant ReportService as Report Service
    participant PDFEngine as PDF Engine
    participant DB as Database
    participant FileStorage
    participant EmailService
    
    Admin->>Frontend: 1. Navigate to Reports
    Frontend->>Admin: 2. Show form (Select Term, Class)
    Admin->>Frontend: 3. Select "Term 1", "Grade 7A"<br/>Click "Generate Reports"
    
    Frontend->>Backend: 4. POST /api/reports/generate<br/>{term_id: 1, class_id: 1}
    Backend->>Backend: 5. Verify admin permission
    Backend->>DB: 6. SELECT students WHERE class_id = 1
    DB-->>Backend: 7. [40 students]
    
    Backend->>Backend: 8. Queue background job<br/>(async processing)
    Backend-->>Frontend: 9. 202 Accepted<br/>{job_id: "xyz", status: "processing"}
    Frontend->>Admin: 10. Show progress indicator
    
    Note over Backend,EmailService: Background Job Processing
    
    loop For each student (40 students)
        Backend->>DB: 11. Get student details<br/>(name, class, photo)
        Backend->>DB: 12. Get all grades for term
        Backend->>DB: 13. Get school branding<br/>(logo, name, colors)
        
        Backend->>ReportService: 14. Generate report<br/>{student, grades, school}
        
        ReportService->>ReportService: 15. Calculate summary stats<br/>(total subjects, total score,<br/>average, position, grade)
        
        ReportService->>ReportService: 16. Render HTML template<br/>(insert data into template)
        
        ReportService->>PDFEngine: 17. Convert HTML to PDF
        PDFEngine->>PDFEngine: 18. Generate PDF binary
        PDFEngine-->>ReportService: 19. PDF buffer
        
        ReportService->>FileStorage: 20. Save PDF<br/>Path: /reports/{school_id}/{term_id}/{student_id}.pdf
        FileStorage-->>ReportService: 21. File URL
        
        ReportService->>DB: 22. INSERT reports<br/>{student_id, term_id, pdf_url}
        
        ReportService->>EmailService: 23. Send email to student/parent<br/>Subject: "Your Term 1 Result is Ready"<br/>Body: Download link
        EmailService-->>ReportService: 24. Email sent
        
        ReportService-->>Backend: 25. Progress: 1/40 complete
    end
    
    Backend->>DB: 26. Update job status = "completed"
    Backend->>Frontend: 27. WebSocket notification<br/>{job_id, status: "completed"}
    Frontend->>Admin: 28. Show success message<br/>"40 reports generated"
    Frontend->>Backend: 29. GET /api/reports?class_id=1&term_id=1
    Backend->>DB: 30. Query report records
    DB-->>Backend: 31. [40 report records with URLs]
    Backend-->>Frontend: 32. 200 OK {reports: [...]}
    Frontend->>Admin: 33. Display report list<br/>with download buttons
```

**Report Data Structure:**

```json
{
  "report_id": 123,
  "student": {
    "id": 456,
    "name": "John Doe",
    "class": "Grade 7A",
    "photo_url": "/uploads/students/456.jpg"
  },
  "school": {
    "name": "Green Valley High School",
    "logo_url": "/uploads/logo.png",
    "address": "123 Main St, City",
    "term": "Term 1 (2025-2026)"
  },
  "grades": [
    {"subject": "Mathematics", "ca": 85, "exam": 78, "total": 80.8, "grade": "B"},
    {"subject": "English", "ca": 80, "exam": 70, "total": 74.0, "grade": "C"},
    {"subject": "Science", "ca": 90, "exam": 88, "total": 88.8, "grade": "A"}
  ],
  "summary": {
    "total_subjects": 10,
    "total_score": 792,
    "average": 79.2,
    "position": 5,
    "out_of": 40,
    "overall_grade": "B"
  },
  "pdf_url": "/reports/1/1/456.pdf",
  "generated_at": "2026-01-11T11:00:00Z"
}
```

---

## 5. Result Viewing Flow (Student/Parent)

### 5.1 Student Views Own Results

**Actor:** Student

```mermaid
sequenceDiagram
    participant Student
    participant Frontend
    participant Backend
    participant DB as Database
    participant FileStorage
    
    Student->>Frontend: 1. Login (role = "student")
    Frontend->>Student: 2. Redirect to Student Dashboard
    Frontend->>Backend: 3. GET /api/students/{id}/results
    
    Backend->>Backend: 4. Extract student_id from JWT<br/>Verify student can only see own data
    Backend->>DB: 5. Query terms for current academic year
    DB-->>Backend: 6. [Term 1, Term 2, Term 3]
    
    Backend->>DB: 7. Query grades for student<br/>across all terms
    DB-->>Backend: 8. Grade records by term
    
    Backend->>DB: 9. Check if reports exist
    DB-->>Backend: 10. Report metadata
    
    Backend-->>Frontend: 11. 200 OK<br/>{terms: [...],<br/>grades_by_term: {...},<br/>reports: [...}}
    
    Frontend->>Student: 12. Display dashboard:<br/>- Current term results<br/>- Historical results<br/>- Performance charts
    
    Student->>Frontend: 13. Click "View Term 1 Results"
    Frontend->>Student: 14. Show detailed breakdown:<br/>- Subject-wise scores<br/>- Average<br/>- Position
    
    Student->>Frontend: 15. Click "Download Report Card"
    Frontend->>Backend: 16. GET /api/reports/{report_id}/download
    
    Backend->>Backend: 17. Verify student owns this report
    Backend->>DB: 18. Get report record
    DB-->>Backend: 19. {pdf_url: "/reports/1/1/456.pdf"}
    
    Backend->>FileStorage: 20. Read file
    FileStorage-->>Backend: 21. PDF binary stream
    
    Backend-->>Frontend: 22. 200 OK<br/>Content-Type: application/pdf<br/>PDF binary
    Frontend->>Student: 23. Trigger download in browser
```

---

### 5.2 Parent Views Multiple Children's Results

**Actor:** Parent

```mermaid
sequenceDiagram
    participant Parent
    participant Frontend
    participant Backend
    participant DB as Database
    
    Parent->>Frontend: 1. Login (role = "parent")
    Frontend->>Backend: 2. GET /api/parents/{id}/children
    Backend->>DB: 3. Query parent_student links
    DB-->>Backend: 4. [Child 1, Child 2]
    Backend-->>Frontend: 5. 200 OK {children: [...]}
    
    Frontend->>Parent: 6. Display children list
    Parent->>Frontend: 7. Select "Child 1 (Jane Doe)"
    Frontend->>Backend: 8. GET /api/students/{child_id}/results
    
    Backend->>Backend: 9. Verify parent linked to child
    Backend->>DB: 10. Query grades for child
    DB-->>Backend: 11. Grade data
    Backend-->>Frontend: 12. 200 OK {results}
    
    Frontend->>Parent: 13. Display child's results<br/>Same view as student dashboard
```

---

## 6. Historical Data & Trend Analysis

### 6.1 View Student Progress Across Terms

**Actor:** Teacher/Admin

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB as Database
    
    User->>Frontend: 1. Navigate to student profile
    Frontend->>Backend: 2. GET /api/students/{id}/history
    
    Backend->>DB: 3. Query grades across all terms<br/>in all academic years
    DB-->>Backend: 4. Historical grade data
    
    Backend->>Backend: 5. Group by academic year, term
    Backend->>Backend: 6. Calculate trends<br/>(improving, declining, stable)
    
    Backend-->>Frontend: 7. 200 OK<br/>{history_by_year: {...},<br/>trend_analysis: {...}}
    
    Frontend->>Frontend: 8. Generate charts:<br/>- Line chart (average over time)<br/>- Bar chart (subject comparison)<br/>- Position trend
    
    Frontend->>User: 9. Display interactive dashboard
```

**Historical Data Example:**

```json
{
  "student_id": 456,
  "history": [
    {
      "academic_year": "2024-2025",
      "terms": [
        {"term": "Term 1", "average": 75.5, "position": 8},
        {"term": "Term 2", "average": 78.2, "position": 6},
        {"term": "Term 3", "average": 80.1, "position": 5}
      ]
    },
    {
      "academic_year": "2025-2026",
      "terms": [
        {"term": "Term 1", "average": 79.2, "position": 5}
      ]
    }
  ],
  "trend": {
    "direction": "improving",
    "average_change": "+3.7 points",
    "position_change": "Improved by 3 ranks"
  }
}
```

---

## 7. Data Validation & Error Handling Flow

### 7.1 Invalid Grade Entry Handling

```mermaid
flowchart TD
    Start[Teacher submits grades] --> FrontendValidate{Frontend Validation}
    
    FrontendValidate -->|Fail| ShowClientError[Show inline error<br/>Highlight invalid cells]
    ShowClientError --> End1[User corrects input]
    
    FrontendValidate -->|Pass| SendToBackend[Send POST /api/grades/bulk]
    SendToBackend --> BackendValidate{Backend Validation}
    
    BackendValidate -->|Invalid format| Return400[400 Bad Request<br/>error: 'Invalid format']
    Return400 --> ShowServerError[Display error message]
    
    BackendValidate -->|Score out of range| Return422[422 Unprocessable Entity<br/>error: 'Score must be 0-100']
    Return422 --> ShowServerError
    
    BackendValidate -->|Unauthorized| Return403[403 Forbidden<br/>error: 'Not assigned to class']
    Return403 --> ShowServerError
    
    BackendValidate -->|Pass| CheckLock{Grades locked?}
    
    CheckLock -->|Yes| Return409[409 Conflict<br/>error: 'Grades are locked']
    Return409 --> ShowServerError
    
    CheckLock -->|No| ProcessGrades[Calculate totals<br/>Update database<br/>Recalculate rankings]
    ProcessGrades --> Return200[200 OK<br/>success message]
    Return200 --> End2[Display success]
    
    ShowServerError --> End3[User corrects and retries]
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| **CA Score** | 0 ≤ score ≤ 100 | "CA score must be between 0 and 100" |
| **Exam Score** | 0 ≤ score ≤ 100 | "Exam score must be between 0 and 100" |
| **Student ID** | Must exist in class | "Invalid student ID" |
| **Subject ID** | Must be assigned to class | "Subject not assigned to this class" |
| **Term ID** | Must be valid and active | "Invalid or inactive term" |
| **Locked Status** | is_locked = false | "Grades are locked for this term" |
| **Permission** | Teacher assigned to class | "You are not assigned to teach this class" |

---

## 8. Caching Strategy & Data Freshness

### 8.1 Cache Layers

```mermaid
flowchart LR
    User[User Request] --> FrontendCache{Frontend Cache?}
    
    FrontendCache -->|Hit| ReturnCached1[Return cached data<br/>Instant response]
    FrontendCache -->|Miss| APIRequest[API Request]
    
    APIRequest --> BackendCache{Backend Cache?}
    
    BackendCache -->|Hit| ReturnCached2[Return cached data<br/>Fast response]
    BackendCache -->|Miss| DBQuery[Database Query]
    
    DBQuery --> StoreBackendCache[Store in backend cache<br/>TTL: 5 minutes]
    StoreBackendCache --> ReturnData[Return data to frontend]
    ReturnData --> StoreFrontendCache[Store in frontend cache<br/>TTL: 1 minute]
    StoreFrontendCache --> DisplayData[Display to user]
    
    Note1[Cache Invalidation on:<br/>- Data modification<br/>- Grade entry/update<br/>- School config change] -.-> BackendCache
```

**Cached Data Types:**

| Data Type | Cache Duration | Invalidation Trigger |
|-----------|----------------|---------------------|
| **School Profile** | 1 hour | Admin updates school info |
| **Class List** | 5 minutes | New class added |
| **Subject List** | 5 minutes | New subject added |
| **Grading Scales** | 15 minutes | Grading config changed |
| **Student Grades** | No cache (always fresh) | Every grade entry |
| **Report URLs** | 1 hour | New report generated |
| **User Session** | 4 hours | Logout or token expiration |

---

## 9. Concurrency Handling

### 9.1 Multiple Teachers Entering Grades Simultaneously

**Scenario:** Two teachers enter grades for different subjects in the same class at the same time.

```mermaid
sequenceDiagram
    participant Teacher1
    participant Teacher2
    participant Backend
    participant DB as Database
    
    par Concurrent Requests
        Teacher1->>Backend: POST /api/grades/bulk<br/>{subject: Math, grades: [...]}
        Teacher2->>Backend: POST /api/grades/bulk<br/>{subject: English, grades: [...]}
    end
    
    par Database Transactions
        Backend->>DB: BEGIN TRANSACTION (Math)
        Backend->>DB: BEGIN TRANSACTION (English)
        
        DB->>DB: Acquire row locks<br/>(Math grade rows)
        DB->>DB: Acquire row locks<br/>(English grade rows - different rows)
        
        Backend->>DB: INSERT/UPDATE Math grades
        Backend->>DB: INSERT/UPDATE English grades
        
        Backend->>DB: COMMIT (Math)
        Backend->>DB: COMMIT (English)
    end
    
    Note over Backend,DB: Recalculation (Sequential)
    
    Backend->>Backend: Queue recalculation<br/>for class_id
    Backend->>Backend: Debounce (wait 2 seconds)
    Backend->>Backend: Execute single recalculation<br/>(covers both subjects)
    Backend->>DB: UPDATE averages & positions
```

**Concurrency Strategy:**

1. **Row-level locking** - Database locks only affected grade rows
2. **Transaction isolation** - Each grade entry is a separate transaction
3. **Debounced recalculation** - Multiple updates trigger one recalculation
4. **No data conflicts** - Different subjects modify different rows

---

## 10. Summary of Critical Data Flows

| Flow | Trigger | Processing Time | Data Volume |
|------|---------|----------------|-------------|
| **Login** | User enters credentials | < 1 second | 1 user record |
| **School Setup** | Admin first-time config | 2-5 minutes | ~50 records |
| **Grade Entry** | Teacher submits form | 2-5 seconds | 40 student records |
| **Calculation** | After grade entry | 1-3 seconds | 40 student calculations |
| **Report Generation** | Admin triggers | 2-5 minutes | 40 PDFs (async) |
| **Result Viewing** | Student/Parent request | < 1 second | 10-50 grade records |
| **Historical Data** | User requests trends | 1-2 seconds | 100-500 records |

---

**Next Steps:**
1. Review data flow scenarios
2. Validate performance expectations
3. Document deployment boundaries
4. Proceed to Stage 7: Technical Specifications

---

**Status:** Ready for Review  
**Approver:** Product Owner, Technical Lead  
**Last Updated:** 2026-01-11
