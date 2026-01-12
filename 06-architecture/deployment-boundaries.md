# Deployment Boundaries
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-11  
**Owner:** Software Architect  
**Status:** Draft

---

## Overview

This document defines the deployment boundaries, trust zones, environment configurations, and infrastructure requirements for SRMS. It outlines the separation between development, staging, and production environments, as well as security boundaries and scaling considerations.

---

## 1. Deployment Environments

### 1.1 Environment Types

```mermaid
graph TB
    subgraph "Development Environment"
        DevLocal["Developer Laptop<br/>• Local database<br/>• Local file storage<br/>• Mock email service"]
    end
    
    subgraph "Staging Environment (Cloud)"
        StagingFrontend["Frontend (CDN)<br/>staging.srms.com"]
        StagingBackend["Backend API<br/>api-staging.srms.com"]
        StagingDB["Database<br/>Shared instance"]
        StagingStorage["File Storage<br/>Staging bucket"]
    end
    
    subgraph "Production Environment (Cloud)"
        ProdFrontend["Frontend (CDN)<br/>app.srms.com"]
        ProdLB["Load Balancer"]
        ProdBackend1["Backend API 1"]
        ProdBackend2["Backend API 2"]
        ProdBackendN["Backend API N"]
        ProdDB["Primary Database"]
        ProdDBReplica["Read Replica"]
        ProdStorage["File Storage<br/>Production bucket"]
        ProdCache["Cache (Redis)"]
    end
    
    DevLocal -.->|Deploy| StagingFrontend
    DevLocal -.->|Deploy| StagingBackend
    
    StagingFrontend -.->|Promote| ProdFrontend
    StagingBackend -.->|Promote| ProdLB
    
    ProdLB --> ProdBackend1
    ProdLB --> ProdBackend2
    ProdLB --> ProdBackendN
    
    ProdBackend1 --> ProdDB
    ProdBackend2 --> ProdDB
    ProdBackendN --> ProdDB
    
    ProdBackend1 --> ProdDBReplica
    ProdBackend2 --> ProdDBReplica
    ProdBackendN --> ProdDBReplica
    
    ProdBackend1 --> ProdCache
    ProdBackend2 --> ProdCache
    ProdBackendN --> ProdCache
    
    style DevLocal fill:#e1f5ff
    style StagingFrontend fill:#fff4e1
    style StagingBackend fill:#fff4e1
    style StagingDB fill:#e1ffe1
    style StagingStorage fill:#e1ffe1
    style ProdFrontend fill:#ffe1e1
    style ProdLB fill:#ffe1e1
    style ProdBackend1 fill:#ffe1e1
    style ProdBackend2 fill:#ffe1e1
    style ProdBackendN fill:#ffe1e1
    style ProdDB fill:#ccffcc
    style ProdDBReplica fill:#ccffcc
    style ProdStorage fill:#ccffcc
    style ProdCache fill:#fff4cc
```

---

### 1.2 Environment Characteristics

| Aspect | Development | Staging | Production |
|--------|-------------|---------|------------|
| **Purpose** | Local development & testing | Pre-production validation | Live system for users |
| **Location** | Developer machines | Cloud (shared resources) | Cloud (dedicated resources) |
| **Database** | SQLite or local PostgreSQL | Shared PostgreSQL | Dedicated PostgreSQL cluster |
| **Data** | Seed/dummy data | Anonymized production data | Real user data |
| **File Storage** | Local disk | Cloud bucket (staging) | Cloud bucket (production) |
| **Email** | Console logs or Mailtrap | Test email service (Mailtrap) | Live email service (SendGrid) |
| **Users** | Developers only | QA, stakeholders | Schools, teachers, students |
| **Uptime SLA** | None | None | 99.5% |
| **Backup** | None | Daily (7-day retention) | Hourly incremental, daily full (30-day retention) |
| **Monitoring** | Optional | Basic logging | Full monitoring & alerts |
| **SSL/TLS** | Optional (self-signed) | Yes (valid certificate) | Yes (valid certificate) |
| **Scaling** | N/A | Vertical only | Horizontal + vertical |
| **Cost** | Free (local) | Low (shared) | Variable (based on usage) |

