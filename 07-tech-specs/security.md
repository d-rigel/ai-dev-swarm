# Security - MCP Skills Server

## Overview

This document defines the security posture, authentication approach, threat mitigation strategies, and compliance requirements for the MCP Skills Server.

**Security Philosophy**: Security by design, defense in depth, fail securely.

---

## Security Principles

### 1. Security by Design
- Security built into architecture from the start, not added later
- All components designed with security in mind
- Default deny (reject unknown inputs)

### 2. Defense in Depth
- Multiple layers of security controls
- If one layer fails, others provide protection
- No single point of security failure

### 3. Principle of Least Privilege
- Components have minimum permissions needed
- Read-only access to skills directory (no writes)
- No elevated privileges required

### 4. Zero Trust Architecture
- Validate every request (OAuth on every MCP request)
- Never trust input (validate all external data)
- Assume breach (limit damage if compromised)

### 5. Fail Securely
- Errors result in denied access (not granted)
- Log failures without exposing sensitive data
- Graceful degradation maintains security

---

## Authentication Approach

### OAuth 2.1 with PKCE

**Method**: OAuth 2.1 with Proof Key for Code Exchange (PKCE)

**Why OAuth 2.1**:
- Industry standard for enterprise authentication
- Supports SSO (Single Sign-On) with existing identity providers
- PKCE provides additional security against authorization code interception
- Prevents security issues found in OAuth 2.0

**Supported Providers**:
- Google OAuth 2.0
- GitHub OAuth
- Azure AD (Microsoft Identity Platform)
- Any OAuth 2.1 compliant provider

**Authentication Flow**:

```
┌─────────┐                                  ┌──────────────┐
│ MCP     │                                  │ OAuth        │
│ Client  │                                  │ Provider     │
│         │                                  │ (Google/etc) │
└────┬────┘                                  └──────┬───────┘
     │                                              │
     │ 1. User authenticates                        │
     ├─────────────────────────────────────────────>│
     │    (Outside our scope - handled by client)   │
     │                                              │
     │ 2. Obtain access token                       │
     │<─────────────────────────────────────────────┤
     │                                              │
     │ 3. Send MCP request with token               │
     │ {"method": "call_tool",                      │
     │  "params": {"access_token": "ya29..."}}      │
     ▼                                              │
┌──────────────┐                                    │
│ MCP Skills   │                                    │
│ Server       │ 4. Validate token                  │
│              ├───────────────────────────────────>│
│              │    POST /tokeninfo                 │
│              │                                    │
│              │ 5. Token validation result          │
│              │<───────────────────────────────────┤
│              │    {"active": true, "exp": ...}    │
│              │                                    │
│              │ 6. Process request (if valid)      │
└──────────────┘                                    │
```

**Token Storage**:
- **Client Side**: MCP client stores access/refresh tokens (not our responsibility)
- **Server Side**: NO token storage (stateless - validate on every request)
- **Logs**: Tokens NEVER logged (masked as `***`)

**Token Expiration**:
- **Access Token**: Typically 1 hour (provider-controlled)
- **Refresh Token**: Typically 7-30 days (provider-controlled, client-managed)
- **Validation**: Server checks expiration on every request

**Token Validation Process**:
1. Extract access_token from MCP request params
2. Check token format (basic validation)
3. Call OAuth provider's token introspection endpoint
4. Verify response: `active: true`, not expired, correct scope
5. Allow/deny request based on validation result

---

## Authorization Model

**Approach**: Simple token-based (no complex roles for MVP)

**Authorization Logic**:
- **If valid OAuth token**: Allow access to ALL skills
- **If invalid/expired token**: Deny access
- **No per-skill permissions**: All authenticated users can invoke all skills

**Future (P1)**: Role-Based Access Control (RBAC)
- **Roles**: admin, developer, viewer
- **Permissions**:
  - admin: all skills
  - developer: specific skill categories
  - viewer: read-only (list_tools only)
- **Implementation**: Check role claim in OAuth token

---

## Secrets Management

### Environment Variables (MVP)

**Approach**: Store secrets in environment variables

**Why Environment Variables**:
- Simple, widely understood
- Never committed to version control
- OS-level security (process isolation)
- Standard practice for CLI tools

