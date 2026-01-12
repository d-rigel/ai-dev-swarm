# System Overview
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-11  
**Owner:** Software Architect  
**Status:** Draft

---

## 1. Executive Summary

SRMS is a multi-tier web application designed to automate school result management. The system follows a modern three-tier architecture with a responsive single-page application (SPA) frontend, RESTful API backend, and relational database storage. It supports multi-tenancy (multiple schools), role-based access control, and automated result calculations with PDF generation.

---

## 2. System Components

### 2.1 Frontend Application (Client Tier)

**Technology Paradigm:** Single Page Application (SPA)  
**Primary Responsibilities:**
- User interface rendering and interaction
- Client-side routing and navigation
- Form validation and user input handling
- Real-time grade entry interfaces
- PDF report card preview and download
- Responsive design across desktop, tablet, mobile

**Key Modules:**
- **Authentication Module** - Login, password reset, session management
- **Admin Dashboard** - School setup, user management, grading configuration
- **Teacher Dashboard** - Grade entry, class management, result viewing
- **Student/Parent Dashboard** - Result viewing, historical data access
- **Report Generator** - PDF report card generation and customization

**Communication:** Communicates with Backend API via HTTP/HTTPS using JSON

---

### 2.2 Backend API (Application Tier)

**Technology Paradigm:** RESTful API Server  
**Primary Responsibilities:**
- Business logic execution
- Authentication and authorization (JWT-based)
- Grade calculation engine
- Report card generation (PDF creation)
- Data validation and sanitization
- API endpoint routing and handling
- Email notification service
- Audit logging

**Key Services:**

**Authentication Service**
- User login/logout
- Token generation and validation
- Password reset and recovery
- Session management

**User Management Service**
- CRUD operations for users
- Role assignment and permission checks
- Parent-student linking
- Account activation/deactivation

**Academic Setup Service**
- School profile management
- Academic year/term/class/subject configuration
- Grading scale management

**Grade Management Service**
- Grade entry and updates
- Bulk import/export
- Validation against grading scales
- Grade locking/unlocking

**Calculation Engine**
- Total score calculation (CA + Exam)
- Average calculation across subjects
- Position/ranking computation
- Historical trend analysis

**Report Service**
- PDF report card generation
- Report template customization
- Bulk report generation
- Report download and email delivery

**Notification Service**
- Email sending (credentials, password reset, notifications)
- Report availability alerts

**Audit Service**
- Activity logging (who did what, when)
- Change tracking for grade modifications

**Communication:** 
- Accepts HTTP/HTTPS requests from Frontend
- Queries and updates Database via ORM
- Sends emails via SMTP service

---

### 2.3 Database (Data Tier)

**Technology Paradigm:** Relational Database Management System (RDBMS)  
**Primary Responsibilities:**
- Persistent data storage
- Data integrity enforcement
- Transactional consistency
- Query optimization

**Key Data Domains:**

**User Domain**
- Users (accounts, credentials, roles)
- User profiles
- Parent-student relationships

**School Domain**
- School profiles
- Academic years
- Terms/sessions
- Classes
- Subjects
- Subject-class assignments

**Grading Domain**
- Grading scales
- Grading rules (weighting percentages)
- Grade entries (CA and Exam scores)
- Calculated results (totals, averages, positions)

**Reporting Domain**
- Report templates
- Generated report metadata
- Report access logs

**Audit Domain**
- Activity logs
- Change history
- Login attempts

**Communication:** Accessed via Backend API using SQL queries

---

### 2.4 File Storage

**Purpose:** Store uploaded files and generated documents  
**Responsibilities:**
- School logo storage
- User profile images
- Generated PDF report cards
- Imported grade files (CSV/Excel)

**Storage Types:**
- **Local File System** (development and small deployments)
- **Cloud Object Storage** (production, e.g., AWS S3, Azure Blob)

**Access:** Backend API manages all file operations; Frontend requests files via API endpoints

---

### 2.5 Email Service

**Purpose:** Send transactional emails  
**Responsibilities:**
- User credential delivery
- Password reset links
- Result availability notifications
- Admin alerts

**Integration:** Backend API connects to SMTP server or email service provider (e.g., SendGrid, AWS SES)

---

## 3. Component Interactions

### 3.1 Request-Response Flow

**Example: Teacher enters grades**