---

## 2. Trust Zones & Security Boundaries

### 2.1 Network Security Zones

```mermaid
graph TB
    subgraph "Public Zone (Untrusted)"
        Internet["Internet Users<br/>Students, Teachers, Parents<br/>Admins"]
    end
    
    subgraph "Demilitarized Zone (DMZ)"
        Firewall1["Firewall<br/>HTTPS Only<br/>Port 443"]
        CDN["CDN<br/>Static Assets<br/>Frontend SPA"]
        LoadBalancer["Load Balancer<br/>SSL Termination<br/>DDoS Protection"]
    end
    
    subgraph "Application Zone (Private Network)"
        Firewall2["Internal Firewall"]
        APIServers["Backend API Servers<br/>Private IPs<br/>No public access"]
        AppCache["Cache Server<br/>Redis"]
    end
    
    subgraph "Data Zone (Restricted Access)"
        Firewall3["Database Firewall"]
        Database["Database Cluster<br/>Private subnet<br/>No internet access"]
        FileStorage["File Storage<br/>Private bucket<br/>Signed URLs only"]
        BackupStorage["Backup Storage<br/>Encrypted<br/>Offsite"]
    end
    
    Internet -->|HTTPS| Firewall1
    Firewall1 --> CDN
    Firewall1 --> LoadBalancer
    LoadBalancer -->|Internal Network| Firewall2
    Firewall2 --> APIServers
    APIServers --> AppCache
    APIServers -->|Query| Firewall3
    Firewall3 --> Database
    APIServers -->|Read/Write| FileStorage
    Database -.->|Automated Backup| BackupStorage
    
    style Internet fill:#ffcccc
    style Firewall1 fill:#ffeecc
    style CDN fill:#fff4cc
    style LoadBalancer fill:#fff4cc
    style Firewall2 fill:#ffffcc
    style APIServers fill:#cce5ff
    style AppCache fill:#cce5ff
    style Firewall3 fill:#ccffcc
    style Database fill:#ccffcc
    style FileStorage fill:#ccffcc
    style BackupStorage fill:#e6ffe6
```

---

### 2.2 Access Control Matrix

| Zone | Who Can Access | How | Restrictions |
|------|----------------|-----|--------------|
| **Public Zone** | Anyone on the internet | Web browser | Rate limiting, CAPTCHA on login |
| **DMZ** | Public via HTTPS | HTTPS only | DDoS protection, WAF rules |
| **Application Zone** | Load balancer only | Internal network | No direct public access |
| **Data Zone** | API servers only | Private subnet | IP whitelist, no internet gateway |
| **Backup Storage** | Automated backup service | Encrypted connection | Read-only for disaster recovery |

---

### 2.3 Data Flow Across Trust Zones

```mermaid
sequenceDiagram
    participant User as User (Public Zone)
    participant LB as Load Balancer (DMZ)
    participant API as API Server (App Zone)
    participant DB as Database (Data Zone)
    
    Note over User,DB: Secure Request Flow
    
    User->>LB: 1. HTTPS Request<br/>(Port 443)
    LB->>LB: 2. SSL Termination<br/>Decrypt HTTPS
    LB->>LB: 3. DDoS Check<br/>Rate Limiting
    LB->>API: 4. HTTP (Internal Network)<br/>Private IP
    API->>API: 5. JWT Validation
    API->>API: 6. Permission Check
    API->>DB: 7. SQL Query<br/>(Private Subnet)
    DB-->>API: 8. Query Result<br/>(Encrypted in transit)
    API->>API: 9. Data Processing
    API-->>LB: 10. HTTP Response
    LB->>LB: 11. Encrypt Response (HTTPS)
    LB-->>User: 12. HTTPS Response<br/>(Port 443)
```

