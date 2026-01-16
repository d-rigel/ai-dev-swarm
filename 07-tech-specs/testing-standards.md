# Testing Standards
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-12  
**Owner:** QA Lead  
**Status:** Approved

---

## Overview

This document defines testing requirements, standards, and best practices for SRMS. All code must meet these testing standards before merging to main branch.

---

## 1. Testing Strategy

### 1.1 Testing Pyramid

```
         /\
        /  \  E2E Tests (10%)
       /____\
      /      \  Integration Tests (30%)
     /________\
    /          \  Unit Tests (60%)
   /__________  \
```

**Target Distribution:**
- **Unit Tests**: 60% - Fast, isolated tests
- **Integration Tests**: 30% - API/component integration
- **E2E Tests**: 10% - Critical user journeys

---

### 1.2 Coverage Requirements

| Type | Minimum Coverage | Target Coverage |
|------|------------------|-----------------|
| **Overall** | 80% | 90% |
| **Business Logic** | 90% | 95% |
| **Controllers/Services** | 85% | 90% |
| **Utilities** | 95% | 100% |
| **UI Components** | 70% | 80% |

**Enforcement:**
- CI/CD blocks merge if coverage < 80%
- Coverage reports generated for every PR

---

## 2. Frontend Testing

### 2.1 Unit Tests (Vitest + React Testing Library)

**Test File Naming:**
```
Component.tsx       → Component.test.tsx
utils.ts            → utils.test.ts
```

**Example Component Test:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StudentCard } from './StudentCard';