1. **Frontend** → User fills grade entry form and clicks "Submit"
2. **Frontend** → Sends HTTP POST request to `/api/grades` with JSON payload
3. **Backend API** → Validates JWT token and checks user permissions
4. **Backend API** → Validates grade data (score within range, subject exists)
5. **Backend API** → Calculates total score (CA + Exam)
6. **Backend API** → Saves grade to Database
7. **Backend API** → Triggers calculation engine to update averages and rankings
8. **Backend API** → Logs activity to audit table
9. **Backend API** → Returns success response (JSON)
10. **Frontend** → Displays success message and updates UI

---

### 3.2 Report Generation Flow

**Example: Admin generates report cards for a class**

1. **Frontend** → User clicks "Generate Reports" for Term 1, Class 7A
2. **Frontend** → Sends POST request to `/api/reports/generate`
3. **Backend API** → Validates user permissions (Admin only)
4. **Backend API** → Queries Database for all students in Class 7A
5. **Backend API** → Retrieves grades, calculates totals/averages/positions
6. **Backend API** → Fetches school profile and branding
7. **Backend API** → Generates PDF for each student using report template
8. **Backend API** → Saves PDFs to File Storage
9. **Backend API** → Creates report metadata records in Database
10. **Backend API** → Sends email notifications to students/parents
11. **Backend API** → Returns list of generated report URLs
12. **Frontend** → Displays success message with download links

---

## 4. Key Architectural Patterns

### 4.1 Multi-Tenancy

**Strategy:** Shared database with tenant isolation  
**Implementation:**
- Every school has a unique `school_id`
- All database tables include `school_id` column
- All queries filter by `school_id` automatically
- User sessions include `school_id` in JWT token
- Ensures data isolation between schools

**Benefits:**
- Simplified deployment (single application instance)
- Efficient resource utilization
- Centralized updates and maintenance

---

### 4.2 Role-Based Access Control (RBAC)

**Roles:**
- **Super Admin** - System-wide access (for SaaS deployment)
- **School Admin** - Full access within their school
- **Teacher** - Grade entry, viewing for assigned classes
- **Student** - View own results only
- **Parent** - View linked children's results only

**Implementation:**
- User role stored in user record
- Backend middleware checks permissions before processing requests
- Frontend conditionally renders UI based on user role
- Permissions defined in centralized configuration

---

### 4.3 Audit Trail

**Purpose:** Track all critical operations for accountability  
**Implementation:**
- Audit log table captures: user_id, action, timestamp, old_value, new_value
- Logged actions: grade entry, grade modification, user creation, configuration changes
- Admin can view audit logs to investigate discrepancies

---

### 4.4 Caching Strategy

**Goal:** Improve performance for frequently accessed data

**Cache Layers:**

**Frontend Caching**
- User session data (in-memory or localStorage)
- Reference data (class lists, subject lists) - refreshed periodically

**Backend Caching**
- School profiles (rarely change)
- Grading scales (rarely change)
- Calculated results (cache until grade changes)
- Cache invalidation on data updates

**Cache Technology:** In-memory cache (e.g., Redis) or application-level caching

---

## 5. Scalability Considerations

### 5.1 Horizontal Scaling

**Frontend:** Static SPA can be served via CDN, infinitely scalable

**Backend:** Stateless API design allows horizontal scaling
- Multiple API server instances behind load balancer
- Session stored in JWT (no server-side session state)
- Shared database connection pooling

**Database:** Vertical scaling initially; read replicas for reporting queries

---

### 5.2 Performance Targets

**Target Capacity:**
- Support up to 10,000 students per school
- Support 100 concurrent schools (SaaS deployment)
- Grade entry: < 2 seconds per student
- Report generation: < 5 seconds per student
- Dashboard load: < 1 second

**Optimization Strategies:**
- Database indexing on frequently queried columns
- Lazy loading for large datasets
- Batch processing for bulk operations
- Background jobs for report generation (async)

---

## 6. Security Architecture

### 6.1 Authentication & Authorization

**Mechanism:** JSON Web Tokens (JWT)
- User logs in → Backend validates credentials → Issues JWT
- JWT contains: user_id, school_id, role, expiration time
- Frontend stores JWT (secure, HttpOnly cookie or localStorage)
- Frontend includes JWT in Authorization header for all API requests
- Backend validates JWT signature and expiration on every request

---

### 6.2 Data Protection

**Encryption:**
- Passwords hashed using bcrypt (never stored plain text)
- HTTPS/TLS for all data in transit
- Database encryption at rest (optional for sensitive deployments)

