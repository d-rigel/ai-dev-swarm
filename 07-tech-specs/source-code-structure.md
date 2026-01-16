# Source Code Structure
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-12  
**Owner:** Tech Manager  
**Status:** Approved

---

## Overview

This document defines the complete directory structure for SRMS codebase. All new code must follow this organization.

---

## 1. Root Directory Structure

```
srms/
├── apps/                      # Application code
│   ├── frontend/              # React frontend
│   └── backend/               # NestJS backend
├── packages/                  # Shared packages (monorepo)
│   ├── shared-types/          # Shared TypeScript types
│   └── ui-components/         # Shared React components
├── docs/                      # Project documentation
├── scripts/                   # Build/deployment scripts
├── .github/                   # GitHub Actions workflows
├── docker/                    # Docker configurations
├── package.json               # Root package.json (workspace)
├── pnpm-workspace.yaml        # pnpm workspace config
├── turbo.json                 # Turborepo config
├── .gitignore
├── .env.example
└── README.md
```

---

## 2. Frontend Structure (`apps/frontend/`)

```
apps/frontend/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── logo.png
│   └── robots.txt
│
├── src/
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Root component
│   ├── vite-env.d.ts          # Vite type definitions
│   │
│   ├── assets/                # Images, fonts, etc.
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   │
│   ├── components/            # React components
│   │   ├── common/            # Generic reusable components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Table/
│   │   │   └── index.ts       # Barrel export
│   │   │
│   │   ├── layout/            # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── PageLayout/
│   │   │
│   │   └── domain/            # Business-specific components
│   │       ├── StudentCard/
│   │       ├── GradeTable/
│   │       ├── ReportCard/
│   │       └── ClassSelector/
│   │
│   ├── pages/                 # Route-level components
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── index.ts
│   │   ├── admin/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SchoolSetupPage.tsx
│   │   │   ├── UserManagementPage.tsx
│   │   │   └── index.ts
│   │   ├── teacher/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── GradeEntryPage.tsx
│   │   │   └── index.ts
│   │   ├── student/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   └── index.ts
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   │
│   ├── services/              # API services
│   │   ├── api.ts             # Axios instance
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── grade.service.ts
│   │   ├── report.service.ts
│   │   └── index.ts
│   │
│   ├── stores/                # Zustand stores
│   │   ├── userStore.ts
│   │   ├── appStore.ts
│   │   └── index.ts
│   │
│   ├── routes/                # Route configuration
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── RoleRoute.tsx
│   │
│   ├── types/                 # TypeScript types
│   │   ├── user.types.ts
│   │   ├── grade.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── date.utils.ts
│   │   ├── string.utils.ts
│   │   ├── validation.utils.ts
│   │   └── index.ts
│   │
│   ├── config/                # Configuration
│   │   ├── constants.ts
│   │   ├── theme.ts           # MUI theme
│   │   └── env.ts             # Environment variables
│   │
│   └── styles/                # Global styles
│       ├── global.css
│       └── variables.css
│
├── .env                       # Environment variables (gitignored)
├── .env.example               # Example env file
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript config
├── package.json
└── README.md
```

---

## 3. Backend Structure (`apps/backend/`)

```
apps/backend/
├── src/
│   ├── main.ts                # Application entry point
│   ├── app.module.ts          # Root module
│   │
│   ├── modules/               # Feature modules
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── reset-password.dto.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.controller.spec.ts
│   │   │
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── schools/
│   │   ├── classes/
│   │   ├── subjects/
│   │   ├── students/
│   │   ├── grades/
│   │   │   ├── dto/
│   │   │   ├── calculation/
│   │   │   │   └── grade-calculator.service.ts
│   │   │   ├── grades.controller.ts
│   │   │   ├── grades.service.ts
│   │   │   └── grades.module.ts
│   │   │
│   │   └── reports/
│   │       ├── templates/     # HTML templates for PDFs
│   │       ├── generators/
│   │       │   └── pdf-generator.service.ts
│   │       ├── reports.controller.ts
│   │       ├── reports.service.ts
│   │       └── reports.module.ts
│   │
│   ├── common/                # Shared utilities
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── guards/
│   │   └── utils/
│   │       ├── date.utils.ts
│   │       └── crypto.utils.ts
│   │
│   ├── database/              # Database module
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   ├── seeds/
│   │   │   │   └── seed.ts
│   │   │   └── prisma.service.ts
│   │   └── database.module.ts
│   │
│   ├── config/                # Configuration
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── aws.config.ts
│   │
│   ├── queues/                # Background jobs
│   │   ├── email/
│   │   │   ├── email.processor.ts
│   │   │   └── email.module.ts
│   │   └── report/
│   │       ├── report.processor.ts
│   │       └── report.module.ts
│   │
│   └── types/                 # TypeScript types
│       └── index.d.ts
│
├── test/                      # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env                       # Environment variables (gitignored)
├── .env.example
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
└── README.md
```