**Security Measures:**

1. **TLS Encryption** - All public traffic encrypted (HTTPS)
2. **Private Subnets** - Database not accessible from internet
3. **JWT Validation** - Every API request requires valid token
4. **IP Whitelisting** - Database only accepts connections from API servers
5. **Principle of Least Privilege** - Each component has minimal permissions

---

## 3. Infrastructure Components

### 3.1 Production Infrastructure (AWS Example)

```mermaid
graph TB
    subgraph "AWS Cloud - Production"
        subgraph "Public Subnet (DMZ)"
            Route53["Route 53<br/>DNS Management<br/>app.srms.com<br/>api.srms.com"]
            CloudFront["CloudFront CDN<br/>Frontend Distribution<br/>Global Edge Locations"]
            ALB["Application Load Balancer<br/>SSL Certificate (ACM)<br/>Health Checks"]
        end
        
        subgraph "Private Subnet 1 (AZ-1)"
            API1["EC2 Instance<br/>Backend API Server 1"]
            RDS1["RDS Primary<br/>PostgreSQL"]
        end
        
        subgraph "Private Subnet 2 (AZ-2)"
            API2["EC2 Instance<br/>Backend API Server 2"]
            RDS2["RDS Read Replica<br/>PostgreSQL"]
        end
        
        subgraph "ElastiCache"
            Redis["Redis Cluster<br/>Multi-AZ"]
        end
        
        subgraph "Storage"
            S3Frontend["S3 Bucket<br/>Frontend Assets<br/>Public Read"]
            S3Files["S3 Bucket<br/>Uploaded Files<br/>Private + Signed URLs"]
            S3Reports["S3 Bucket<br/>Generated Reports<br/>Private + Signed URLs"]
            S3Backups["S3 Bucket<br/>Database Backups<br/>Encrypted + Versioned"]
        end
        
        subgraph "Monitoring & Logging"
            CloudWatch["CloudWatch<br/>Logs & Metrics"]
            SNS["SNS<br/>Alerting (Email/SMS)"]
        end
        
        subgraph "External Services"
            SES["AWS SES<br/>Email Sending"]
        end
    end
    
    Route53 --> CloudFront
    Route53 --> ALB
    CloudFront --> S3Frontend
    
    ALB --> API1
    ALB --> API2
    
    API1 --> RDS1
    API2 --> RDS1
    API1 --> RDS2
    API2 --> RDS2
    
    API1 --> Redis
    API2 --> Redis
    
    API1 --> S3Files
    API2 --> S3Files
    API1 --> S3Reports
    API2 --> S3Reports
    
    API1 --> SES
    API2 --> SES
    
    RDS1 -.->|Replication| RDS2
    RDS1 -.->|Automated Backup| S3Backups
    
    API1 --> CloudWatch
    API2 --> CloudWatch
    RDS1 --> CloudWatch
    CloudWatch --> SNS
    
    style Route53 fill:#ff9999
    style CloudFront fill:#ff9999
    style ALB fill:#ff9999
    style API1 fill:#99ccff
    style API2 fill:#99ccff
    style RDS1 fill:#99ff99
    style RDS2 fill:#99ff99
    style Redis fill:#ffff99
    style S3Frontend fill:#ffcc99
    style S3Files fill:#ffcc99
    style S3Reports fill:#ffcc99
    style S3Backups fill:#ccffcc
    style CloudWatch fill:#cc99ff
    style SNS fill:#cc99ff
    style SES fill:#ffccff
```

---

### 3.2 Component Specifications (Production)

