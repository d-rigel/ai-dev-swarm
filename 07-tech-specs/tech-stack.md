# Technology Stack
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-12  
**Owner:** Tech Manager  
**Status:** Approved

---

## Executive Summary

This document defines the final technology stack for SRMS based on research findings. All technology decisions are aligned with project requirements for performance, scalability, maintainability, and cost-effectiveness.

---

## 1. Core Technology Stack

### 1.1 Programming Languages

| Component | Language | Version | Rationale |
|-----------|----------|---------|-----------|
| **Frontend** | TypeScript | 5.3+ | Type safety, better IDE support, fewer runtime errors |
| **Backend** | TypeScript | 5.3+ | Shared language across stack, type-safe APIs |
| **Database Queries** | SQL (via Prisma ORM) | - | Type-safe database access |
| **Build Scripts** | TypeScript/Node.js | 20.x LTS | Consistency across tooling |

**TypeScript Configuration:**
- **strict mode**: Enabled for maximum type safety
- **target**: ES2022
- **module**: ESNext (frontend), CommonJS (backend)
- **lib**: DOM, ES2022

---

### 1.2 Frontend Stack

```
┌─────────────────────────────────────────┐
│          Browser (Client)               │
├─────────────────────────────────────────┤
│  React 18.2+ (UI Library)               │
│  - Functional components + Hooks        │
│  - Concurrent rendering                 │
│  - Automatic batching                   │
├─────────────────────────────────────────┤
│  Vite 5.0+ (Build Tool)                 │
│  - Fast HMR (Hot Module Replacement)    │
│  - Optimized production builds          │
│  - Built-in TypeScript support          │
├─────────────────────────────────────────┤
│  Material-UI (MUI) 5.15+ (Components)   │
│  - Pre-built components                 │
│  - Customizable theme                   │
│  - Responsive design system             │
├─────────────────────────────────────────┤
│  React Router 6.21+ (Routing)           │
│  - Client-side routing                  │
│  - Nested routes                        │
│  - Route protection (auth guards)       │
├─────────────────────────────────────────┤
│  Zustand 4.4+ (State Management)        │
│  - Lightweight (1KB)                    │
│  - Simple API                           │
│  - No boilerplate                       │
├─────────────────────────────────────────┤
│  Axios 1.6+ (HTTP Client)               │
│  - Interceptors for JWT                 │
│  - Request/response transformation      │
│  - Error handling                       │
├─────────────────────────────────────────┤
│  React Hook Form 7.49+ (Forms)          │
│  - Performant (uncontrolled)            │
│  - Built-in validation                  │
│  - TypeScript support                   │
├─────────────────────────────────────────┤
│  Zod 3.22+ (Schema Validation)          │
│  - Type-safe validation                 │
│  - Composable schemas                   │
│  - Error messages                       │
└─────────────────────────────────────────┘
```

**Additional Frontend Libraries:**

| Library | Version | Purpose |
|---------|---------|---------|
| **react-pdf** | 7.5+ | PDF viewing in browser |
| **recharts** | 2.10+ | Charts and graphs (performance trends) |
| **date-fns** | 3.0+ | Date formatting and manipulation |
| **react-hot-toast** | 2.4+ | Toast notifications |
| **react-table** | 8.10+ | Advanced data tables (grade entry) |
| **react-query** | 5.17+ | Server state management, caching |

---

### 1.3 Backend Stack

```
┌─────────────────────────────────────────┐
│          NestJS 10.3+ (Framework)       │
│  - Modular architecture                 │
│  - Dependency injection                 │
│  - Built-in middleware support          │
│  - Decorator-based routing              │
├─────────────────────────────────────────┤
│  Node.js 20.11+ LTS (Runtime)           │
│  - V8 JavaScript engine                 │
│  - Event-driven, non-blocking I/O       │
│  - npm ecosystem                        │
├─────────────────────────────────────────┤
│  Express 4.18+ (HTTP Server)            │
│  - Used internally by NestJS            │
│  - Middleware ecosystem                 │
│  - Simple routing                       │
├─────────────────────────────────────────┤
│  Prisma 5.8+ (ORM)                      │
│  - Type-safe database client            │
│  - Schema-first design                  │
│  - Migration system                     │
│  - Query optimization                   │
├─────────────────────────────────────────┤
│  Passport.js + JWT (Authentication)     │
│  - @nestjs/jwt                          │
│  - @nestjs/passport                     │
│  - JWT token generation/validation      │
├─────────────────────────────────────────┤
│  class-validator (Validation)           │
│  - Decorator-based validation           │
│  - Custom validators                    │
│  - Automatic DTO validation             │
├─────────────────────────────────────────┤
│  Puppeteer 21.7+ (PDF Generation)       │
│  - Headless Chrome                      │
│  - HTML to PDF conversion               │
│  - Screenshot capabilities              │
├─────────────────────────────────────────┤
│  BullMQ 5.1+ (Job Queue)                │
│  - Redis-based queue                    │
│  - Background job processing            │
│  - Retry mechanisms                     │
│  - Job scheduling                       │
└─────────────────────────────────────────┘
```