**Input Validation:**
- Frontend validates user input (client-side)
- Backend re-validates all inputs (server-side, never trust client)
- SQL injection prevention via parameterized queries (ORM)
- XSS prevention via input sanitization and output encoding

---

### 6.3 Access Control

**Principle of Least Privilege:**
- Users can only access data for their school (tenant isolation)
- Teachers can only view/edit grades for assigned classes
- Students can only view own results
- Parents can only view linked children's results
- Admin can override but actions are logged

---

## 7. Resilience & Reliability

### 7.1 Error Handling

**Frontend:**
- User-friendly error messages
- Graceful degradation if API unavailable
- Retry mechanism for transient failures

**Backend:**
- Try-catch blocks for all critical operations
- Structured error responses (HTTP status codes + error details)
- Error logging to centralized log service

---

### 7.2 Data Backup

**Strategy:** Automated daily database backups
- Retention: 30 days
- Offsite storage for disaster recovery
- Point-in-time recovery capability

---

### 7.3 Monitoring & Alerts

**Metrics to Monitor:**
- API response times
- Error rates
- Database query performance
- Server resource utilization (CPU, memory, disk)

**Alerting:**
- Email/SMS alerts for critical failures
- Dashboard for real-time system health

---

## 8. Integration Points

### 8.1 External Services

**Email Service Provider**
- Purpose: Send transactional emails
- Integration: SMTP protocol or REST API
- Examples: SendGrid, AWS SES, Mailgun

**Payment Gateway** (Future Scope)
- Purpose: School subscription payments (SaaS model)
- Integration: REST API
- Examples: Stripe, PayPal, Paystack

**SMS Service** (Future Scope)
- Purpose: SMS notifications for result availability
- Integration: REST API
- Examples: Twilio, Africa's Talking

---

### 8.2 Import/Export

**Grade Import:**
- Accept CSV/Excel files
- Backend validates and imports grades in bulk
- Returns import summary (success/failure counts)

**Grade Export:**
- Export grades to CSV/Excel for offline analysis
- Export results to PDF (report cards)

---

## 9. Technology-Agnostic Decisions

**Note:** Specific technologies (frameworks, languages) will be selected in Stage 7: Technical Specifications. This section outlines technology-agnostic architectural decisions.

### 9.1 Architectural Style
- **Selected:** Three-tier client-server architecture
- **Alternatives Considered:** Monolithic, Microservices
- **Rationale:** Three-tier provides clear separation of concerns, easier maintenance, and sufficient scalability for MVP and beyond

### 9.2 Frontend Architecture
- **Selected:** Single Page Application (SPA)
- **Alternatives Considered:** Multi-Page Application (MPA), Server-Side Rendering (SSR)
- **Rationale:** SPA provides responsive user experience, ideal for data-heavy forms and dashboards

### 9.3 Backend API Style
- **Selected:** RESTful API
- **Alternatives Considered:** GraphQL, gRPC
- **Rationale:** REST is simple, well-understood, and sufficient for CRUD operations; widely supported by tools

### 9.4 Database Type
- **Selected:** Relational Database (RDBMS)
- **Alternatives Considered:** NoSQL (Document, Key-Value)
- **Rationale:** Academic data has strong relationships (schools, classes, subjects, students, grades); ACID transactions critical for data accuracy

### 9.5 Authentication Strategy
- **Selected:** JWT-based token authentication
- **Alternatives Considered:** Session-based (cookies), OAuth 2.0
- **Rationale:** JWT is stateless, scalable, and suitable for API-driven architecture

---

## 10. Summary of Major Components

| Component | Type | Responsibilities | Access |
|-----------|------|------------------|--------|
| **Frontend SPA** | Client Application | UI rendering, user interaction | Public (authenticated users) |
| **Backend API** | Application Server | Business logic, data processing | Internal (from Frontend) |
| **Database** | Data Storage | Persistent storage, data integrity | Internal (from Backend) |
| **File Storage** | Object Storage | File uploads, PDF reports | Internal (via Backend API) |
| **Email Service** | External Service | Email delivery | External (via Backend API) |

---

## 11. Next Steps

After approval of this system overview:
1. Create detailed architecture diagram (visual representation)
2. Document data flow across components
3. Define deployment boundaries and trust zones
4. Proceed to Stage 7: Technical Specifications (select frameworks, languages, tools)

---

**Status:** Ready for Review  
**Approver:** Product Owner, Technical Lead  
**Last Updated:** 2026-01-11