| Component | Technology | Quantity | Specifications | Purpose |
|-----------|-----------|----------|----------------|---------|
| **Frontend Hosting** | CloudFront + S3 | 1 distribution | Global CDN | Serve SPA assets |
| **Load Balancer** | AWS ALB | 1 | Multi-AZ, SSL termination | Route traffic, health checks |
| **API Servers** | EC2 (or containers) | 2-5 (auto-scale) | t3.medium (2 vCPU, 4GB RAM) | Run backend application |
| **Database** | RDS PostgreSQL | 1 primary + 1 replica | db.t3.medium (2 vCPU, 4GB RAM, 100GB SSD) | Store application data |
| **Cache** | ElastiCache Redis | 1 cluster | cache.t3.micro (1 node) | Cache frequently accessed data |
| **File Storage** | S3 | 3 buckets | Standard storage class | Frontend, files, reports |
| **Backup Storage** | S3 | 1 bucket | S3 Glacier for long-term | Automated database backups |
| **Email Service** | AWS SES | 1 account | Pay per email | Send transactional emails |
| **Monitoring** | CloudWatch | 1 | Logs, metrics, alarms | Monitor system health |
| **DNS** | Route 53 | 1 hosted zone | Low latency routing | Domain management |

---

### 3.3 Alternative Cloud Providers

**Azure Equivalent:**

| AWS | Azure |
|-----|-------|
| CloudFront | Azure CDN |
| ALB | Application Gateway |
| EC2 | Virtual Machines / App Service |
| RDS PostgreSQL | Azure Database for PostgreSQL |
| ElastiCache | Azure Cache for Redis |
| S3 | Blob Storage |
| SES | SendGrid (marketplace) |
| CloudWatch | Azure Monitor |
| Route 53 | Azure DNS |

**GCP Equivalent:**

| AWS | GCP |
|-----|-----|
| CloudFront | Cloud CDN |
| ALB | Cloud Load Balancing |
| EC2 | Compute Engine / Cloud Run |
| RDS PostgreSQL | Cloud SQL for PostgreSQL |
| ElastiCache | Memorystore for Redis |
| S3 | Cloud Storage |
| SES | SendGrid (partner) |
| CloudWatch | Cloud Monitoring |
| Route 53 | Cloud DNS |

---

## 4. Scaling Strategy

### 4.1 Horizontal Scaling (Production)

```mermaid
graph TB
    subgraph "Traffic Growth Scenario"
        Users1["1,000 Users<br/>10 Schools"] --> Config1["2 API Servers<br/>1 Database<br/>Cost: $200/month"]
        Users2["5,000 Users<br/>50 Schools"] --> Config2["3 API Servers<br/>1 DB + 1 Replica<br/>Cost: $400/month"]
        Users3["20,000 Users<br/>200 Schools"] --> Config3["5 API Servers<br/>1 DB + 2 Replicas<br/>Redis Cluster<br/>Cost: $800/month"]
        Users4["100,000 Users<br/>1,000 Schools"] --> Config4["10 API Servers<br/>Multi-region DB<br/>CDN + Redis<br/>Cost: $2,000/month"]
    end
    
    Config1 -.->|Growth| Config2
    Config2 -.->|Growth| Config3
    Config3 -.->|Growth| Config4
    
    style Users1 fill:#e1f5ff
    style Users2 fill:#fff4e1
    style Users3 fill:#ffe1f5
    style Users4 fill:#f5e1ff
```

---

### 4.2 Auto-Scaling Configuration

**Frontend:** No scaling needed (CDN handles unlimited traffic)

**Backend API Servers:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| **CPU Utilization** | > 70% for 5 minutes | Add 1 instance |
| **CPU Utilization** | < 30% for 10 minutes | Remove 1 instance |
| **Request Count** | > 1,000 req/sec | Add 1 instance |
| **Min Instances** | 2 (high availability) | Always running |
| **Max Instances** | 10 (cost control) | Hard limit |
| **Cooldown Period** | 5 minutes | Between scaling events |

**Database:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| **CPU Utilization** | > 80% for 10 minutes | Upgrade instance type (vertical) |
| **Storage** | > 80% full | Increase storage capacity |
| **Read Load** | > 1,000 queries/sec | Add read replica |
| **Connection Count** | > 80% of max | Optimize queries or add read replica |

