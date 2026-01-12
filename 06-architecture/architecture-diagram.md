# Architecture Diagram
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-11  
**Owner:** Software Architect  
**Status:** Draft

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        WebBrowser["Web Browser<br/>(Desktop/Tablet/Mobile)"]
    end
    
    subgraph "Application Layer"
        Frontend["Frontend SPA<br/>• React/Vue/Angular<br/>• Client-side routing<br/>• Form validation<br/>• PDF preview"]
        
        Backend["Backend API Server<br/>• REST API endpoints<br/>• Business logic<br/>• Authentication/Authorization<br/>• PDF generation"]
    end
    
    subgraph "Data Layer"
        Database["Relational Database<br/>• User data<br/>• School configuration<br/>• Grades & results<br/>• Audit logs"]
        
        FileStorage["File Storage<br/>• School logos<br/>• PDF reports<br/>• Imported files"]
    end
    
    subgraph "External Services"
        EmailService["Email Service<br/>• SMTP/API<br/>• Credentials delivery<br/>• Notifications"]
    end
    
    WebBrowser -->|HTTPS| Frontend
    Frontend -->|REST API calls<br/>JSON over HTTPS| Backend
    Backend -->|SQL queries<br/>via ORM| Database
    Backend -->|File I/O<br/>read/write| FileStorage
    Backend -->|SMTP/API<br/>send emails| EmailService
    
    style WebBrowser fill:#e1f5ff
    style Frontend fill:#fff4e1
    style Backend fill:#ffe1f5
    style Database fill:#e1ffe1
    style FileStorage fill:#e1ffe1
    style EmailService fill:#f5e1ff
```

---

## 2. Component Architecture

```mermaid
graph LR
    subgraph "Frontend SPA"
        UI["User Interface Components"]
        Router["Client-Side Router"]
        State["State Management"]
        API_Client["API Client Library"]
        
        UI --> State
        State --> API_Client
        Router --> UI
    end
    
    subgraph "Backend API"
        Gateway["API Gateway<br/>Route Handler"]
        Auth["Auth Middleware<br/>JWT Validation"]
        Controllers["Controllers<br/>Request Handlers"]
        Services["Business Services"]
        ORM["ORM/Database Layer"]
        
        Gateway --> Auth
        Auth --> Controllers
        Controllers --> Services
        Services --> ORM
    end
    
    API_Client -->|HTTP/JSON| Gateway
    ORM -->|SQL| DB[(Database)]
    Services -->|File Operations| FS[File Storage]
    Services -->|Send Email| Email[Email Service]
    
    style UI fill:#e1f5ff
    style Router fill:#e1f5ff
    style State fill:#e1f5ff
    style API_Client fill:#e1f5ff
    style Gateway fill:#ffe1f5
    style Auth fill:#ffe1f5
    style Controllers fill:#ffe1f5
    style Services fill:#ffe1f5
    style ORM fill:#ffe1f5
    style DB fill:#e1ffe1
    style FS fill:#e1ffe1
    style Email fill:#f5e1ff
