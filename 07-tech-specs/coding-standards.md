# Coding Standards
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-12  
**Owner:** Tech Manager  
**Status:** Approved

---

## Overview

This document defines coding standards, conventions, and best practices for SRMS. All code must comply with these standards before merging to main branch.

---

## 1. General Principles

### 1.1 Core Values

✅ **Clarity over Cleverness** - Write code that others can understand  
✅ **Consistency** - Follow established patterns  
✅ **Simplicity** - Choose the simplest solution that works  
✅ **DRY** (Don't Repeat Yourself) - Reuse code, extract common logic  
✅ **YAGNI** (You Aren't Gonna Need It) - Don't add features speculatively  
✅ **Fail Fast** - Validate early, throw errors for invalid states  

### 1.2 Code Quality Metrics

| Metric | Target |
|--------|--------|
| **Code Coverage** | ≥ 80% (unit + integration tests) |
| **Cyclomatic Complexity** | ≤ 10 per function |
| **Function Length** | ≤ 50 lines (ideally ≤ 30) |
| **File Length** | ≤ 300 lines (ideally ≤ 200) |
| **TypeScript Strictness** | 100% (no `any`, strict mode ON) |

---

## 2. TypeScript Standards

### 2.1 Type Safety

**✅ DO:**
```typescript
// Explicit types for function parameters and return values
function calculateAverage(scores: number[]): number {
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

// Use interfaces for object shapes
interface Student {
  id: number;
  name: string;
  email: string;
  classId: number;
}

// Use type unions for specific values
type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

// Use readonly for immutable properties
interface Grade {
  readonly id: number;
  readonly studentId: number;
  caScore: number;
  examScore: number;
}
```

**❌ DON'T:**
```typescript
// Avoid `any`
function processData(data: any) { } // ❌

// Avoid implicit any
function getData() {  // ❌ Missing return type
  return fetch('/api/data');
}

// Avoid type assertions unless necessary
const user = data as User; // ❌ Prefer proper type checking
```

### 2.2 Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Variables** | camelCase | `studentName`, `totalScore` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_STUDENTS`, `API_BASE_URL` |
| **Functions** | camelCase (verb + noun) | `calculateAverage`, `fetchGrades` |
| **Classes** | PascalCase | `GradeService`, `UserController` |
| **Interfaces** | PascalCase | `Student`, `GradeInput` |
| **Types** | PascalCase | `UserRole`, `ApiResponse` |
| **Enums** | PascalCase | `GradeStatus`, `UserType` |
| **Files** | kebab-case | `student-service.ts`, `grade-calculator.ts` |
| **React Components** | PascalCase | `StudentDashboard.tsx`, `GradeTable.tsx` |

---

## 3. Frontend Standards (React + TypeScript)

### 3.1 Component Structure

**Functional Components (Always):**
```typescript
// ✅ Preferred: Named export with FC type
import React, { FC } from 'react';

interface StudentCardProps {
  student: Student;
  onEdit: (id: number) => void;
}

export const StudentCard: FC<StudentCardProps> = ({ student, onEdit }) => {
  return (
    <div className="student-card">
      <h3>{student.name}</h3>
      <button onClick={() => onEdit(student.id)}>Edit</button>
    </div>
  );
};
```

**Component File Structure:**
```typescript
// 1. Imports (grouped)
import React, { FC, useState, useEffect } from 'react'; // React imports
import { Box, Button } from '@mui/material';           // UI library
import { useQuery } from '@tanstack/react-query';      // Data fetching
import { StudentService } from '@/services';           // Local services

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Component
export const ComponentName: FC<Props> = (props) => {
  // 4. Hooks (in order)
  const [state, setState] = useState();
  const { data } = useQuery();
  useEffect(() => {}, []);
  
  // 5. Event handlers
  const handleClick = () => {};
  
  // 6. Render helpers (if needed)
  const renderItem = () => {};
  
  // 7. Return JSX
  return <div>...</div>;
};
```

### 3.2 Hooks Rules

**✅ DO:**
```typescript
// Custom hooks start with "use"
function useStudentGrades(studentId: number) {
  const [grades, setGrades] = useState<Grade[]>([]);
  
  useEffect(() => {
    fetchGrades(studentId).then(setGrades);
  }, [studentId]);
  
  return { grades, refetch: () => fetchGrades(studentId) };
}

// Dependency arrays - always include all dependencies
useEffect(() => {
  fetchData(id);
}, [id]); // ✅ Includes `id`
```

**❌ DON'T:**
```typescript
// Don't call hooks conditionally
if (condition) {
  const [state] = useState(); // ❌
}

// Don't forget dependencies
useEffect(() => {
  fetchData(id);
}, []); // ❌ Missing `id` dependency
```

### 3.3 State Management

**Local State (useState):**
```typescript
// For component-specific state
const [isOpen, setIsOpen] = useState(false);
```

**Global State (Zustand):**
```typescript
// /src/stores/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

---

## 4. Backend Standards (NestJS + TypeScript)

### 4.1 Module Structure

```
src/modules/grades/
├── dto/
│   ├── create-grade.dto.ts
│   ├── update-grade.dto.ts
│   └── grade-response.dto.ts
├── entities/
│   └── grade.entity.ts
├── grades.controller.ts
├── grades.service.ts
├── grades.module.ts
└── grades.controller.spec.ts
```

### 4.2 Controller Standards

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards';
import { GradesService } from './grades.service';
import { CreateGradeDto, GradeResponseDto } from './dto';

@ApiTags('grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new grade entry' })
  async create(@Body() dto: CreateGradeDto): Promise<GradeResponseDto> {
    return this.gradesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get grade by ID' })
  async findOne(@Param('id') id: number): Promise<GradeResponseDto> {
    return this.gradesService.findOne(id);
  }
}
```

### 4.3 Service Standards

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateGradeDto, GradeResponseDto } from './dto';

@Injectable()
export class GradesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateGradeDto): Promise<GradeResponseDto> {
    // Validation
    await this.validateGradeInput(dto);
    
