# Security Standards
# School Result Management System (SRMS)

**Version:** 1.0  
**Date:** 2026-01-12  
**Owner:** Security Engineer  
**Status:** Approved

---

## Overview

This document defines security requirements, standards, and best practices for SRMS. All code must comply with these security standards to protect sensitive student data.

---

## 1. Security Principles

### 1.1 Core Principles

✅ **Defense in Depth** - Multiple layers of security  
✅ **Principle of Least Privilege** - Minimum necessary access  
✅ **Secure by Default** - Security built-in, not bolted-on  
✅ **Fail Securely** - Errors don't expose sensitive data  
✅ **Don't Trust User Input** - Validate everything  
✅ **Separation of Duties** - No single point of failure  

### 1.2 Compliance Requirements

- **FERPA** (Family Educational Rights and Privacy Act) - US student data protection
- **GDPR** (General Data Protection Regulation) - EU data protection
- **Local Data Protection Laws** - Compliance with school's jurisdiction

---

## 2. Authentication & Authorization

### 2.1 Password Requirements

**Minimum Requirements:**
- Length: ≥ 8 characters
- Complexity: At least 3 of 4 (uppercase, lowercase, numbers, symbols)
- No common passwords (use zxcvbn library)
- No password reuse (last 5 passwords)
- Password expiry: Optional (90 days for admins)

**Implementation:**
```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Cost factor (higher = more secure, slower)

// Hash password
const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**❌ Never:**
- Store passwords in plain text
- Log passwords
- Send passwords in emails
- Use weak hashing (MD5, SHA1)

---

### 2.2 JWT Token Security

**Token Configuration:**
```typescript
// JWT Payload
{
  userId: number,
  schoolId: number,
  role: string,
  iat: number, // Issued at
  exp: number  // Expiration (4 hours from iat)
}
```

**Security Rules:**
- ✅ Use strong secret key (≥ 256 bits)
- ✅ Set expiration time (4 hours max)
- ✅ Use HS256 or RS256 algorithm
- ✅ Include minimal data in payload (no sensitive info)
- ✅ Validate signature on every request
- ❌ Never store secrets in code (use environment variables)

**Token Refresh Strategy:**
```typescript
// Refresh token 5 minutes before expiration
const tokenAge = Date.now() / 1000 - decodedToken.iat;
const tokenLife = decodedToken.exp - decodedToken.iat;
if (tokenAge > tokenLife - 300) {
  // Issue new token
}
```

---

### 2.3 Session Management

**Security Requirements:**
- ✅ Invalidate sessions on logout
- ✅ Automatic timeout after 4 hours inactivity
- ✅ Concurrent session limit (5 per user)
- ✅ Logout all sessions option
- ❌ Never share sessions between users

---

### 2.4 Role-Based Access Control (RBAC)

**Permission Matrix:**

| Resource | Admin | Teacher | Student | Parent |
|----------|-------|---------|---------|--------|
| **School Setup** | ✅ | ❌ | ❌ | ❌ |
| **User Management** | ✅ | ❌ | ❌ | ❌ |
| **Grade Entry** | ✅ | ✅ (assigned classes only) | ❌ | ❌ |
| **View Grades** | ✅ (all) | ✅ (assigned classes) | ✅ (own only) | ✅ (children only) |
| **Generate Reports** | ✅ | ❌ | ❌ | ❌ |
| **Download Reports** | ✅ (all) | ✅ (assigned) | ✅ (own) | ✅ (children) |

**Implementation:**
```typescript
// Decorator for role checking
@Roles('admin', 'teacher')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('grades')
async getGrades() {
  // Only admin and teacher can access
}

// Data filtering by ownership
async getStudentGrades(userId: number, studentId: number) {
  const user = await this.findUser(userId);
  
  // Students can only see own grades
  if (user.role === 'student' && user.id !== studentId) {
    throw new ForbiddenException();
  }
  
  // Parents can only see children's grades
  if (user.role === 'parent') {
    const isParent = await this.checkParentChild(userId, studentId);
    if (!isParent) throw new ForbiddenException();
  }
  
  return this.gradesService.findByStudent(studentId);
}
```

---

## 3. Input Validation & Sanitization

### 3.1 Frontend Validation

**Always Validate:**
```typescript
import { z } from 'zod';

// Grade entry schema
const gradeSchema = z.object({
  studentId: z.number().int().positive(),
  caScore: z.number().min(0).max(100),
  examScore: z.number().min(0).max(100),
});