---

### 4.3 Performance Targets by Scale

| Scale | Schools | Students | Concurrent Users | Response Time | Uptime SLA |
|-------|---------|----------|------------------|---------------|------------|
| **MVP** | 1-10 | < 5,000 | 50 | < 2 sec | 99% |
| **Growth** | 10-100 | 5,000-50,000 | 500 | < 1 sec | 99.5% |
| **Scale** | 100-500 | 50,000-250,000 | 2,500 | < 1 sec | 99.9% |
| **Enterprise** | 500+ | 250,000+ | 10,000+ | < 500ms | 99.95% |

---

## 5. Disaster Recovery & Business Continuity

### 5.1 Backup Strategy

**Database Backups:**

| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| **Incremental** | Every 6 hours | 7 days | S3 Standard |
| **Full Backup** | Daily at 2 AM UTC | 30 days | S3 Standard |
| **Weekly Snapshot** | Sunday 2 AM UTC | 90 days | S3 Glacier |
| **Point-in-Time Recovery** | Continuous (5-minute granularity) | 7 days | RDS automated |

**File Storage Backups:**

| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| **Versioning** | On every file change | 30 versions | S3 Versioning |
| **Cross-Region Replication** | Continuous | Indefinite | S3 (DR region) |

---

### 5.2 Disaster Recovery Plan

```mermaid
flowchart TD
    Disaster[Disaster Event<br/>Database Failure<br/>Region Outage] --> Detect[Detection<br/>Monitoring alerts<br/>Health check fails]
    
    Detect --> Assess{Severity}
    
    Assess -->|Minor<br/>Single component failure| Failover1[Automatic Failover<br/>Switch to replica<br/>RTO: 5 minutes]
    Assess -->|Major<br/>Region-wide outage| Failover2[Manual Failover<br/>Restore from backup<br/>RTO: 1 hour]
    Assess -->|Critical<br/>Data corruption| Failover3[Point-in-Time Recovery<br/>Restore to last known good state<br/>RTO: 2 hours]
    
    Failover1 --> Verify[Verify System Health]
    Failover2 --> Verify
    Failover3 --> Verify
    
    Verify -->|Pass| Resume[Resume Normal Operations<br/>Notify users]
    Verify -->|Fail| Escalate[Escalate to Engineering<br/>Activate war room]
    
    Resume --> PostMortem[Post-Mortem Analysis<br/>Document incident<br/>Improve resilience]
    Escalate --> Debug[Debug & Fix<br/>Apply patches]
    Debug --> Verify
```

**Recovery Objectives:**

| Scenario | RTO (Recovery Time Objective) | RPO (Recovery Point Objective) |
|----------|-------------------------------|-------------------------------|
| **Single API server failure** | < 1 minute (auto failover) | 0 (no data loss) |
| **Database replica failure** | < 5 minutes (automatic) | 0 (no data loss) |
| **Database primary failure** | < 10 minutes (promote replica) | < 5 minutes |
| **Region-wide outage** | < 1 hour (restore from backup) | < 1 hour (hourly backups) |
| **Data corruption** | < 2 hours (point-in-time recovery) | < 5 minutes (transaction logs) |
| **Complete data loss** | < 4 hours (restore from offsite backup) | < 24 hours (daily backups) |

---

### 5.3 High Availability Architecture