**Additional Backend Libraries:**

| Library | Version | Purpose |
|---------|---------|---------|
| **bcrypt** | 5.1+ | Password hashing |
| **nodemailer** | 6.9+ | Email sending |
| **@aws-sdk/client-s3** | 3.490+ | AWS S3 file operations |
| **@aws-sdk/client-ses** | 3.490+ | AWS SES email service |
| **helmet** | 7.1+ | Security headers |
| **compression** | 1.7+ | Response compression |
| **winston** | 3.11+ | Logging |
| **joi** | 17.12+ | Configuration validation |
| **exceljs** | 4.4+ | Excel file generation/parsing |
| **csv-parser** | 3.0+ | CSV import |

---

### 1.4 Database

```
┌─────────────────────────────────────────┐
│      PostgreSQL 16.1+ (RDBMS)           │
│  - ACID compliant                       │
│  - Multi-version concurrency control    │
│  - Advanced indexing (B-tree, GIN)      │
│  - JSON/JSONB support                   │
│  - Full-text search                     │
│  - Row-level security                   │
├─────────────────────────────────────────┤
│      Extensions                         │
│  - pgcrypto: Cryptographic functions    │
│  - pg_trgm: Fuzzy text search           │
│  - uuid-ossp: UUID generation           │
└─────────────────────────────────────────┘
```

**Connection Pooling:**
- **Development:** Built-in Prisma pooling
- **Production:** PgBouncer (transaction pooling)
  - Pool size: 100 connections
  - Mode: Transaction

---

### 1.5 Caching Layer

```
┌─────────────────────────────────────────┐
│         Redis 7.2+ (Cache)              │
│  - In-memory data store                 │
│  - Sub-millisecond latency              │
│  - Data structures (strings, sets, etc) │
│  - Pub/Sub messaging                    │
│  - Persistence (AOF + RDB)              │
└─────────────────────────────────────────┘
```

**Use Cases:**
- Session storage
- API response caching (school profiles, classes, subjects)
- Job queue (BullMQ)
- Rate limiting

**Client:** ioredis 5.3+

---

## 2. Cloud Infrastructure (AWS)

### 2.1 Compute & Hosting

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **EC2** | Backend API hosting | t3.medium (2 vCPU, 4GB RAM) × 2-5 instances |
| **ALB** | Load balancing | Application Load Balancer, Multi-AZ |
| **Auto Scaling** | Automatic scaling | Min: 2, Max: 10, Target: 70% CPU |

---

### 2.2 Database & Storage

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **RDS PostgreSQL** | Primary database | db.t3.medium (2 vCPU, 4GB RAM, 100GB SSD) |
| **RDS Read Replica** | Read scaling | db.t3.medium (same as primary) |
| **ElastiCache Redis** | Caching layer | cache.t3.micro (1 node, Multi-AZ) |
| **S3** | Object storage | 3 buckets (frontend, uploads, reports) |

---

### 2.3 Content Delivery & Networking

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **CloudFront** | CDN for frontend | Global distribution, HTTPS enforced |
| **Route 53** | DNS management | Hosted zone for domain |
| **Certificate Manager** | SSL certificates | Auto-renewed certificates |

---

### 2.4 Application Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **SES** | Email sending | Verified domain, DKIM configured |
| **CloudWatch** | Monitoring & logging | Logs, metrics, alarms |
| **SNS** | Notifications | Email/SMS alerts for ops team |
| **Secrets Manager** | Secret storage | Database creds, API keys |

---

## 3. Development & DevOps Tools

### 3.1 Version Control & CI/CD

| Tool | Purpose |
|------|---------|
| **Git** | Source control |
| **GitHub** | Repository hosting, code reviews |
| **GitHub Actions** | CI/CD pipeline |