**Secrets Stored**:
- `MCP_OAUTH_CLIENT_ID`: OAuth application client ID (not sensitive, but configurable)
- `MCP_OAUTH_CLIENT_SECRET`: OAuth application client secret (SENSITIVE)

**Loading Secrets**:
```python
import os

oauth_client_id = os.environ.get("MCP_OAUTH_CLIENT_ID")
oauth_client_secret = os.environ.get("MCP_OAUTH_CLIENT_SECRET")

# Validate required secrets exist
if not oauth_client_id or not oauth_client_secret:
    raise ValueError("OAuth credentials not configured")
```

**Secret Masking in Logs**:
```python
# NEVER log secrets
logger.info(f"OAuth client ID: {oauth_client_id}")  # OK (not secret)
logger.info(f"OAuth client secret: ***masked***")   # Good (masked)
# logger.info(f"OAuth client secret: {oauth_client_secret}")  # FORBIDDEN
```

### Future (P1): Secret Management Service

**Options for Cloud Deployment**:
- **AWS Secrets Manager**: For AWS deployments
- **HashiCorp Vault**: For multi-cloud or on-premise
- **Azure Key Vault**: For Azure deployments
- **Google Secret Manager**: For GCP deployments

**Not Needed for MVP**: Environment variables sufficient for local subprocess

---

## Data Security

### Encryption at Rest

**SKILL.md Files**: No encryption (public data, stored in git)

**Rationale**:
- SKILL.md files contain public information (instructions, documentation)
- No PII (Personally Identifiable Information) in skills
- Version controlled with git (transparency)

**If PII Needed** (P2):
- Encrypt SKILL.md files with AES-256
- Store encryption keys in secret manager
- Decrypt on read (performance impact)

### Encryption in Transit

**OAuth Provider Communication**: HTTPS/TLS 1.3

**Enforcement**:
- All OAuth provider URLs use https:// scheme
- Reject http:// URLs for OAuth endpoints
- Validate SSL certificates (no self-signed)
- Use requests library's built-in SSL verification

**Implementation**:
```python
import requests

# HTTPS enforced, SSL verified
response = requests.post(
    "https://oauth2.googleapis.com/tokeninfo",  # Must be HTTPS
    data={"access_token": token},
    verify=True,  # Validate SSL certificate
    timeout=30
)
```

**stdio Communication**: No encryption (local process)

**Rationale**:
- stdin/stdout are local (same machine)
- Process isolation by OS
- No network exposure
- Adding encryption would complicate protocol and reduce performance

---

## Threat Mitigation

### OWASP Top 10 Protections

#### 1. Injection Attacks

**Threats**:
- Command injection (if executing shell commands)
- Path traversal (reading arbitrary files)
- YAML injection (malicious SKILL.md frontmatter)

**Mitigations**:
- ✅ **No Shell Commands**: Server doesn't execute shell commands (no subprocess.call)
- ✅ **Path Validation**: Validate all file paths
  - No `..` in paths (reject directory traversal)
  - All paths must be within project_root
  - Use pathlib.Path.resolve() to normalize paths
- ✅ **Safe YAML Loading**: Use yaml.safe_load() (not yaml.load())
  - Prevents arbitrary code execution in YAML
  - Loads only basic YAML types (string, int, list, dict)

**Code Example**:
```python
from pathlib import Path
import yaml

# Path validation
def validate_path(path: str, project_root: str) -> bool:
    """Validate path is within project root, no traversal."""
    resolved = Path(path).resolve()
    root = Path(project_root).resolve()

    # Check path is within root (no ../../../etc/passwd)
    try:
        resolved.relative_to(root)
        return True
    except ValueError:
        return False  # Path outside project root

# Safe YAML loading
with open(skill_path, "r") as f:
    content = f.read()
    metadata = yaml.safe_load(frontmatter)  # Safe, not yaml.load()
```

#### 2. Broken Authentication

**Threats**:
- Token replay attacks
- Expired token accepted
- Weak token validation

**Mitigations**:
- ✅ **OAuth 2.1 with PKCE**: Industry-standard authentication
- ✅ **Token Validation on Every Request**: No cached authentication decisions
- ✅ **Expiration Checking**: Verify token not expired
- ✅ **Provider Validation**: Call OAuth provider's introspection endpoint
- ✅ **No Token Storage**: Stateless (no session storage)

#### 3. Sensitive Data Exposure