```

---

## 3. Data Architecture

```mermaid
erDiagram
    SCHOOL ||--o{ USER : has
    SCHOOL ||--o{ ACADEMIC_YEAR : defines
    SCHOOL ||--o{ GRADING_SCALE : configures
    
    ACADEMIC_YEAR ||--o{ TERM : contains
    SCHOOL ||--o{ CLASS : has
    SCHOOL ||--o{ SUBJECT : offers
    
    CLASS ||--o{ STUDENT_CLASS : enrollment
    USER ||--o{ STUDENT_CLASS : enrolled_in
    
    SUBJECT ||--o{ CLASS_SUBJECT : taught_in
    CLASS ||--o{ CLASS_SUBJECT : teaches
    
    USER ||--o{ GRADE : receives
    CLASS_SUBJECT ||--o{ GRADE : for
    TERM ||--o{ GRADE : during
    
    USER ||--o{ REPORT : generated_for
    TERM ||--o{ REPORT : in
    
    USER ||--o{ AUDIT_LOG : performs
    USER ||--o{ PARENT_STUDENT : parent_link
    USER ||--o{ PARENT_STUDENT : child_link
    
    SCHOOL {
        int id PK
        string name
        string logo_url
        string address
        string email
    }
    
    USER {
        int id PK
        int school_id FK
        string email
        string password_hash
        string role
        string full_name
    }
    
    ACADEMIC_YEAR {
        int id PK
        int school_id FK
        string name
        date start_date
        date end_date
        boolean is_active
    }
    
    TERM {
        int id PK
        int academic_year_id FK
        string name
        date start_date
        date end_date
        boolean is_active
    }
    
    CLASS {
        int id PK
        int school_id FK
        string name
        int grade_level
    }
    
    SUBJECT {
        int id PK
        int school_id FK
        string name
    }
    
    GRADING_SCALE {
        int id PK
        int school_id FK
        int subject_id FK
        int ca_percentage
        int exam_percentage
    }
    
    GRADE {
        int id PK
        int student_id FK
        int class_subject_id FK
        int term_id FK
        decimal ca_score
        decimal exam_score
        decimal total_score
        decimal average
        int position
        boolean is_locked
    }
    
    REPORT {
        int id PK
        int student_id FK
        int term_id FK
        string pdf_url
        datetime generated_at
    }
    
    AUDIT_LOG {
        int id PK
        int user_id FK
        string action
        string entity_type
        int entity_id
        text old_value
        text new_value
        datetime timestamp
    }
```

---

## 4. Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    
    User->>Frontend: 1. Enter email & password
    Frontend->>Backend: 2. POST /api/auth/login<br/>{email, password}
    Backend->>Database: 3. Query user by email
    Database-->>Backend: 4. Return user record
    Backend->>Backend: 5. Verify password hash
    Backend->>Backend: 6. Generate JWT token<br/>(user_id, school_id, role)
    Backend-->>Frontend: 7. Return token + user info
    Frontend->>Frontend: 8. Store token (secure storage)
    Frontend-->>User: 9. Redirect to dashboard
    
    Note over User,Database: Subsequent Requests
    
    User->>Frontend: 10. Request protected resource
    Frontend->>Backend: 11. GET /api/grades<br/>Authorization: Bearer {token}
    Backend->>Backend: 12. Verify JWT signature
    Backend->>Backend: 13. Check token expiration
    Backend->>Backend: 14. Extract user_id, school_id, role
    Backend->>Backend: 15. Check permissions for resource
    Backend->>Database: 16. Query data (with school_id filter)
    Database-->>Backend: 17. Return filtered data
    Backend-->>Frontend: 18. Return JSON response
    Frontend-->>User: 19. Display data
```

---

## 5. Grade Entry & Calculation Flow

```mermaid
sequenceDiagram
    participant Teacher
    participant Frontend
    participant Backend
    participant CalcEngine as Calculation Engine
    participant Database
    
    Teacher->>Frontend: 1. Open grade entry form<br/>(Select Class, Subject, Term)
    Frontend->>Backend: 2. GET /api/classes/{id}/students
    Backend->>Database: 3. Query students in class
    Database-->>Backend: 4. Return student list
    Backend-->>Frontend: 5. Return students JSON
    Frontend-->>Teacher: 6. Display grade entry table
    
    Teacher->>Frontend: 7. Enter CA & Exam scores<br/>for all students
    Teacher->>Frontend: 8. Click "Submit Grades"
    Frontend->>Frontend: 9. Validate scores<br/>(within 0-100 range)
    Frontend->>Backend: 10. POST /api/grades/bulk<br/>[{student_id, ca, exam}, ...]
    
    Backend->>Backend: 11. Validate JWT & permissions
    Backend->>Backend: 12. Validate scores (range, format)
    Backend->>Database: 13. Insert/Update grade records
    Database-->>Backend: 14. Confirm save
    
    Backend->>CalcEngine: 15. Trigger calculation for class
    CalcEngine->>Database: 16. Get grading scale (CA%, Exam%)
    CalcEngine->>CalcEngine: 17. Calculate total = (CA * CA%) + (Exam * Exam%)
    CalcEngine->>Database: 18. Get all students' totals for class
    CalcEngine->>CalcEngine: 19. Calculate average across subjects
    CalcEngine->>CalcEngine: 20. Rank students by average (position)
    CalcEngine->>Database: 21. Update total, average, position
    Database-->>CalcEngine: 22. Confirm update
    
    CalcEngine-->>Backend: 23. Calculation complete
    Backend->>Database: 24. Log action to audit table
    Backend-->>Frontend: 25. Return success + updated grades
    Frontend-->>Teacher: 26. Display success message<br/>Show updated results
```

---

## 6. Report Generation Flow

```mermaid
sequenceDiagram
    participant Admin
    participant Frontend
    participant Backend
    participant ReportService as Report Service
    participant Database
    participant FileStorage
    participant EmailService
    
    Admin->>Frontend: 1. Navigate to Reports<br/>Select Term, Class
    Admin->>Frontend: 2. Click "Generate Reports"
    Frontend->>Backend: 3. POST /api/reports/generate<br/>{term_id, class_id}
    
    Backend->>Backend: 4. Validate permissions (Admin only)
    Backend->>Database: 5. Get students in class
    Database-->>Backend: 6. Return student list
    
    loop For each student
        Backend->>Database: 7. Get grades for term
        Backend->>Database: 8. Get school branding
        Backend->>ReportService: 9. Generate PDF<br/>(student data, grades, branding)
        ReportService->>ReportService: 10. Render HTML template
        ReportService->>ReportService: 11. Convert HTML to PDF
        ReportService->>FileStorage: 12. Save PDF file
        FileStorage-->>ReportService: 13. Return file URL
        ReportService-->>Backend: 14. Return PDF URL
        Backend->>Database: 15. Save report record
        Backend->>EmailService: 16. Send notification email<br/>(student/parent)
    end
    
    Backend-->>Frontend: 17. Return report generation summary
    Frontend-->>Admin: 18. Display success<br/>Show download links
```

---

## 7. Multi-Tenancy Isolation

```mermaid
graph TB
    subgraph "School A Users"
        UserA1["Admin A"]
        UserA2["Teacher A"]
        UserA3["Student A"]
    end
    
    subgraph "School B Users"
        UserB1["Admin B"]
        UserB2["Teacher B"]
        UserB3["Student B"]
    end
    
    subgraph "Backend API with Tenant Isolation"
        Middleware["Tenant Filter Middleware<br/>(Extracts school_id from JWT)"]
        QueryBuilder["Query Builder<br/>(Auto-adds WHERE school_id = X)"]
    end
    
    subgraph "Shared Database"
        SchoolA_Data["School A Data<br/>(school_id = 1)"]
        SchoolB_Data["School B Data<br/>(school_id = 2)"]
    end
    
    UserA1 -->|JWT: school_id=1| Middleware
    UserA2 -->|JWT: school_id=1| Middleware
    UserA3 -->|JWT: school_id=1| Middleware
    UserB1 -->|JWT: school_id=2| Middleware
    UserB2 -->|JWT: school_id=2| Middleware
    UserB3 -->|JWT: school_id=2| Middleware
    
    Middleware --> QueryBuilder
    QueryBuilder -->|WHERE school_id=1| SchoolA_Data
    QueryBuilder -->|WHERE school_id=2| SchoolB_Data
    
    style SchoolA_Data fill:#ffe1e1
    style SchoolB_Data fill:#e1f5ff
    style Middleware fill:#fffbe1
    style QueryBuilder fill:#fffbe1
```

---

## 8. Deployment Architecture (High-Level)

```mermaid
graph TB
    subgraph "Public Internet"
        Users["End Users<br/>(Browsers)"]
    end
    
    subgraph "Web Tier"
        CDN["CDN<br/>(Static Frontend Assets)"]
        LB["Load Balancer"]
    end
    
    subgraph "Application Tier"
        API1["API Server 1"]
        API2["API Server 2"]
        API3["API Server N"]
    end
    
    subgraph "Data Tier"
        DBPrimary["Primary Database"]
        DBReplica["Read Replica<br/>(Optional)"]
        FileStore["File Storage<br/>(S3/Blob)"]
        Cache["Cache Layer<br/>(Redis)"]
    end
    
    subgraph "External"
        Email["Email Service"]
    end
    
    Users -->|HTTPS| CDN
    Users -->|HTTPS| LB
    CDN -->|Serve SPA| Users
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> DBPrimary
    API2 --> DBPrimary
    API3 --> DBPrimary
    
    API1 --> DBReplica
    API2 --> DBReplica
    API3 --> DBReplica
    
    API1 --> FileStore
    API2 --> FileStore
    API3 --> FileStore
    
    API1 --> Cache
    API2 --> Cache
    API3 --> Cache
    
    API1 --> Email
    API2 --> Email
    API3 --> Email
    
    DBPrimary -->|Replication| DBReplica
    
    style Users fill:#e1f5ff
    style CDN fill:#fff4e1
    style LB fill:#fff4e1
    style API1 fill:#ffe1f5
    style API2 fill:#ffe1f5
    style API3 fill:#ffe1f5
    style DBPrimary fill:#e1ffe1
    style DBReplica fill:#e1ffe1
    style FileStore fill:#e1ffe1
    style Cache fill:#fffbe1
    style Email fill:#f5e1ff
```

---

## 9. Security Zones

```mermaid
graph TB
    subgraph "Public Zone - Untrusted"
        Internet["Internet<br/>(Untrusted Users)"]
    end
    
    subgraph "DMZ - Firewall Protected"
        LB["Load Balancer<br/>(SSL Termination)"]
        CDN["CDN<br/>(Static Content)"]
    end
    
    subgraph "Application Zone - Private Network"
        Backend["Backend API Servers<br/>(Authentication Required)"]
    end
    
    subgraph "Data Zone - Restricted Access"
        Database["Database<br/>(No Public Access)"]
        FileStorage["File Storage<br/>(No Public Access)"]
    end
    
    Internet -->|HTTPS Only| LB
    Internet -->|HTTPS Only| CDN
    LB -->|Internal Network| Backend
    Backend -->|Internal Network| Database
    Backend -->|Internal Network| FileStorage
    
    style Internet fill:#ffcccc
    style LB fill:#fff4cc
    style CDN fill:#fff4cc
    style Backend fill:#cce5ff
    style Database fill:#ccffcc
    style FileStorage fill:#ccffcc
```

---

## 10. Module Diagram - Frontend SPA

```mermaid
graph TB
    subgraph "Frontend Application"
        subgraph "Core Modules"
            Router["Router Module<br/>• Route definitions<br/>• Navigation guards<br/>• Protected routes"]
            Auth["Auth Module<br/>• Login/logout<br/>• Token management<br/>• Permission checks"]
            State["State Management<br/>• Global state<br/>• User session<br/>• Form data"]
        end
        
        subgraph "Feature Modules"
            AdminModule["Admin Module<br/>• School setup<br/>• User management<br/>• Grading config"]
            TeacherModule["Teacher Module<br/>• Grade entry<br/>• Class management<br/>• Result viewing"]
            StudentModule["Student Module<br/>• View results<br/>• Download reports<br/>• Historical data"]
            SharedModule["Shared Module<br/>• UI components<br/>• Utilities<br/>• Validators"]
        end
        
        subgraph "Services"
            API["API Service<br/>• HTTP client<br/>• Request interceptors<br/>• Error handling"]
            PDF["PDF Service<br/>• Preview reports<br/>• Download handling"]
        end
    end
    
    Router --> Auth
    Auth --> State
    AdminModule --> API
    TeacherModule --> API
    StudentModule --> API
    API --> State
    TeacherModule --> PDF
    StudentModule --> PDF
    
    SharedModule -.->|used by| AdminModule
    SharedModule -.->|used by| TeacherModule
    SharedModule -.->|used by| StudentModule
    
    style Router fill:#e1f5ff
    style Auth fill:#e1f5ff
    style State fill:#e1f5ff
    style AdminModule fill:#fff4e1
    style TeacherModule fill:#fff4e1
    style StudentModule fill:#fff4e1
    style SharedModule fill:#e1ffe1
    style API fill:#ffe1f5
    style PDF fill:#ffe1f5
```

---

## 11. Module Diagram - Backend API

```mermaid
graph TB
    subgraph "Backend Application"
        subgraph "Infrastructure Layer"
            Server["HTTP Server<br/>• Express/FastAPI/etc<br/>• Request handling<br/>• CORS config"]
            Middleware["Middleware<br/>• JWT validation<br/>• Error handling<br/>• Logging"]
        end
        
        subgraph "API Layer"
            AuthController["Auth Controller<br/>• /api/auth/*"]
            UserController["User Controller<br/>• /api/users/*"]
            GradeController["Grade Controller<br/>• /api/grades/*"]
            ReportController["Report Controller<br/>• /api/reports/*"]
            SetupController["Setup Controller<br/>• /api/setup/*"]
        end
        
        subgraph "Business Logic Layer"
            AuthService["Auth Service"]
            UserService["User Service"]
            GradeService["Grade Service"]
            CalcEngine["Calculation Engine"]
            ReportService["Report Service"]
        end
        
        subgraph "Data Access Layer"
            ORM["ORM / Query Builder"]
            Repositories["Repositories<br/>• UserRepo<br/>• GradeRepo<br/>• ReportRepo"]
        end
        
        subgraph "External Integrations"
            EmailAdapter["Email Adapter"]
            FileAdapter["File Storage Adapter"]
        end
    end
    
    Server --> Middleware
    Middleware --> AuthController
    Middleware --> UserController
    Middleware --> GradeController
    Middleware --> ReportController
    Middleware --> SetupController
    
    AuthController --> AuthService
    UserController --> UserService
    GradeController --> GradeService
    GradeService --> CalcEngine
    ReportController --> ReportService
    
    AuthService --> Repositories
    UserService --> Repositories
    GradeService --> Repositories
    ReportService --> Repositories
    
    Repositories --> ORM
    ORM --> DB[(Database)]
    
    AuthService --> EmailAdapter
    ReportService --> EmailAdapter
    ReportService --> FileAdapter
    
    style Server fill:#e1f5ff
    style Middleware fill:#e1f5ff
    style AuthController fill:#fff4e1
    style UserController fill:#fff4e1
    style GradeController fill:#fff4e1
    style ReportController fill:#fff4e1
    style SetupController fill:#fff4e1
    style AuthService fill:#ffe1f5
    style UserService fill:#ffe1f5
    style GradeService fill:#ffe1f5
    style CalcEngine fill:#ffe1f5
    style ReportService fill:#ffe1f5
    style ORM fill:#e1ffe1
    style Repositories fill:#e1ffe1
    style EmailAdapter fill:#f5e1ff
    style FileAdapter fill:#f5e1ff
```

---

## 12. Summary

This architecture provides:

✅ **Clear separation of concerns** - Frontend, Backend, Database  
✅ **Scalability** - Stateless API, horizontal scaling  
✅ **Security** - JWT auth, RBAC, data encryption, tenant isolation  
✅ **Maintainability** - Modular design, clear interfaces  
✅ **Performance** - Caching, database optimization, async operations  
✅ **Reliability** - Error handling, audit logs, backups  

---

**Next Steps:**
1. Review and approve architecture diagrams
2. Document detailed data flow scenarios
3. Define deployment boundaries and environments
4. Proceed to Stage 7: Technical Specifications

---

**Status:** Ready for Review  
**Approver:** Product Owner, Technical Lead  
**Last Updated:** 2026-01-11