```mermaid
graph TB
    subgraph "Availability Zone 1"
        API1["API Server 1<br/>Active"]
        DB1["Database Primary<br/>Active"]
    end
    
    subgraph "Availability Zone 2"
        API2["API Server 2<br/>Active"]
        DB2["Database Replica<br/>Standby"]
    end
    
    LB["Load Balancer<br/>Multi-AZ"]
    
    LB --> API1
    LB --> API2
    
    API1 --> DB1
    API2 --> DB1
    API1 -.->|Failover reads| DB2
    API2 -.->|Failover reads| DB2
    
    DB1 -.->|Synchronous Replication| DB2
    
    Note1["If API1 fails:<br/>Traffic routes to API2"] -.-> API1
    Note2["If DB1 fails:<br/>Promote DB2 to primary"] -.-> DB1
    
    style API1 fill:#99ff99
    style API2 fill:#99ff99
    style DB1 fill:#99ccff
    style DB2 fill:#ffcc99
    style LB fill:#ff9999
```

**High Availability Features:**

✅ **Multi-AZ Deployment** - Resources distributed across availability zones  
✅ **Load Balancer Health Checks** - Automatically route traffic away from failed servers  
✅ **Database Replication** - Synchronous replication for zero data loss  
✅ **Automated Failover** - RDS automatically promotes replica if primary fails  
✅ **Redundant API Servers** - Minimum 2 servers always running  
✅ **CDN Edge Caching** - Frontend remains available even if backend is down (cached content)

---

## 6. Deployment Process (CI/CD)

### 6.1 Continuous Integration & Deployment Pipeline

```mermaid
flowchart LR
    subgraph "Development"
        Dev[Developer<br/>Commits Code] --> Git[Git Push<br/>to GitHub]
    end
    
    subgraph "CI Pipeline (GitHub Actions)"
        Git --> Test[Run Tests<br/>Unit + Integration]
        Test --> Lint[Linting<br/>Code Quality]
        Lint --> Build[Build Artifacts<br/>Frontend + Backend]
        Build --> ScanSec[Security Scan<br/>Dependencies]
    end
    
    subgraph "Staging Deployment"
        ScanSec --> DeployStaging[Deploy to Staging<br/>Automated]
        DeployStaging --> E2E[E2E Tests<br/>Automated]
        E2E --> ManualQA[Manual QA<br/>Stakeholder Review]
    end
    
    subgraph "Production Deployment"
        ManualQA -->|Approve| DeployProd[Deploy to Production<br/>Blue-Green]
        DeployProd --> SmokeTest[Smoke Tests<br/>Health Checks]
        SmokeTest --> Monitor[Monitor Metrics<br/>for 1 hour]
    end
    
    Monitor -->|Success| Done[Deployment Complete]
    Monitor -->|Errors Detected| Rollback[Automatic Rollback<br/>to Previous Version]
    Rollback --> Alert[Alert DevOps Team]
    
    style Dev fill:#e1f5ff
    style Test fill:#fff4e1
    style Lint fill:#fff4e1
    style Build fill:#fff4e1
    style DeployStaging fill:#ffe1f5
    style DeployProd fill:#ffcccc
    style Rollback fill:#ff9999
    style Done fill:#99ff99
```

---

### 6.2 Deployment Boundaries by Component

| Component | Development | Staging | Production |
|-----------|-------------|---------|------------|
| **Frontend SPA** | Local dev server (`npm run dev`) | S3 + CloudFront (staging subdomain) | S3 + CloudFront (production domain) |
| **Backend API** | Local process (`npm start`) | Single EC2 instance | Auto-scaled EC2 instances behind ALB |
| **Database** | Local PostgreSQL or SQLite | Shared RDS instance | Dedicated RDS with replica |
| **File Storage** | Local file system | S3 bucket (staging prefix) | S3 buckets (production, isolated) |
| **Email Service** | Console logs | Mailtrap (test inbox) | AWS SES (live sending) |
| **Domain** | localhost:3000 | staging.srms.com | app.srms.com |

---

### 6.3 Blue-Green Deployment Strategy

