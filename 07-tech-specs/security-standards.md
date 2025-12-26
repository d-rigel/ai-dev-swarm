# Security Standards - MCP Skills Server

## Overview

This document defines secure coding practices, secret handling, logging standards, and security-specific development guidelines for the MCP Skills Server codebase.

**Security Philosophy**: Security is everyone's responsibility. Write code defensively, validate all inputs, and never trust external data.

---

## Secure Coding Practices

### 1. Input Validation

**Principle**: Validate all external inputs at system boundaries

**What to Validate**:
- User-provided arguments (CLI flags, env vars)
- MCP request payloads (JSON-RPC messages)
- Skill names and parameters
- File paths
- OAuth tokens
- Configuration values

**Example**:
```python
import re
from pathlib import Path

def validate_skill_name(name: str) -> bool:
    """Validate skill name is safe.

    Args:
        name: Skill name to validate

    Returns:
        True if valid, False otherwise
    """
    # Check not empty
    if not name or not isinstance(name, str):
        return False

    # Check length (prevent DoS with huge strings)
    if len(name) > 100:
        return False

    # Alphanumeric, hyphens, underscores only (prevent injection)
    if not re.match(r"^[a-zA-Z0-9-_]+$", name):
        return False

    return True


def validate_file_path(path: str, project_root: str) -> bool:
    """Validate file path is safe.

    Prevents directory traversal attacks like ../../../etc/passwd

    Args:
        path: File path to validate
        project_root: Root directory (all paths must be within this)

    Returns:
        True if valid, False otherwise

    Raises:
        ValueError: If path is outside project root
    """
    # Resolve to absolute path
    resolved_path = Path(path).resolve()
    resolved_root = Path(project_root).resolve()

    # Check path is within project root
    try:
        resolved_path.relative_to(resolved_root)
        return True
    except ValueError:
        # Path is outside project root - potential traversal attack
        raise ValueError(f"Path outside project root: {path}")
```

**Validation Checklist**:
- [ ] Check data type (isinstance)
- [ ] Check data length (prevent DoS)
- [ ] Check format (regex, schema)
- [ ] Check boundaries (min/max values)
- [ ] Sanitize special characters
- [ ] Validate against whitelist (not blacklist)

---

### 2. Path Traversal Prevention

**Risk**: Attackers could read arbitrary files (e.g., `../../../etc/passwd`)

**Mitigation**:
```python
from pathlib import Path

def safe_path_join(base_dir: str, user_path: str) -> Path:
    """Safely join paths, preventing directory traversal.

    Args:
        base_dir: Base directory (trusted)
        user_path: User-provided path (untrusted)

    Returns:
        Safe resolved path

    Raises:
        ValueError: If resolved path is outside base_dir
    """
    # Resolve both paths to absolute
    base = Path(base_dir).resolve()
    full_path = (base / user_path).resolve()

    # Ensure full_path is within base
    try:
        full_path.relative_to(base)
    except ValueError:
        raise ValueError(f"Path traversal attempt detected: {user_path}")

    return full_path


# Usage
try:
    safe_file = safe_path_join("/var/skills", user_input)
    with open(safe_file, "r") as f:
        content = f.read()
except ValueError as e:
    logger.warning(f"Path validation failed: {e}")
    raise
```

**Rules**:
- ✅ Always use `Path.resolve()` to normalize paths
- ✅ Always validate paths are within expected directory
- ✅ Never concatenate paths with string operations
- ❌ Never trust user-provided paths without validation

---

### 3. YAML Safe Loading

**Risk**: YAML can execute arbitrary Python code if loaded unsafely

**Mitigation**:
```python
import yaml

# GOOD: Safe loading (no code execution)
with open("skill.md", "r") as f:
    content = f.read()
    metadata = yaml.safe_load(frontmatter)  # ✅ Safe

# BAD: Unsafe loading (allows code execution)
# metadata = yaml.load(frontmatter)  # ❌ NEVER USE THIS
# metadata = yaml.load(frontmatter, Loader=yaml.Loader)  # ❌ DANGEROUS
```

**Why**:
- `yaml.load()` can execute arbitrary code embedded in YAML
- Attacker could create malicious SKILL.md with embedded code
- `yaml.safe_load()` only loads basic types (str, int, list, dict)