// Validate before sending
const validated = gradeSchema.parse(formData);
```

**XSS Prevention:**
```typescript
// Sanitize HTML input
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput);
```

---

### 3.2 Backend Validation

**Use DTO with class-validator:**
```typescript
import { IsInt, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateGradeDto {
  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  caScore: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  examScore: number;
}
```

**SQL Injection Prevention:**
```typescript
// ✅ Use Prisma (parameterized queries)
const student = await prisma.student.findUnique({
  where: { id: studentId }, // Automatically parameterized
});

// ❌ NEVER use raw SQL with string concatenation
const query = `SELECT * FROM students WHERE id = ${studentId}`; // VULNERABLE
```

---

## 4. Data Protection

### 4.1 Encryption

**Data in Transit:**
- ✅ HTTPS/TLS 1.3 (minimum TLS 1.2)
- ✅ Enforce HTTPS (redirect HTTP to HTTPS)
- ✅ Use HSTS header
- ❌ Never transmit sensitive data over HTTP

**Data at Rest:**
- ✅ Database encryption (RDS encryption enabled)
- ✅ S3 bucket encryption (AES-256)
- ✅ Backup encryption
- ✅ Password hashing (bcrypt, scrypt, Argon2)

**Encryption Example:**
```typescript
import * as crypto from 'crypto';

// Encrypt sensitive data
function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

// Decrypt
function decrypt(encrypted: string, key: string): string {
  const [ivHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
```

---

### 4.2 Data Minimization

**Collect Only What's Needed:**
```typescript
// ✅ Good - Minimal user data
interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

// ❌ Bad - Unnecessary sensitive data
interface UserProfile {
  id: number;
  name: string;
  email: string;
  password: string; // Never return password
  ssn: string;      // Don't collect if not needed
}
```

---

### 4.3 PII (Personally Identifiable Information) Handling

**PII Data in SRMS:**
- Student names
- Email addresses
- Parent contact information
- Academic records

**Protection Measures:**
- ✅ Log PII access (audit trail)
- ✅ Mask PII in logs (replace with asterisks)
- ✅ Encrypt in database
- ✅ GDPR-compliant data deletion

**Example:**
```typescript
// Mask email in logs
function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}***@${domain}`;
}

// Log with masked PII
logger.info(`User ${maskEmail(user.email)} logged in`);
```

---

## 5. API Security

### 5.1 Rate Limiting

**Prevent Abuse:**
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

// Global rate limit
ThrottlerModule.forRoot({
  ttl: 60,    // 60 seconds
  limit: 100, // 100 requests per minute
});

// Stricter for sensitive endpoints
@Throttle(5, 60) // 5 requests per minute
@Post('login')
async login() {}
```

---

### 5.2 CORS Configuration

```typescript
app.enableCors({
  origin: ['https://app.srms.com', 'https://staging.srms.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**❌ Never:**
```typescript
// Don't allow all origins in production
app.enableCors({ origin: '*' }); // VULNERABLE
```

---

### 5.3 Security Headers (Helmet)

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

---

## 6. Secure File Handling

### 6.1 File Upload Security

**Allowed File Types:**
- Images: `.jpg`, `.jpeg`, `.png` (school logos, student photos)
- Documents: `.pdf` (reports)
- Data: `.csv`, `.xlsx` (grade imports)

**Security Checks:**
```typescript
import * as fileType from 'file-type';

async function validateUpload(file: Buffer): Promise<void> {
  // Check file type (don't trust extension)
  const type = await fileType.fromBuffer(file);
  const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
  
  if (!type || !allowed.includes(type.mime)) {
    throw new BadRequestException('Invalid file type');
  }
  
  // Check file size (max 5MB)
  if (file.length > 5 * 1024 * 1024) {
    throw new BadRequestException('File too large');
  }
  
  // Scan for malware (integrate ClamAV)
  await scanForVirus(file);
}
```

**File Storage:**
```typescript
// Generate random filename (prevent path traversal)
const filename = `${uuidv4()}.${extension}`;
const s3Key = `uploads/${schoolId}/${filename}`;

// Use signed URLs for access
const signedUrl = s3.getSignedUrl('getObject', {
  Bucket: 'srms-uploads',
  Key: s3Key,
  Expires: 3600, // 1 hour
});
```

---

## 7. Logging & Monitoring

### 7.1 Security Logging

**What to Log:**
- ✅ Authentication attempts (success/failure)
- ✅ Authorization failures
- ✅ Grade modifications (audit trail)
- ✅ Admin actions
- ✅ Suspicious activities (multiple failed logins)
- ❌ Passwords
- ❌ Full PII

**Example:**
```typescript
import { Logger } from '@nestjs/common';

const logger = new Logger('SecurityAudit');

// Log successful login
logger.log({
  event: 'USER_LOGIN',
  userId: user.id,
  email: maskEmail(user.email),
  ip: request.ip,
  timestamp: new Date(),
});

// Log failed login
logger.warn({
  event: 'LOGIN_FAILED',
  email: maskEmail(attemptedEmail),
  ip: request.ip,
  reason: 'Invalid password',
  timestamp: new Date(),
});

// Log grade modification
logger.log({
  event: 'GRADE_MODIFIED',
  userId: admin.id,
  studentId: grade.studentId,
  oldValue: grade.oldScore,
  newValue: grade.newScore,
  reason: reason,
  timestamp: new Date(),
});
```

---

### 7.2 Intrusion Detection

**Monitor for:**
- Multiple failed login attempts (>5 in 15 minutes)
- Unusual access patterns (student accessing admin endpoints)
- Mass data downloads
- Grade modifications outside school hours

**Automated Response:**
- Lock account after 5 failed attempts (15 minutes)
- Alert admins via email/SMS
- Require CAPTCHA after 3 failed attempts

---

## 8. Vulnerability Management

### 8.1 Dependency Scanning

**Tools:**
- `npm audit` (built-in)
- Snyk (continuous monitoring)
- Dependabot (GitHub automated PRs)

**Process:**
```bash
# Run before every release
npm audit

# Fix vulnerabilities
npm audit fix

# Manual review for breaking changes
npm audit fix --force
```

---

### 8.2 Code Security Scanning

**Static Analysis:**
- ESLint security plugins
- SonarQube
- CodeQL (GitHub)

**Configuration:**
```json
// .eslintrc.json
{
  "extends": [
    "plugin:security/recommended"
  ],
  "plugins": ["security"]
}
```

---

### 8.3 Penetration Testing

**Schedule:**
- Before launch: Full security audit
- Quarterly: Automated scans
- Annually: Professional penetration test

**Tools:**
- OWASP ZAP (automated)
- Burp Suite (manual testing)
- Nessus (vulnerability scan)

---

## 9. Incident Response

### 9.1 Security Incident Procedure

1. **Detect** - Monitoring alerts trigger
2. **Contain** - Isolate affected systems
3. **Investigate** - Review logs, identify cause
4. **Eradicate** - Remove threat, patch vulnerability
5. **Recover** - Restore from backup if needed
6. **Review** - Post-mortem, update defenses

### 9.2 Data Breach Response

1. **Immediate Actions:**
   - Disable compromised accounts
   - Rotate all credentials
   - Notify security team

2. **Within 24 Hours:**
   - Assess scope of breach
   - Document all findings
   - Notify affected schools

3. **Within 72 Hours:**
   - Notify authorities (if GDPR applicable)
   - Prepare public statement
   - Implement additional safeguards

---

## 10. Secure Development Lifecycle

### 10.1 Pre-Development

- [ ] Security requirements defined
- [ ] Threat modeling completed
- [ ] Security architecture reviewed

### 10.2 During Development

- [ ] Secure coding standards followed
- [ ] Code reviews include security checks
- [ ] Dependencies kept up-to-date
- [ ] Secrets not committed to git

### 10.3 Pre-Deployment

- [ ] Security tests passed
- [ ] Vulnerability scan completed
- [ ] Penetration test conducted
- [ ] Security documentation updated

### 10.4 Post-Deployment

- [ ] Monitoring alerts configured
- [ ] Incident response plan ready
- [ ] Regular security audits scheduled

---

## 11. Security Checklist

**Before Every Release:**

- [ ] All dependencies updated
- [ ] No known vulnerabilities
- [ ] Secrets stored in environment variables
- [ ] HTTPS enforced
- [ ] Authentication/authorization implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma)
- [ ] XSS prevention (sanitization)
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] Security headers set (Helmet)
- [ ] Error messages don't leak info
- [ ] Logging doesn't include PII
- [ ] Backups encrypted
- [ ] Incident response plan documented

---

## Summary

**Critical Security Measures:**
1. **Authentication**: JWT tokens, bcrypt passwords, 4-hour expiration
2. **Authorization**: RBAC with tenant isolation
3. **Validation**: Frontend + backend validation, Prisma for SQL injection prevention
4. **Encryption**: TLS 1.3, AES-256, bcrypt
5. **Monitoring**: Comprehensive logging, intrusion detection
6. **Compliance**: FERPA, GDPR compliance
7. **Incident Response**: Documented procedures, 24-hour response time

**Zero Tolerance:**
❌ Plain text passwords  
❌ SQL injection vulnerabilities  
❌ Unvalidated user input  
❌ Secrets in code  
❌ HTTP in production  
❌ PII in logs  

---

**Status:** ✅ Approved  
**Last Updated:** 2026-01-12