```mermaid
graph TB
    subgraph "Production Environment"
        LB["Load Balancer"]
        
        subgraph "Blue Environment (Current)"
            BlueAPI1["API Server v1.0<br/>Receiving 100% traffic"]
            BlueAPI2["API Server v1.0<br/>Receiving 100% traffic"]
        end
        
        subgraph "Green Environment (New)"
            GreenAPI1["API Server v1.1<br/>Ready, not receiving traffic"]
            GreenAPI2["API Server v1.1<br/>Ready, not receiving traffic"]
        end
        
        DB["Database (Shared)"]
    end
    
    LB -->|100% traffic| BlueAPI1
    LB -->|100% traffic| BlueAPI2
    LB -.->|0% traffic| GreenAPI1
    LB -.->|0% traffic| GreenAPI2
    
    BlueAPI1 --> DB
    BlueAPI2 --> DB
    GreenAPI1 --> DB
    GreenAPI2 --> DB
    
    Note1["Step 1: Deploy v1.1 to Green"] -.-> GreenAPI1
    Note2["Step 2: Smoke test Green"] -.-> GreenAPI1
    Note3["Step 3: Switch traffic to Green<br/>Blue becomes standby"] -.-> LB
    Note4["Step 4: Monitor for issues"] -.-> LB
    Note5["Step 5: If OK, decommission Blue<br/>If errors, rollback to Blue"] -.-> LB
    
    style BlueAPI1 fill:#99ccff
    style BlueAPI2 fill:#99ccff
    style GreenAPI1 fill:#99ff99
    style GreenAPI2 fill:#99ff99
    style LB fill:#ffcc99
    style DB fill:#ff9999
```

**Deployment Steps:**

1. **Deploy to Green** - Deploy new version to green environment (zero downtime)
2. **Health Check** - Verify green environment is healthy
3. **Smoke Test** - Run automated smoke tests against green
4. **Traffic Switch** - Load balancer routes 100% traffic to green
5. **Monitor** - Watch metrics for 1 hour
6. **Rollback or Commit** - If errors, switch back to blue; if OK, decommission blue

**Rollback Time:** < 1 minute (instant traffic switch)

---

## 7. Security Boundaries

### 7.1 Defense in Depth

```mermaid
graph TB
    subgraph "Layer 1: Perimeter Security"
        WAF["Web Application Firewall<br/>• SQL injection protection<br/>• XSS protection<br/>• Rate limiting"]
        DDoS["DDoS Protection<br/>• AWS Shield<br/>• Rate limiting"]
    end
    
    subgraph "Layer 2: Network Security"
        VPC["Virtual Private Cloud<br/>• Private subnets<br/>• Network ACLs<br/>• Security groups"]
        Firewall["Firewalls<br/>• Port restrictions<br/>• IP whitelisting"]
    end
    
    subgraph "Layer 3: Application Security"
        Auth["Authentication<br/>• JWT tokens<br/>• Password hashing<br/>• MFA (future)"]
        RBAC["Authorization<br/>• Role-based access<br/>• Tenant isolation<br/>• Permission checks"]
    end
    
    subgraph "Layer 4: Data Security"
        Encryption["Encryption<br/>• TLS in transit<br/>• AES-256 at rest<br/>• Encrypted backups"]
        Audit["Audit Logging<br/>• All data modifications<br/>• Login attempts<br/>• Admin actions"]
    end
    
    subgraph "Layer 5: Monitoring & Response"
        Monitor["Monitoring<br/>• CloudWatch<br/>• Security alerts<br/>• Anomaly detection"]
        Incident["Incident Response<br/>• Alert escalation<br/>• War room procedures<br/>• Post-mortem analysis"]
    end
    
    User[Internet User] --> WAF
    WAF --> DDoS
    DDoS --> VPC
    VPC --> Firewall
    Firewall --> Auth
    Auth --> RBAC
    RBAC --> Encryption
    Encryption --> Audit
    Audit --> Monitor
    Monitor --> Incident
    
    style WAF fill:#ffcccc
    style DDoS fill:#ffcccc
    style VPC fill:#ffe6cc
    style Firewall fill:#ffe6cc
    style Auth fill:#ffffcc
    style RBAC fill:#ffffcc
    style Encryption fill:#ccffcc
    style Audit fill:#ccffcc
    style Monitor fill:#cce6ff
    style Incident fill:#cce6ff
```