describe('StudentCard', () => {
  const mockStudent = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('renders student name', () => {
    render(<StudentCard student={mockStudent} onEdit={vi.fn()} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const onEdit = vi.fn();
    render(<StudentCard student={mockStudent} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('displays email address', () => {
    render(<StudentCard student={mockStudent} onEdit={vi.fn()} />);
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

**What to Test:**
- ✅ Component renders correctly
- ✅ User interactions (clicks, input)
- ✅ Conditional rendering
- ✅ Props are used correctly
- ❌ Implementation details (internal state changes)
- ❌ Styles/CSS (unless critical to functionality)

---

### 2.2 Integration Tests (React Query + API Mocking)

**Example API Integration Test:**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useStudentGrades } from './useStudentGrades';
import * as api from '@/services/api';

describe('useStudentGrades', () => {
  it('fetches and returns grades', async () => {
    const mockGrades = [{ id: 1, subject: 'Math', score: 85 }];
    vi.spyOn(api, 'get').mockResolvedValue({ data: mockGrades });

    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useStudentGrades(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockGrades);
  });
});
```

---

### 2.3 E2E Tests (Playwright)

**Test File Location:** `e2e/` directory

**Example E2E Test:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Grade Entry Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'teacher@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/teacher/dashboard');
  });

  test('teacher can enter grades for a class', async ({ page }) => {
    // Navigate to grade entry
    await page.click('text=Grade Entry');
    await page.selectOption('[name="class"]', '1'); // Grade 7A
    await page.selectOption('[name="subject"]', '1'); // Mathematics
    await page.click('button:has-text("Load Students")');

    // Enter grades
    await page.fill('[data-testid="ca-score-1"]', '85');
    await page.fill('[data-testid="exam-score-1"]', '78');
    
    // Submit
    await page.click('button:has-text("Submit Grades")');

    // Verify success
    await expect(page.locator('.success-message')).toContainText('Grades saved successfully');
  });
});
```

**Critical E2E Test Scenarios:**
1. User login/logout
2. Admin school setup
3. Teacher grade entry
4. Student result viewing
5. Report card generation
6. Password reset flow

---

## 3. Backend Testing

### 3.1 Unit Tests (Jest)

**Test File Naming:**
```
service.ts      → service.spec.ts
controller.ts   → controller.spec.ts
```

**Example Service Test:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { GradesService } from './grades.service';
import { PrismaService } from '@/database/prisma/prisma.service';

describe('GradesService', () => {
  let service: GradesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GradesService,
        {
          provide: PrismaService,
          useValue: {
            grade: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GradesService>(GradesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('calculateTotal', () => {
    it('calculates correct total for 40/60 split', () => {
      const result = service.calculateTotal(85, 78, 40, 60);
      expect(result).toBe(80.8); // (85*0.4) + (78*0.6)
    });

    it('throws error for invalid percentages', () => {
      expect(() => service.calculateTotal(85, 78, 50, 60)).toThrow();
    });
  });

  describe('create', () => {
    it('creates a grade with calculated total', async () => {
      const createDto = {
        studentId: 1,
        subjectId: 1,
        termId: 1,
        caScore: 85,
        examScore: 78,
      };

      const mockCreated = { id: 1, ...createDto, totalScore: 80.8 };
      jest.spyOn(prisma.grade, 'create').mockResolvedValue(mockCreated as any);

      const result = await service.create(createDto);

      expect(result.totalScore).toBe(80.8);
      expect(prisma.grade.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ totalScore: 80.8 }),
      });
    });
  });
});
```

---

### 3.2 Integration Tests (Supertest)

**Test File Location:** `test/` directory

**Example Controller Integration Test:**
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/database/prisma/prisma.service';

describe('GradesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Get auth token
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'teacher@test.com', password: 'password' });
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /grades', () => {
    it('creates a grade with valid data', async () => {
      const createDto = {
        studentId: 1,
        subjectId: 1,
        termId: 1,
        caScore: 85,
        examScore: 78,
      };

      return request(app.getHttpServer())
        .post('/grades')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.totalScore).toBe(80.8);
        });
    });

    it('returns 400 for invalid CA score', async () => {
      const createDto = {
        studentId: 1,
        subjectId: 1,
        termId: 1,
        caScore: 150, // Invalid
        examScore: 78,
      };

      return request(app.getHttpServer())
        .post('/grades')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createDto)
        .expect(400);
    });

    it('returns 401 without auth token', async () => {
      return request(app.getHttpServer())
        .post('/grades')
        .send({})
        .expect(401);
    });
  });
});
```

---

## 4. Database Testing

### 4.1 Test Database Setup

**Use Separate Test Database:**
```bash
# .env.test
DATABASE_URL=postgresql://user:pass@localhost:5432/srms_test
```

**Migration Before Tests:**
```typescript
// test/setup.ts
import { execSync } from 'child_process';

beforeAll(async () => {
  execSync('npx prisma migrate deploy', { env: { DATABASE_URL: process.env.DATABASE_URL } });
});

afterAll(async () => {
  execSync('npx prisma migrate reset --force', { env: { DATABASE_URL: process.env.DATABASE_URL } });
});
```

---

## 5. Test Data Management

### 5.1 Test Fixtures

```typescript
// test/fixtures/students.ts
export const studentFixtures = {
  johnDoe: {
    name: 'John Doe',
    email: 'john@test.com',
    classId: 1,
  },
  janeDoe: {
    name: 'Jane Doe',
    email: 'jane@test.com',
    classId: 1,
  },
};
```

### 5.2 Factory Pattern

```typescript
// test/factories/grade.factory.ts
export const createGrade = (overrides = {}) => ({
  studentId: 1,
  subjectId: 1,
  termId: 1,
  caScore: 85,
  examScore: 78,
  totalScore: 80.8,
  ...overrides,
});
```

---

## 6. Test Naming Conventions

### 6.1 Describe Blocks

```typescript
describe('ComponentName/ServiceName', () => {
  describe('methodName', () => {
    it('should do something specific', () => {});
  });
});
```

### 6.2 Test Case Naming

**Pattern:** `should [expected behavior] when [condition]`

**Examples:**
```typescript
it('should return user when valid credentials provided', () => {});
it('should throw error when password is incorrect', () => {});
it('should calculate average correctly when all grades present', () => {});
```

---

## 7. Mocking Standards

### 7.1 When to Mock

✅ **Mock:**
- External APIs
- Database calls (in unit tests)
- File system operations
- Email sending
- PDF generation
- Time-dependent functions (Date.now())

❌ **Don't Mock:**
- Pure functions (utils)
- Simple logic
- Type definitions

### 7.2 Mock Examples

**Mocking Date:**
```typescript
import { vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-01-12T10:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});
```

**Mocking API:**
```typescript
vi.mock('@/services/api', () => ({
  get: vi.fn(),
  post: vi.fn(),
}));
```

---

## 8. Test Configuration

### Frontend `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

### Backend `jest.config.js`
```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.module.ts',
    '!**/*.spec.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## 9. Continuous Integration

### GitHub Actions Test Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 10. Test Checklist

Before merging PR:

- [ ] All tests pass locally
- [ ] Coverage ≥ 80%
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] No `it.skip` or `test.only` in code
- [ ] Tests run in CI/CD
- [ ] E2E tests pass for critical flows

---

## Summary

**Key Requirements:**
1. Minimum 80% code coverage
2. Unit tests for all business logic
3. Integration tests for API endpoints
4. E2E tests for critical user flows
5. All tests must pass before merge
6. Use proper mocking strategies
7. Follow naming conventions
8. Maintain test quality with code

---

**Status:** ✅ Approved  
**Last Updated:** 2026-01-12