**CI/CD Pipeline:**
```yaml
Workflow:
  1. Code Push → GitHub
  2. Run Linters (ESLint, Prettier)
  3. Run Tests (Unit, Integration)
  4. Build (TypeScript → JavaScript)
  5. Security Scan (npm audit, Snyk)
  6. Deploy to Staging (Auto)
  7. Run E2E Tests
  8. Deploy to Production (Manual approval)
```

---

### 3.2 Code Quality & Formatting

| Tool | Version | Purpose |
|------|---------|---------|
| **ESLint** | 8.56+ | Code linting (rules enforcement) |
| **Prettier** | 3.2+ | Code formatting |
| **Husky** | 8.0+ | Git hooks |
| **lint-staged** | 15.2+ | Run linters on staged files |
| **commitlint** | 18.4+ | Enforce commit message format |

**ESLint Configurations:**
- Frontend: `@typescript-eslint/recommended`, `plugin:react/recommended`, `plugin:react-hooks/recommended`
- Backend: `@typescript-eslint/recommended`, `plugin:@nestjs/recommended`

---

### 3.3 Testing Tools

| Component | Tool | Version | Purpose |
|-----------|------|---------|---------|
| **Frontend Unit** | Vitest | 1.2+ | Fast unit tests |
| **Frontend Component** | React Testing Library | 14.1+ | Component tests |
| **Frontend E2E** | Playwright | 1.40+ | Cross-browser E2E tests |
| **Backend Unit** | Jest | 29.7+ | Unit tests (built into NestJS) |
| **Backend Integration** | Supertest | 6.3+ | API integration tests |
| **API Testing** | Postman/Newman | - | Manual + automated API tests |

---

### 3.4 Monitoring & Observability

| Tool | Purpose |
|------|---------|
| **Sentry** | Error tracking and monitoring |
| **AWS CloudWatch** | Infrastructure monitoring, logs |
| **PostHog** | Product analytics (self-hosted) |
| **Datadog (optional)** | APM (Application Performance Monitoring) |

---

### 3.5 Development Environment

| Tool | Purpose |
|------|---------|
| **VS Code** | Primary IDE |
| **Docker Desktop** | Local containerization |
| **Postman** | API development and testing |
| **pgAdmin / TablePlus** | Database GUI |
| **Redis Insight** | Redis GUI |

**Required VS Code Extensions:**
- ESLint
- Prettier
- Prisma
- GitLens
- Thunder Client (API testing)
- Error Lens

---

## 4. Package Management

### 4.1 Package Manager

**Selected:** pnpm 8.14+

**Rationale:**
- Faster than npm/yarn (up to 2x)
- Disk space efficient (content-addressable storage)
- Strict dependency resolution
- Monorepo support

**Fallback:** npm (if pnpm issues arise)

---

### 4.2 Monorepo Structure (Optional)

**Tool:** Turborepo 1.11+