**Example Attack** (what we prevent):
```yaml
# Malicious SKILL.md frontmatter
---
name: !!python/object/apply:os.system ["rm -rf /"]
description: "Evil skill"
---
```

**Defense**: Always use `yaml.safe_load()`

---

### 4. Command Injection Prevention

**Risk**: If we execute shell commands with user input, attackers could inject malicious commands

**Mitigation**: Don't execute shell commands with user input

**Current Status**: ✅ MCP Skills Server does NOT execute shell commands

**If We Needed To** (for future reference):
```python
import subprocess

# BAD: Shell injection vulnerability
def run_command_bad(user_input):
    # If user_input = "skill; rm -rf /", this runs both commands!
    os.system(f"process-skill {user_input}")  # ❌ NEVER

# GOOD: Use subprocess with list (no shell)
def run_command_good(skill_name):
    # Validate input first
    if not validate_skill_name(skill_name):
        raise ValueError("Invalid skill name")

    # Use list (not string) - prevents injection
    subprocess.run(
        ["process-skill", skill_name],  # ✅ Safe
        shell=False,  # ✅ No shell interpretation
        check=True
    )
```

**Rules**:
- ✅ Avoid shell commands when possible
- ✅ If needed, use `subprocess.run()` with `shell=False`
- ✅ Pass arguments as list, not string
- ✅ Validate all inputs before passing to subprocess
- ❌ Never use `os.system()` or `shell=True` with user input

---

### 5. Secret Handling

**Secrets**: OAuth client secret, API keys, credentials

**Storage**:
- ✅ Environment variables (for local/subprocess)
- ✅ Secret management service (for cloud deployment)
- ❌ Never in code
- ❌ Never in configuration files committed to git

**Loading Secrets**:
```python
import os

# Load from environment
oauth_client_id = os.environ.get("MCP_OAUTH_CLIENT_ID")
oauth_client_secret = os.environ.get("MCP_OAUTH_CLIENT_SECRET")

# Validate secrets exist
if not oauth_client_id or not oauth_client_secret:
    raise ValueError("OAuth credentials not configured")

# Validate secret format (basic checks)
if len(oauth_client_secret) < 20:
    raise ValueError("OAuth client secret too short (possible misconfiguration)")
```

**Secret Validation**:
```python
def validate_secret_format(secret: str, secret_name: str) -> None:
    """Validate secret has expected format.

    Args:
        secret: Secret value
        secret_name: Name for error messages

    Raises:
        ValueError: If secret is invalid
    """
    if not secret:
        raise ValueError(f"{secret_name} is empty")

    if len(secret) < 16:
        raise ValueError(f"{secret_name} too short (minimum 16 characters)")

    # Check for common mistakes
    if secret in ["test", "secret", "password", "changeme"]:
        raise ValueError(f"{secret_name} appears to be a placeholder")
```

---

## Logging Security Standards

### 1. Never Log Secrets

**Secrets to NEVER Log**:
- OAuth tokens (access_token, refresh_token)
- OAuth client secrets
- API keys
- Passwords (N/A for this project)
- Encryption keys
- Any value marked as sensitive

**Masking Secrets**:
```python
import logging

logger = logging.getLogger(__name__)

def log_config_safely(config: dict) -> None:
    """Log configuration with secrets masked.

    Args:
        config: Configuration dictionary
    """
    # Define sensitive keys
    SENSITIVE_KEYS = {
        "oauth_client_secret",
        "access_token",
        "refresh_token",
        "api_key",
        "secret",
        "password",
    }

    # Create safe copy for logging
    safe_config = {}
    for key, value in config.items():
        # Check if key contains sensitive data
        is_sensitive = any(
            sensitive in key.lower()
            for sensitive in SENSITIVE_KEYS
        )

        if is_sensitive:
            safe_config[key] = "***masked***"
        else:
            safe_config[key] = value

    logger.info(f"Configuration loaded: {safe_config}")


# Usage
config = {
    "oauth_client_id": "abc123",
    "oauth_client_secret": "super_secret_value",
    "skills_dir": "/path/to/skills"
}

log_config_safely(config)
# Output: Configuration loaded: {'oauth_client_id': 'abc123', 'oauth_client_secret': '***masked***', 'skills_dir': '/path/to/skills'}
```

