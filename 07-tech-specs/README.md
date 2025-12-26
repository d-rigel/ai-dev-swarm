# Stage 7: Technical Specifications

## Overview

This stage defines the technical specifications for implementing the MCP Skills Server, including technology stack, security posture, CLI output standards, coding standards, testing standards, and security standards.

## Owners

- **Tech Manager (Architect)** (Lead): Tech stack selection, coding standards, testing standards
- **Security Engineer**: Security posture, authentication approach, secure coding standards
- **UI Designer**: CLI output formatting and documentation theme standards
- **DevOps Engineer**: Infrastructure compatibility, deployment feasibility

## Product Context

**MCP Skills Server** is a command-line subprocess that:
- Communicates via stdio (stdin/stdout, not HTTP)
- Reads SKILL.md files from filesystem (no database)
- Validates OAuth 2.1 tokens with external provider
- Implements 9 internal components (stateless design)
- Targets <2s startup, <100ms invocation latency

## Technical Approach

**Philosophy**: Choose proven, simple technologies that align with MCP ecosystem standards and support the stateless, file-based architecture.

**Key Decisions**:
1. **Python 3.8+** - MCP ecosystem standard, excellent library support
2. **Official MCP Python SDK** - Standard for MCP server implementation
3. **No Database** - File-based storage sufficient for use case
4. **OAuth 2.1 Validation Only** - Leverage external providers (Google, GitHub, Azure)
5. **pytest** - Industry-standard testing framework for Python

## Documentation Structure

- [`tech-stack.md`](./tech-stack.md) - Technology choices and rationale
- [`security.md`](./security.md) - Security posture, authentication, threat mitigation
- [`theme-standards.md`](./theme-standards.md) - CLI output formatting and documentation theme
- [`coding-standards.md`](./coding-standards.md) - Code style, naming conventions, organization
- [`testing-standards.md`](./testing-standards.md) - Test coverage, frameworks, test gates
- [`security-standards.md`](./security-standards.md) - Secure coding practices, logging redaction

## Key Technical Decisions

### Decision 1: Python 3.8+ (Not Node.js or Go)

**Rationale**:
- MCP ecosystem heavily uses Python
- Excellent library support (PyYAML, requests, pytest)
- Strong type hints (Python 3.8+)
- Wide adoption in AI/ML community
- Mature tooling (uv, black, pytest)

**Trade-offs**:
- ✅ Great library ecosystem
- ✅ Easy to read and maintain
- ✅ Strong MCP SDK support
- ⚠️ Slower than Go (acceptable for use case)
- ⚠️ GIL limitations for concurrency (mitigated by stateless design)

### Decision 2: Official MCP Python SDK

**Rationale**:
- Standard for MCP server implementation
- Handles stdio transport protocol
- Provides JSON-RPC message handling
- Well-documented and maintained

**Trade-offs**:
- ✅ Standard compliance
- ✅ Reduces boilerplate
- ✅ Community support
- ⚠️ Dependency on external SDK (acceptable for core protocol)

### Decision 3: No Web Framework (CLI-Only)

**Rationale**:
- stdio transport doesn't need HTTP server
- Simpler architecture (fewer dependencies)
- Faster startup time
- No need for Flask/FastAPI/etc.

**Trade-offs**:
- ✅ Minimal dependencies
- ✅ Faster startup
- ✅ Simpler deployment
- ⚠️ P2 SSE transport will need HTTP (deferred)

### Decision 4: OAuth 2.1 with External Providers

**Rationale**:
- Enterprise-friendly (Google, GitHub, Azure)
- No token issuance complexity
- PKCE support for security
- Proven standard

**Trade-offs**:
- ✅ Leverage existing infrastructure
- ✅ Enterprise SSO integration
- ✅ Security best practices
- ⚠️ Depends on provider availability

## Development Tools

**Package Management**: `uv` (fast, modern Python package manager)
**Code Formatting**: `black` (opinionated, consistent)
**Linting**: `ruff` (fast, modern linter)
**Type Checking**: `mypy` (static type checking)
**Testing**: `pytest` (industry standard)
**Documentation**: Markdown + MkDocs (optional for web docs)

## Standards Summary

| Standard | Key Requirements |
|----------|------------------|
| **Performance** | <2s startup, <100ms invocation, <200MB memory |
| **Security** | OAuth 2.1, no secrets in logs, input validation |
| **Code Coverage** | 80% minimum, 100% for critical paths |
| **Code Style** | Black formatting, 4 spaces, max 100 chars/line |
| **Python Version** | 3.8+ (support 3.8, 3.9, 3.10, 3.11, 3.12) |

## Next Steps

After tech specs approval:
→ Proceed to Stage 8: DevOps Setup (repository structure, CI/CD, MCP tools)

---

Last updated: 2025-12-26