    // Business logic
    const totalScore = this.calculateTotal(dto.caScore, dto.examScore);
    
    // Database operation
    const grade = await this.prisma.grade.create({
      data: {
        ...dto,
        totalScore,
      },
    });
    
    return this.toResponseDto(grade);
  }

  private async validateGradeInput(dto: CreateGradeDto): Promise<void> {
    // Throw errors for invalid data
    if (dto.caScore < 0 || dto.caScore > 100) {
      throw new BadRequestException('CA score must be between 0 and 100');
    }
  }
  
  private calculateTotal(ca: number, exam: number): number {
    return (ca * 0.4) + (exam * 0.6);
  }
  
  private toResponseDto(grade: any): GradeResponseDto {
    return {
      id: grade.id,
      caScore: grade.caScore,
      examScore: grade.examScore,
      totalScore: grade.totalScore,
    };
  }
}
```

### 4.4 DTO Standards

```typescript
import { IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGradeDto {
  @ApiProperty({ description: 'Student ID' })
  @IsInt()
  studentId: number;

  @ApiProperty({ description: 'Subject ID' })
  @IsInt()
  subjectId: number;

  @ApiProperty({ description: 'CA score (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  caScore: number;

  @ApiProperty({ description: 'Exam score (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  examScore: number;
}
```

---

## 5. Database Standards (Prisma)

### 5.1 Schema Naming

```prisma
// Table names: PascalCase (singular)
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  
  // Relations: camelCase (plural if many)
  grades    Grade[]
  
  @@map("users") // Database table name (plural, snake_case)
}

// Column names: camelCase in Prisma, snake_case in DB
model Grade {
  id         Int      @id @default(autoincrement())
  caScore    Float    @map("ca_score")
  examScore  Float    @map("exam_score")
  totalScore Float    @map("total_score")
  
  @@map("grades")
}
```

### 5.2 Query Standards

**✅ DO:**
```typescript
// Use transactions for multi-step operations
await this.prisma.$transaction(async (tx) => {
  const grade = await tx.grade.create({ data: gradeData });
  await tx.auditLog.create({ data: logData });
});

// Use select to fetch only needed fields
const students = await this.prisma.student.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// Use proper filters
const activeTerms = await this.prisma.term.findMany({
  where: {
    isActive: true,
    schoolId: user.schoolId, // Always filter by tenant
  },
});
```

**❌ DON'T:**
```typescript
// Avoid N+1 queries
for (const student of students) {
  const grades = await prisma.grade.findMany({ // ❌
    where: { studentId: student.id },
  });
}

// Instead, use include
const students = await prisma.student.findMany({
  include: { grades: true }, // ✅ Single query with join
});
```

---

## 6. Error Handling

### 6.1 Frontend Error Handling

```typescript
import { toast } from 'react-hot-toast';

async function fetchGrades() {
  try {
    const response = await api.get('/grades');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to fetch grades';
      toast.error(message);
    } else {
      toast.error('An unexpected error occurred');
    }
    throw error; // Re-throw for upper layers
  }
}
```

### 6.2 Backend Error Handling

```typescript
import { HttpException, HttpStatus } from '@nestjs/common';

// Use built-in NestJS exceptions
throw new NotFoundException('Student not found');
throw new BadRequestException('Invalid grade value');
throw new UnauthorizedException('Invalid token');

// Custom exceptions
export class GradeLockedError extends HttpException {
  constructor() {
    super('Grades are locked for this term', HttpStatus.CONFLICT);
  }
}
```

---

## 7. Comments & Documentation

### 7.1 When to Comment

**✅ DO Comment:**
- Complex business logic
- Non-obvious algorithms
- Workarounds for bugs
- Public API functions (JSDoc)

**❌ DON'T Comment:**
- Obvious code
- Redundant descriptions

**✅ Good Comments:**
```typescript
/**
 * Calculates student position based on average scores.
 * Students with same average get the same position.
 * Next position skips the number of tied students.
 * Example: [100, 90, 90, 80] → [1, 2, 2, 4] (not [1, 2, 2, 3])
 */
function calculatePositions(averages: number[]): number[] {
  // Implementation
}
```

### 7.2 JSDoc for Public APIs

```typescript
/**
 * Fetches grades for a specific student in a term.
 *
 * @param studentId - The unique identifier of the student
 * @param termId - The term for which to fetch grades
 * @returns Array of grade objects with subject details
 * @throws {NotFoundException} If student or term not found
 *
 * @example
 * const grades = await getStudentGrades(123, 1);
 */
export async function getStudentGrades(
  studentId: number,
  termId: number,
): Promise<GradeWithSubject[]> {
  // Implementation
}
```

---

## 8. Git Commit Standards

### 8.1 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance (dependencies, build)

**Examples:**
```
feat(grades): add bulk grade import from CSV

Implement CSV parsing and validation for importing grades.
Supports up to 1000 students per upload.

Closes #123

---

fix(auth): prevent token expiration during active session

Refresh JWT token 5 minutes before expiration if user is active.

Fixes #456

---

docs(readme): update setup instructions for Windows
```

### 8.2 Branch Naming

```
<type>/<issue-number>-<short-description>

Examples:
feature/123-bulk-grade-import
bugfix/456-login-token-refresh
hotfix/789-critical-data-loss
chore/update-dependencies
```

---

## 9. File Organization

### 9.1 Import Order

```typescript
// 1. Node/Third-party modules
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. UI library
import { Box, Button } from '@mui/material';

// 3. Internal modules (absolute imports)
import { useAuth } from '@/hooks/useAuth';
import { StudentService } from '@/services/student.service';

// 4. Relative imports (same directory)
import { StudentCard } from './StudentCard';
import { styles } from './styles';

// 5. Types
import type { Student } from '@/types';
```

### 9.2 Folder Structure Consistency

```
src/
├── components/       # Shared React components
│   ├── common/       # Generic components (Button, Input)
│   └── domain/       # Business components (StudentCard)
├── pages/            # Route components
├── services/         # API services
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript types/interfaces
├── stores/           # Zustand stores
└── config/           # Configuration files
```

---

## 10. Code Review Checklist

Before submitting PR, ensure:

- [ ] All tests pass
- [ ] Code coverage ≥ 80%
- [ ] No linter errors
- [ ] No TypeScript errors (strict mode)
- [ ] No console.log statements (use proper logging)
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow convention
- [ ] No secrets or sensitive data in code

---

## Summary

**Key Takeaways:**
1. TypeScript strict mode, no `any`
2. Functional components for React
3. Consistent naming (camelCase, PascalCase, kebab-case)
4. Error handling at all layers
5. Proper validation (frontend + backend)
6. Meaningful commits (conventional format)
7. Test coverage ≥ 80%
8. Code reviews required before merge

---

**Status:** ✅ Approved  
**Approver:** Tech Manager, Senior Developers  
**Last Updated:** 2026-01-12