**Secret Masking Utility**:
```python
def mask_secret(secret: str, show_chars: int = 0) -> str:
    """Mask a secret value for logging.

    Args:
        secret: Secret to mask
        show_chars: Number of characters to show at end (default: 0)

    Returns:
        Masked string
    """
    if not secret:
        return "***empty***"

    if show_chars > 0 and len(secret) > show_chars:
        # Show last N characters for debugging
        return f"***{secret[-show_chars:]}"

    return "***masked***"


# Examples
logger.info(f"Client ID: {client_id}")  # OK - not sensitive
logger.info(f"Client secret: {mask_secret(client_secret)}")  # ✅ Masked
logger.info(f"Token: {mask_secret(token, show_chars=4)}")  # ✅ Shows last 4 chars
```

---

### 2. What to Log (Security Events)

**Always Log**:
- ✅ Server startup/shutdown
- ✅ Configuration loading (with secrets masked)
- ✅ OAuth validation attempts (success/failure)
- ✅ Authentication failures (with reason, no token)
- ✅ Authorization decisions
- ✅ Skill invocations (name only, not content)
- ✅ File access errors
- ✅ Path validation failures
- ✅ Unexpected errors

**Security Event Format**:
```python
# Authentication success
logger.info(
    f"[oauth] Token validated successfully "
    f"(user: {user_id}, expires: {expiry_time})"
)

# Authentication failure
logger.warning(
    f"[oauth] Token validation failed: {reason} "
    f"(provider: {provider}, token_hash: {hash(token)[:8]})"
)

# Authorization decision
logger.info(
    f"[authz] Access granted: user={user_id}, skill={skill_name}"
)

# Path validation failure (potential attack)
logger.warning(
    f"[security] Path traversal attempt detected: "
    f"path={user_path}, base={base_dir}"
)

# Skill invocation
logger.info(
    f"[invocation] Skill invoked: {skill_name} "
    f"(user: {user_id}, latency: {latency}ms)"
)
```

---

### 3. Log Injection Prevention

**Risk**: Attacker injects newlines in log messages to forge log entries

**Example Attack**:
```python
# Attacker provides: "user123\n[INFO] [admin] User promoted to admin"
user_id = user_input  # Unsanitized

# This logs:
# [INFO] [oauth] User logged in: user123
# [INFO] [admin] User promoted to admin  <- Forged!
logger.info(f"User logged in: {user_id}")
```

**Mitigation**:
```python
def sanitize_log_value(value: str) -> str:
    """Sanitize value for safe logging.

    Removes newlines, control characters, and limits length.

    Args:
        value: Value to sanitize

    Returns:
        Sanitized value safe for logging
    """
    if not isinstance(value, str):
        value = str(value)

    # Remove newlines and control characters
    sanitized = value.replace('\n', '\\n').replace('\r', '\\r')
    sanitized = ''.join(char for char in sanitized if ord(char) >= 32)

    # Limit length (prevent DoS with huge log entries)
    max_length = 200
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length] + "...(truncated)"

    return sanitized


# Usage
logger.info(f"User logged in: {sanitize_log_value(user_id)}")
# Output: User logged in: user123\n[INFO] [admin] User promoted to admin
```

---

### 4. Sensitive Data in Logs

**Never Log**:
- Full OAuth tokens
- Client secrets
- User passwords (N/A)
- PII (if we collected it)
- Full request/response bodies (may contain tokens)

**Can Log** (after sanitization):
- User IDs (if not sensitive)
- Skill names
- File paths (validate first)
- Error messages (sanitized)
- Performance metrics
- Timestamps

**Token Hashing for Debugging**:
```python
import hashlib

def get_token_hash(token: str) -> str:
    """Get hash of token for debugging logs.

    Allows correlating log entries without exposing token.

    Args:
        token: OAuth token

    Returns:
        First 8 characters of SHA-256 hash
    """
    token_bytes = token.encode('utf-8')
    hash_hex = hashlib.sha256(token_bytes).hexdigest()
    return hash_hex[:8]  # First 8 chars sufficient


# Usage
logger.debug(
    f"Validating token (hash: {get_token_hash(token)}) "
    f"with provider: {provider_url}"
)
# Output: Validating token (hash: a3f5b8c2) with provider: https://...
```

---

## Error Handling Security

### 1. Don't Expose Internal Details

**Bad** (exposes implementation):
```python
try:
    conn = connect_to_db(config["db_host"])
except Exception as e:
    # Exposes internal paths, credentials
    return f"Database error: {str(e)}"  # ❌
```