**Structure:**
```
srms/
├── apps/
│   ├── frontend/        (React app)
│   └── backend/         (NestJS app)
├── packages/
│   ├── shared-types/    (Shared TypeScript types)
│   ├── ui-components/   (Shared React components)
│   └── utils/           (Shared utilities)
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

**Benefits:**
- Shared code between frontend and backend
- Single command to build/test all apps
- Cached builds for faster CI/CD

---

## 5. Security Tools

| Tool | Purpose |
|------|---------|
| **Helmet** | HTTP security headers |
| **CORS** | Cross-Origin Resource Sharing config |
| **Rate Limiter** | @nestjs/throttler (prevent abuse) |
| **npm audit** | Dependency vulnerability scanning |
| **Snyk** | Continuous security monitoring |
| **OWASP ZAP** | Security testing (DAST) |

---

## 6. Documentation Tools

| Tool | Purpose |
|------|---------|
| **Swagger/OpenAPI** | API documentation (auto-generated from NestJS) |
| **Storybook** | Component documentation (frontend) |
| **TypeDoc** | TypeScript code documentation |
| **Mermaid** | Diagrams in markdown |

---

## 7. Email & Templates

| Tool | Purpose |
|------|---------|
| **Nodemailer** | Email sending library |
| **AWS SES** | Email service provider |
| **MJML** | Responsive email templates |
| **Handlebars** | Email template engine |

**Email Templates:**
- Welcome email
- Password reset
- Report card ready notification
- Admin alerts

---

## 8. Third-Party Services

| Service | Purpose | Pricing |
|---------|---------|---------|
| **AWS** | Cloud infrastructure | Pay-as-you-go |
| **Sentry** | Error monitoring | Free tier: 5K events/month |
| **SendGrid (backup)** | Email (if SES issues) | Free tier: 100 emails/day |
| **Cloudflare (optional)** | DNS, DDoS protection | Free tier available |

---

## 9. Technology Version Matrix

| Technology | Minimum Version | Recommended Version | Notes |
|------------|----------------|---------------------|-------|
| **Node.js** | 20.0.0 | 20.11.0 LTS | Use LTS for stability |
| **TypeScript** | 5.0.0 | 5.3.3 | Latest stable |
| **React** | 18.0.0 | 18.2.0 | Concurrent features |
| **NestJS** | 10.0.0 | 10.3.0 | Latest stable |
| **PostgreSQL** | 14.0 | 16.1 | Use latest for features |
| **Redis** | 7.0.0 | 7.2.4 | Latest stable |
| **Prisma** | 5.0.0 | 5.8.1 | Latest stable |
| **Vite** | 5.0.0 | 5.0.11 | Latest stable |

---

## 10. Browser & Device Support

### Frontend Compatibility

**Browsers:**
- Chrome 100+ ✅
- Firefox 100+ ✅
- Safari 15+ ✅
- Edge 100+ ✅
- Opera 85+ ✅
- **Not supported:** Internet Explorer (EOL)

**Devices:**
- Desktop (Windows, macOS, Linux) ✅
- Tablets (iPad, Android tablets) ✅
- Mobile (iOS 15+, Android 10+) ✅

**Screen Resolutions:**
- Desktop: 1366×768 to 3840×2160
- Tablet: 768×1024 to 1024×1366
- Mobile: 375×667 to 428×926

---

## 11. Runtime Environments

### Development

```
- Node.js: 20.11.0 LTS
- pnpm: 8.14.0+
- PostgreSQL: 16.1 (local or Docker)
- Redis: 7.2.4 (local or Docker)
- TypeScript: 5.3.3
```

### Staging

```
- AWS EC2: t3.medium (2 instances)
- AWS RDS PostgreSQL: db.t3.small
- AWS ElastiCache Redis: cache.t3.micro
- Node.js: 20.11.0 LTS (Docker image)
```

### Production

```
- AWS EC2: t3.medium (2-10 instances, auto-scaling)
- AWS RDS PostgreSQL: db.t3.medium + read replica
- AWS ElastiCache Redis: cache.t3.micro (Multi-AZ)
- Node.js: 20.11.0 LTS (Docker image)
```

---

## 12. Migration Path

### Future Considerations

**Possible Future Upgrades:**
1. **Frontend:** Migrate to Next.js 14+ (if SSR needed)
2. **Backend:** Migrate to microservices (if scale requires)
3. **Database:** Add PostgreSQL partitioning (for large datasets)
4. **Search:** Add Elasticsearch (for advanced search)
5. **Real-time:** Add Socket.io (for live notifications)
6. **Mobile:** React Native app (code reuse from React web)

**Flexibility:**
- Current stack supports gradual migration
- No vendor lock-in (can switch cloud providers)
- Modular architecture allows piece-by-piece upgrades

---

## Summary

### Core Stack

```
Frontend:  React 18 + Vite + TypeScript + MUI
Backend:   NestJS 10 + Node.js 20 + TypeScript
Database:  PostgreSQL 16 + Prisma 5
Cache:     Redis 7
Cloud:     AWS (EC2, RDS, S3, CloudFront, SES)
Testing:   Vitest + Jest + Playwright
CI/CD:     GitHub Actions
```

### Key Principles

1. **TypeScript Everywhere** - Full stack type safety
2. **Convention over Configuration** - Opinionated frameworks (NestJS, Prisma)
3. **Developer Experience** - Fast tooling (Vite, pnpm, Prisma)
4. **Production Ready** - Battle-tested technologies
5. **Scalable** - Horizontal scaling, caching, read replicas
6. **Secure** - JWT auth, HTTPS, security headers
7. **Cost-Effective** - Start small, scale as needed

---

**Next Steps:**
1. ✅ Tech stack finalized
2. → Define coding standards
3. → Define source code structure
4. → Define testing standards
5. → Define security standards
6. → Define theme/design system

---

**Status:** ✅ Approved  
**Approver:** Tech Manager, CTO  
**Last Updated:** 2026-01-12