**Threats**:
- Secrets logged
- Tokens in error messages
- Credentials in version control

**Mitigations**:
- ✅ **Secret Masking**: All secrets masked in logs (`***masked***`)
- ✅ **Environment Variables**: Secrets in env vars, not code
- ✅ **.gitignore**: Ensure .env files not committed
- ✅ **Error Sanitization**: Error messages don't include tokens

**Code Example**:
```python
import logging

logger = logging.getLogger(__name__)

# Mask secrets in logs
def log_safe_config(config: dict):
    safe_config = config.copy()
    for key in ["oauth_client_secret", "access_token"]:
        if key in safe_config:
            safe_config[key] = "***masked***"
    logger.info(f"Configuration: {safe_config}")
```

#### 4. XML External Entities (XXE)

**Threats**: Not applicable (no XML parsing)

**Mitigations**: N/A (server doesn't parse XML)

#### 5. Broken Access Control

**Threats**:
- Unauthorized skill invocation
- Missing authorization checks
- Privilege escalation

**Mitigations**:
- ✅ **Authentication on Every Request**: OAuth validation before processing
- ✅ **No Cached Authorization**: Validate token fresh each time
- ✅ **Principle of Least Privilege**: Read-only access to skills
- ✅ **No Admin Backdoors**: No hardcoded bypass credentials

#### 6. Security Misconfiguration

**Threats**:
- Default credentials
- Debug mode in production
- Unnecessary features enabled

**Mitigations**:
- ✅ **No Defaults**: Require explicit OAuth configuration
- ✅ **Production Log Level**: INFO by default (not DEBUG)
- ✅ **Minimal Features**: Only essential features enabled
- ✅ **Secure Defaults**: Fail closed (deny by default)

#### 7. Cross-Site Scripting (XSS)

**Threats**: Not applicable (no HTML rendering)

**Mitigations**: N/A (CLI tool, no web interface)

#### 8. Insecure Deserialization

**Threats**:
- Malicious YAML deserialization
- Pickle attacks (if using pickle)

**Mitigations**:
- ✅ **Safe YAML Loading**: yaml.safe_load() only
- ✅ **No Pickle**: Never use pickle for untrusted data
- ✅ **JSON Only**: JSON-RPC uses json module (safe)

#### 9. Using Components with Known Vulnerabilities

**Threats**:
- Vulnerable dependencies
- Outdated libraries
- Unpatched security issues

**Mitigations**:
- ✅ **Dependency Scanning**: `pip-audit` in CI/CD
- ✅ **Minimal Dependencies**: <10 total dependencies
- ✅ **Version Pinning**: Specify minimum versions
- ✅ **Regular Updates**: Update dependencies quarterly

**CI/CD Check**:
```bash
# Check for known vulnerabilities
pip-audit

# Or with uv
uv pip install pip-audit
pip-audit
```

#### 10. Insufficient Logging & Monitoring

**Threats**:
- Security incidents undetected
- No audit trail
- Insufficient forensics

**Mitigations**:
- ✅ **Comprehensive Logging**: All auth events logged
- ✅ **Structured Logs**: Consistent format for parsing
- ✅ **Auth Failures Logged**: Failed OAuth validations logged with context
- ✅ **No Sensitive Data**: Logs never contain tokens or secrets

**What to Log**:
- ✅ Server startup and shutdown
- ✅ OAuth validation attempts (success and failure)
- ✅ Skill invocations (skill name, not content)
- ✅ Configuration errors
- ✅ File I/O errors
- ✅ Unusual activity (e.g., rapid requests)

**What NOT to Log**:
- ❌ OAuth tokens (access_token, refresh_token)
- ❌ OAuth secrets (client_secret)
- ❌ User passwords (N/A for OAuth)
- ❌ Full request/response bodies (may contain tokens)

---

### Additional Security Controls

#### CSRF Protection

**Status**: Not applicable (no web forms)

**Rationale**: stdio transport, not HTTP

#### Rate Limiting

**MVP**: Not implemented (local subprocess, single user)

**Future (P2 - Cloud Deployment)**:
- Limit requests per user: 100 req/min
- Limit OAuth validation calls: 10/min per token
- Block abusive IPs

#### Input Validation

**All External Inputs Validated**:

1. **JSON-RPC Messages**:
   - Schema validation (jsonrpc: "2.0", method, id)
   - Reject malformed JSON
   - Validate field types

2. **Skill Names**:
   - Pattern: `^[a-zA-Z0-9-_]+$` (alphanumeric, hyphens, underscores)
   - Max length: 100 characters
   - Reject special characters

3. **File Paths**:
   - No `..` (directory traversal)
   - Must be within project_root
   - Normalize with Path.resolve()

4. **OAuth Tokens**:
   - Basic format validation (not empty, reasonable length)
   - Provider validation (call introspection endpoint)

**Validation Example**:
```python
import re

def validate_skill_name(name: str) -> bool:
    """Validate skill name is safe."""
    if not name or len(name) > 100:
        return False

    # Alphanumeric, hyphens, underscores only
    if not re.match(r"^[a-zA-Z0-9-_]+$", name):
        return False

    return True
```

---

## Compliance Requirements

### GDPR (General Data Protection Regulation)

**Applicability**: If serving EU users

**Requirements**:
- **Data Minimization**: Collect only necessary data (we don't store user data)
- **Right to Deletion**: No user data stored (stateless)
- **Consent**: Not applicable (no data collection)
- **Data Portability**: Not applicable (no data storage)

**GDPR Compliance**: ✅ Compliant (no user data stored)

### CCPA (California Consumer Privacy Act)

**Applicability**: If serving California users

**Requirements**:
- **Disclosure**: Disclose data collection practices
- **Opt-Out**: Allow users to opt out of data sale
- **Access**: Provide access to collected data

**CCPA Compliance**: ✅ Compliant (no personal data collected or sold)

### SOC 2 (Service Organization Control)

**Applicability**: If enterprise customers require it

**Trust Service Criteria**:
- **Security**: Protect against unauthorized access ✅
- **Availability**: System is available as committed (99.9% uptime) ⏳ (P2)
- **Confidentiality**: Confidential data is protected ✅
- **Processing Integrity**: System processing is complete and accurate ✅
- **Privacy**: Personal information is protected ✅

**SOC 2 Status**: Partially compliant (security controls in place, audit not performed)

---

## Security Checklist

### Pre-Launch Security Review

- [ ] All secrets in environment variables (not code)
- [ ] .gitignore includes .env files
- [ ] OAuth tokens never logged
- [ ] HTTPS enforced for OAuth provider
- [ ] Path validation prevents directory traversal
- [ ] YAML safe loading (no code execution)
- [ ] Input validation on all external inputs
- [ ] Error messages don't expose sensitive data
- [ ] Dependency scan passes (pip-audit)
- [ ] No hardcoded credentials
- [ ] Authentication on every MCP request
- [ ] Logging includes auth events
- [ ] SSL certificate validation enabled

### Development Security Practices

- [ ] Never commit .env files
- [ ] Use separate OAuth apps for dev/staging/prod
- [ ] Rotate secrets after exposure (even in dev)
- [ ] Review code for secrets before commit
- [ ] Run security linters (bandit, safety)

---

## Security Incident Response

### Detection

**Monitoring**:
- Failed OAuth validation attempts
- Unusual request patterns
- File access errors (potential traversal attempts)

**Alerting** (P2):
- >10 failed auth attempts in 1 minute
- OAuth provider unreachable
- Unexpected errors in production

### Response

1. **Identify**: Determine what happened
2. **Contain**: Stop the attack (block IP, revoke tokens)
3. **Eradicate**: Remove vulnerabilities
4. **Recover**: Restore normal operation
5. **Lessons Learned**: Update security practices

### Reporting

**Security Issues**:
- Email: security@example.com (to be set up)
- GitHub Security Advisory (for responsible disclosure)
- Response time: <24 hours for critical issues

---

## Security Testing

### Security Tests Required

1. **Authentication Tests**:
   - Expired token rejected
   - Invalid token rejected
   - Missing token rejected
   - Valid token accepted

2. **Path Traversal Tests**:
   - `../../../etc/passwd` rejected
   - Paths outside project_root rejected
   - Symlink attacks prevented

3. **Input Validation Tests**:
   - Malformed JSON rejected
   - Invalid skill names rejected
   - SQL injection attempts blocked (N/A - no SQL)

4. **Secret Exposure Tests**:
   - Secrets not in logs
   - Secrets not in error messages
   - Secrets not in responses

---

Last updated: 2025-12-26