**Good** (safe error message):
```python
try:
    conn = connect_to_db(config["db_host"])
except DatabaseConnectionError as e:
    # Log full error (with secrets masked)
    logger.error(f"Database connection failed: {e}", exc_info=True)

    # Return safe error to user
    return "Service temporarily unavailable. Please try again later."  # ✅
```

### 2. Fail Securely

**Principle**: If something goes wrong, fail closed (deny access)

**Examples**:
```python
def validate_token(token: str) -> bool:
    """Validate OAuth token.

    Returns:
        True if valid, False if invalid or error
    """
    try:
        response = oauth_provider.validate(token)
        return response.get("active", False)
    except Exception as e:
        # On error, deny access (fail closed)
        logger.error(f"OAuth validation error: {e}")
        return False  # ✅ Deny on error


def check_permission(user: str, resource: str) -> bool:
    """Check if user has permission.

    Returns:
        True if permitted, False otherwise
    """
    try:
        perms = get_user_permissions(user)
        return resource in perms
    except Exception:
        # On error, deny (fail closed)
        return False  # ✅ Deny on error
```

---

## Dependency Security

### 1. Dependency Scanning

**Requirement**: Scan dependencies for known vulnerabilities

**Tool**: `pip-audit` (or `safety`)

**CI/CD Check**:
```bash
# Install pip-audit
pip install pip-audit

# Scan dependencies
pip-audit

# Exit code 0 if no vulnerabilities, non-zero if found
```

**GitHub Actions Integration**:
```yaml
- name: Scan dependencies for vulnerabilities
  run: |
    pip install pip-audit
    pip-audit
```

**Frequency**:
- Run on every PR (CI/CD)
- Run weekly on main branch (scheduled)
- Update dependencies when vulnerabilities found

---

### 2. Pin Dependency Versions

**Requirement**: Pin minimum versions (not exact versions)

**Format**: `package>=min_version`

**Example** (`requirements.txt` or `pyproject.toml`):
```toml
[project]
dependencies = [
    "mcp>=0.1.0",
    "pyyaml>=6.0",
    "requests>=2.31.0",  # 2.31.0 fixes CVE-2023-32681
    "python-dotenv>=1.0.0",
]
```

**Why `>=` not `==`**:
- Allows security patches (e.g., 2.31.0 → 2.31.1)
- Prevents dependency conflicts
- More flexible for library consumers

**When to use `==`**:
- Lock file for reproducible deployments (requirements.lock)
- Never in library dependencies

---

### 3. Minimize Dependencies

**Principle**: Every dependency is a potential vulnerability

**Current Dependencies**: ~4-5 production dependencies
- mcp (required for MCP protocol)
- pyyaml (required for YAML parsing)
- requests (required for OAuth HTTP calls)
- python-dotenv (optional, dev convenience)

**Review Before Adding**:
- Is this dependency necessary?
- Can we use stdlib instead?
- Is it actively maintained?
- Does it have known vulnerabilities?
- How many transitive dependencies does it add?

---

## Code Review Security Checklist

**Before Approving PR**:

### Input Validation
- [ ] All external inputs are validated
- [ ] File paths are validated (no traversal)
- [ ] Skill names match allowed pattern
- [ ] JSON-RPC messages are validated

### Secret Handling
- [ ] No secrets in code
- [ ] No secrets in logs
- [ ] Secrets loaded from env vars
- [ ] Secret masking in error messages

### Error Handling
- [ ] Errors don't expose internal details
- [ ] Fail securely (deny on error)
- [ ] All exceptions are caught and logged
- [ ] No silent failures

### Logging
- [ ] All authentication events logged
- [ ] No secrets in logs
- [ ] Log messages sanitized (no injection)
- [ ] Appropriate log level used

### Dependencies
- [ ] No new dependencies without justification
- [ ] Dependencies pinned with minimum version
- [ ] `pip-audit` passes

### YAML/File Operations
- [ ] `yaml.safe_load()` used (not `yaml.load()`)
- [ ] File operations use context managers (`with`)
- [ ] Paths validated before file operations

---

## Security Testing Requirements

### 1. Authentication Tests