---

### 7.2 Compliance & Data Privacy

**Data Residency:**

| Data Type | Storage Location | Compliance |
|-----------|------------------|------------|
| **User Data** | AWS region (configurable) | GDPR, local data protection laws |
| **Student Records** | Primary database (encrypted) | FERPA (US), GDPR (EU) |
| **Backup Data** | Offsite storage (encrypted) | Same as primary |
| **Logs** | CloudWatch (region-specific) | Retain for 90 days, then archive |

**Encryption Standards:**

- **In Transit:** TLS 1.3 (minimum TLS 1.2)
- **At Rest:** AES-256 encryption
- **Backups:** Encrypted before upload
- **Passwords:** bcrypt (cost factor 12)
- **JWT Secrets:** Rotated every 90 days

---

## 8. Cost Estimation (Monthly)

### 8.1 Infrastructure Costs (AWS, Production)

| Component | Specification | Monthly Cost (USD) |
|-----------|--------------|-------------------|
| **Frontend Hosting** | CloudFront + S3 (100GB transfer) | $15 |
| **Load Balancer** | ALB (2 AZs, 1M requests) | $25 |
| **API Servers** | 2 × t3.medium (730 hours) | $60 |
| **Database** | db.t3.medium (primary + replica) | $120 |
| **Cache** | ElastiCache t3.micro | $12 |
| **File Storage** | S3 Standard (50GB) | $1.50 |
| **Backup Storage** | S3 Glacier (200GB) | $1 |
| **Email Service** | SES (10,000 emails) | $1 |
| **Monitoring** | CloudWatch logs & metrics | $10 |
| **Domain & SSL** | Route 53 + ACM certificate | $1 |
| **Data Transfer** | 100GB outbound | $9 |
| **Total (Base)** | 10 schools, 5,000 students | **~$255/month** |

**Scaling Costs:**

| Scale | Schools | API Servers | Database | Total Cost/Month |
|-------|---------|-------------|----------|------------------|
| **MVP (10 schools)** | 10 | 2 × t3.medium | db.t3.medium | $255 |
| **Growth (50 schools)** | 50 | 3 × t3.large | db.t3.large | $450 |
| **Scale (200 schools)** | 200 | 5 × t3.large | db.r5.large + replica | $850 |
| **Enterprise (1000 schools)** | 1000 | 10 × t3.xlarge | db.r5.xlarge + 2 replicas | $2,500 |

---

## 9. Summary of Deployment Boundaries

| Boundary Type | Development | Staging | Production |
|---------------|-------------|---------|------------|
| **Physical Location** | Local machine | Cloud (shared) | Cloud (isolated) |
| **Network** | Localhost | Private VPC | Multi-AZ VPC |
| **Database** | Local instance | Shared RDS | Dedicated RDS cluster |
| **File Storage** | Local disk | S3 (staging bucket) | S3 (production buckets) |
| **Security** | Minimal | Basic (HTTPS) | Full (WAF, DDoS, encryption) |
| **Monitoring** | None | Basic logging | Full monitoring + alerts |
| **Backup** | None | Daily | Hourly incremental + daily full |
| **Uptime SLA** | None | None | 99.5% |
| **Scaling** | N/A | Vertical only | Horizontal + vertical |
| **Cost** | Free | ~$50/month | $255-$2,500/month |

---

**Next Steps:**
1. Review deployment boundaries and infrastructure plan
2. Approve cloud provider selection (AWS/Azure/GCP)
3. Approve disaster recovery and backup strategy
4. Proceed to Stage 7: Technical Specifications (select specific frameworks and tools)

---

**Status:** Ready for Review  
**Approver:** Product Owner, CTO, DevOps Lead  
**Last Updated:** 2026-01-11