---

## 4. Shared Packages

### 4.1 Shared Types (`packages/shared-types/`)

```
packages/shared-types/
├── src/
│   ├── user.types.ts
│   ├── grade.types.ts
│   ├── school.types.ts
│   └── index.ts
├── tsconfig.json
└── package.json
```

**Purpose:** Share TypeScript types between frontend and backend

---

## 5. Environment Files

### Frontend `.env`
```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# App Configuration
VITE_APP_NAME=SRMS
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
```

### Backend `.env`
```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/srms

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=4h

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=srms-uploads

# Email
EMAIL_FROM=noreply@srms.com
EMAIL_SERVICE=ses

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

---

## 6. Configuration Files

### Root `package.json`
```json
{
  "name": "srms",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\""
  },
  "devDependencies": {
    "turbo": "^1.11.0",
    "prettier": "^3.2.0",
    "typescript": "^5.3.0"
  }
}
```

### `pnpm-workspace.yaml`
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### `turbo.json`
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": [],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

---

## 7. Database Schema Location

```
apps/backend/src/database/prisma/
├── schema.prisma              # Main schema
├── migrations/                # Auto-generated migrations
│   ├── 20260112_init/
│   │   └── migration.sql
│   └── migration_lock.toml
└── seeds/                     # Seed data
    ├── seed.ts
    └── data/
        ├── schools.ts
        └── users.ts
```

---

## 8. Static Assets Organization

### Frontend Public Assets
```
apps/frontend/public/
├── favicon.ico
├── logo-192.png
├── logo-512.png
├── manifest.json
└── robots.txt
```

### Backend Static Files
```
apps/backend/static/
├── report-templates/
│   ├── default.html
│   └── custom.html
└── email-templates/
    ├── welcome.html
    ├── password-reset.html
    └── report-ready.html
```

---

## 9. Test File Organization

**Frontend:**
- Unit tests: `*.test.tsx` (next to component)
- Integration tests: `src/__tests__/integration/`
- E2E tests: `e2e/` (Playwright)

**Backend:**
- Unit tests: `*.spec.ts` (next to service/controller)
- Integration tests: `test/` directory
- E2E tests: `test/*.e2e-spec.ts`

---

## 10. Build Output

```
# Frontend build
apps/frontend/dist/           # Production build

# Backend build
apps/backend/dist/            # Compiled JavaScript
```

---

## 11. Docker Structure

```
docker/
├── frontend.Dockerfile
├── backend.Dockerfile
├── docker-compose.yml
└── docker-compose.prod.yml
```

---

## 12. CI/CD Workflows

```
.github/
└── workflows/
    ├── ci.yml                # Continuous Integration
    ├── cd-staging.yml        # Deploy to Staging
    └── cd-production.yml     # Deploy to Production
```

---

## 13. Path Aliases (TypeScript)

### Frontend `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/services/*": ["services/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"],
      "@/stores/*": ["stores/*"]
    }
  }
}
```

### Backend `tsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@/modules/*": ["modules/*"],
      "@/common/*": ["common/*"],
      "@/config/*": ["config/*"]
    }
  }
}
```

---

## Summary

**Key Principles:**
1. **Monorepo Structure**: Apps and packages separated
2. **Feature-based Organization**: Backend modules by feature
3. **Component Hierarchy**: common → layout → domain
4. **Consistent Naming**: kebab-case for files/folders
5. **Barrel Exports**: index.ts for clean imports
6. **Shared Code**: packages/ for cross-app code
7. **Environment Separation**: .env files per environment

---

**Status:** ✅ Approved  
**Last Updated:** 2026-01-12