```python
def test_expired_token_rejected():
    """Test that expired OAuth token is rejected."""
    validator = OAuthValidator()

    # Mock OAuth provider returning expired token
    with mock_oauth_response(active=False):
        result = validator.validate_token("expired_token")

    assert result is False


def test_invalid_token_rejected():
    """Test that invalid token is rejected."""
    validator = OAuthValidator()

    with mock_oauth_error():
        result = validator.validate_token("invalid_token")

    assert result is False
```

### 2. Path Traversal Tests

```python
def test_path_traversal_prevented():
    """Test that directory traversal is prevented."""
    base_dir = "/var/skills"

    # Attempt traversal attack
    with pytest.raises(ValueError, match="Path traversal"):
        safe_path_join(base_dir, "../../../etc/passwd")


def test_symlink_traversal_prevented():
    """Test that symlink traversal is prevented."""
    # Test with symlink pointing outside base dir
    # Implementation depends on requirements
    pass
```

### 3. Input Validation Tests

```python
def test_skill_name_validation():
    """Test skill name validation."""
    # Valid names
    assert validate_skill_name("init-ideas") is True
    assert validate_skill_name("my_skill_123") is True

    # Invalid names (injection attempts)
    assert validate_skill_name("skill; rm -rf /") is False
    assert validate_skill_name("skill/../../../etc/passwd") is False
    assert validate_skill_name("skill\n[ADMIN]") is False
    assert validate_skill_name("a" * 101) is False  # Too long
```

### 4. Secret Exposure Tests

```python
def test_secrets_not_in_logs(caplog):
    """Test that secrets are never in logs."""
    config = ConfigManager(
        oauth_client_secret="my_super_secret_value"
    )

    # Log configuration
    config.log_config()

    # Assert secret not in logs
    assert "my_super_secret_value" not in caplog.text
    assert "***masked***" in caplog.text


def test_secrets_not_in_errors():
    """Test that secrets are not in error messages."""
    try:
        # Trigger error with secret in context
        raise_auth_error(token="secret_token_value")
    except Exception as e:
        error_msg = str(e)
        assert "secret_token_value" not in error_msg
```

---

## Security Monitoring

### What to Monitor (Production)

**Authentication Metrics**:
- OAuth validation success rate
- OAuth validation failures (by reason)
- OAuth provider latency
- OAuth provider errors

**Security Events**:
- Path validation failures (potential attacks)
- Invalid skill name attempts
- Failed authentication attempts
- Unusual request patterns

**Alerting** (P2 - Cloud Deployment):
- >10 failed auth attempts in 1 minute
- OAuth provider unreachable for >5 minutes
- Path traversal attempts detected
- Unexpected errors spike

---

## Secure Development Workflow

### 1. Pre-Commit

```bash
# Run before every commit
pytest tests/unit/
ruff check .
mypy mcp_skills_server/

# Optional: pre-commit hook
pip install pre-commit
pre-commit install
```

### 2. Pull Request

```bash
# Run before creating PR
pytest  # All tests
pytest --cov=mcp_skills_server --cov-report=term-missing  # Coverage
pip-audit  # Dependency scan
bandit -r mcp_skills_server/  # Security linter (optional)
```

### 3. Security Review

**Every PR should be reviewed for**:
- Input validation
- Secret handling
- Error handling
- Logging practices
- Dependency changes

---

## Security Incident Response

### 1. Vulnerability Disclosure

**Report Security Issues**:
- Email: security@example.com (to be configured)
- GitHub Security Advisory (private disclosure)
- Response time: <24 hours for critical issues

**Do NOT**:
- Open public GitHub issues for vulnerabilities
- Discuss vulnerabilities publicly before fix

### 2. Incident Response Plan

1. **Identify**: Confirm vulnerability exists
2. **Assess**: Determine severity and impact
3. **Fix**: Develop and test patch
4. **Deploy**: Release security update
5. **Notify**: Inform users if needed
6. **Retrospective**: Document lessons learned

---

## Security Resources

### OWASP Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Python Security](https://owasp.org/www-project-python-security/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

### Python Security
- [Python Security Guide](https://python.readthedocs.io/en/stable/library/security_warnings.html)
- [Bandit Security Linter](https://bandit.readthedocs.io/)
- [pip-audit](https://github.com/pypa/pip-audit)

### OAuth 2.1
- [OAuth 2.1 Specification](https://oauth.net/2.1/)
- [OAuth Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

Last updated: 2025-12-26
