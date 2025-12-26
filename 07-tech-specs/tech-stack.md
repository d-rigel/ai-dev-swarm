# Technology Stack - MCP Skills Server

## Overview

This document defines the complete technology stack for implementing the MCP Skills Server, including rationale for each choice and alternatives considered.

**Architecture Type**: Command-line subprocess with stdio transport (not web application)

---

## Technology Selection Criteria

When evaluating technologies, we prioritized:

1. **MCP Ecosystem Compatibility**: Standard tools used in MCP server development
2. **Architecture Alignment**: Supports stateless, file-based, stdio-based design
3. **Performance**: Meets <2s startup and <100ms invocation targets
4. **Simplicity**: Minimal dependencies, easy to understand and maintain
5. **Community Support**: Active maintenance, good documentation, large ecosystem
6. **Team Expertise**: Leverage AI-assisted development capabilities
7. **Long-term Maintainability**: Stable, well-supported technologies

---

## Core Technology Stack

### Programming Language: Python 3.8+

**Choice**: Python 3.8 or higher

**Rationale**:
- **MCP Standard**: Python is the primary language for MCP server development
- **Library Ecosystem**: Excellent libraries for all our needs (PyYAML, requests, pytest)
- **Type Safety**: Python 3.8+ has strong type hints support
- **AI-Friendly**: Easy to read, write, and debug with AI assistance
- **Performance**: Fast enough for our use case (<100ms target achievable)
- **Cross-Platform**: Works on macOS, Linux, Windows

**Version Support**:
- **Minimum**: Python 3.8 (for type hints and modern features)
- **Recommended**: Python 3.10+ (better type hints, performance improvements)
- **Maximum**: Python 3.12 (test compatibility)

**Alternatives Considered**:
- **Node.js/TypeScript**: Rejected - not standard in MCP ecosystem, async complexity
- **Go**: Rejected - less common for MCP servers, steeper learning curve
- **Rust**: Rejected - over-engineering for this use case, harder to maintain

---

### MCP Framework: Official MCP Python SDK

**Choice**: `@modelcontextprotocol/sdk` Python implementation

**Rationale**:
- **Standard Compliance**: Official SDK ensures MCP protocol compliance
- **stdio Transport**: Built-in support for stdin/stdout communication
- **JSON-RPC Handling**: Handles message parsing and formatting
- **Well-Documented**: Official documentation and examples
- **Active Maintenance**: Maintained by Anthropic/MCP team

**Core Capabilities**:
- stdio transport (StdioServerTransport)
- JSON-RPC 2.0 message handling
- MCP protocol methods (list_tools, call_tool, etc.)
- Type-safe server implementation

**Documentation**: https://modelcontextprotocol.io/docs/

**Alternatives Considered**:
- **Custom Implementation**: Rejected - reinventing the wheel, error-prone
- **Other SDKs**: Rejected - official SDK is the standard

---

## Dependencies (Python Libraries)

### Core Dependencies (Production)

1. **MCP SDK** (`mcp`)
   - Purpose: MCP protocol implementation
   - Why: Official standard for MCP servers
   - License: MIT (check latest)

2. **PyYAML** (`pyyaml >= 6.0`)
   - Purpose: Parse YAML frontmatter in SKILL.md files
   - Why: Industry standard YAML parser, fast, safe
   - License: MIT

3. **Requests** (`requests >= 2.31.0`)
   - Purpose: HTTP calls to OAuth provider for token validation
   - Why: Simple, reliable, widely used
   - License: Apache 2.0

4. **python-dotenv** (`python-dotenv >= 1.0.0`)
   - Purpose: Load environment variables from .env files (development)
   - Why: Simplifies local development configuration
   - License: BSD-3-Clause

**Total Production Dependencies**: ~4-5 (minimal dependency footprint)

### Development Dependencies

1. **pytest** (`pytest >= 7.4.0`)
   - Purpose: Testing framework
   - Why: Industry standard, excellent plugin ecosystem
   - License: MIT

2. **pytest-cov** (`pytest-cov >= 4.1.0`)
   - Purpose: Code coverage reporting
   - Why: Integrates with pytest, generates coverage reports
   - License: MIT

3. **black** (`black >= 23.7.0`)
   - Purpose: Code formatting
   - Why: Opinionated, consistent, automatic
   - License: MIT

4. **ruff** (`ruff >= 0.0.286`)
   - Purpose: Linting (replaces flake8, pylint, isort, etc.)
   - Why: Fast (10-100x faster than alternatives), comprehensive
   - License: MIT

5. **mypy** (`mypy >= 1.5.0`)
   - Purpose: Static type checking
   - Why: Catches type errors before runtime
   - License: MIT

6. **pytest-mock** (`pytest-mock >= 3.11.1`)
   - Purpose: Mocking for tests
   - Why: Simplifies mocking OAuth calls and file I/O
   - License: MIT

---

## CLI Framework

**Choice**: `argparse` (built-in Python module)

**Rationale**:
- **Built-in**: No external dependency
- **Sufficient**: Handles our CLI needs (flags, options, help text)
- **Standard**: Familiar to Python developers
- **Fast**: No import overhead

**CLI Arguments**:
```python
--skills-dir <path>          # Skills directory path
--log-level <level>          # DEBUG, INFO, WARNING, ERROR
--oauth-client-id <id>       # OAuth client ID
--oauth-client-secret <secret> # OAuth client secret (or env var)
--config <file>              # Config file (v1.0 feature)
--validate-config            # Validate config and exit
--version                    # Show version and exit
```

**Alternatives Considered**:
- **Click**: Rejected - unnecessary dependency for simple CLI
- **Typer**: Rejected - over-engineering for our use case

---

## Configuration Management

**Choice**: Multi-source configuration (CLI flags > env vars > defaults)

**Implementation**:
- **CLI Flags**: argparse for command-line arguments
- **Environment Variables**: os.environ for env var reading
- **Config File** (v1.0): YAML or TOML for file-based config
- **Precedence**: CLI flags override env vars override config file override defaults

**No External Library Needed**: Built-in Python modules sufficient

**Configuration Sources**:
1. Command-line flags (highest priority)
2. Environment variables (MCP_OAUTH_CLIENT_ID, MCP_OAUTH_CLIENT_SECRET, etc.)
3. Config file (v1.0 feature) - ~/.mcp-skills-server/config.yaml
4. Hardcoded defaults (lowest priority)

---

## Logging

**Choice**: Built-in `logging` module

**Rationale**:
- **Built-in**: No external dependency
- **Flexible**: Supports multiple handlers, formatters, levels
- **Structured**: Can add structured logging with custom formatters
- **Standard**: Every Python developer knows logging

**Log Format**:
```
[%(asctime)s] [%(levelname)s] [%(name)s] %(message)s
```

**Example**:
```
[2025-12-26 16:30:45] [INFO] [server] MCP Skills Server v0.1.0 starting...
[2025-12-26 16:30:46] [INFO] [discovery] Found 3 skills
```

**Log Levels**:
- **DEBUG**: Detailed info for troubleshooting (disabled by default)
- **INFO**: Normal operations (default)
- **WARNING**: Unexpected but recoverable issues
- **ERROR**: Errors preventing operation

**Log Destination**: stderr (can be redirected to file or log aggregation)

**Alternatives Considered**:
- **structlog**: Rejected - unnecessary for MVP (can add in v1.0 if needed)
- **loguru**: Rejected - external dependency not worth it for simple logging

---

## YAML Parsing

**Choice**: PyYAML

**Rationale**:
- **Standard**: De facto standard for YAML in Python
- **Safe Loading**: `yaml.safe_load()` prevents code execution
- **Fast**: C-based parser available (libyaml)
- **Well-Tested**: Mature library, widely used

**Usage**:
```python
import yaml

with open("SKILL.md", "r") as f:
    content = f.read()
    # Extract frontmatter between --- delimiters
    metadata = yaml.safe_load(frontmatter_content)
```

**Alternatives Considered**:
- **ruamel.yaml**: Rejected - more complex, overkill for our needs
- **pyyaml-env-tag**: Rejected - don't need env var substitution in SKILL.md

---

## HTTP Client (OAuth Calls)

**Choice**: `requests` library

**Rationale**:
- **Simple API**: Easy to use, clear syntax
- **Reliable**: Battle-tested, widely used
- **Features**: Handles timeouts, retries, SSL validation
- **Standard**: De facto standard for HTTP in Python

**Usage**:
```python
import requests

response = requests.post(
    "https://oauth2.googleapis.com/tokeninfo",
    data={"access_token": token},
    timeout=30
)
```

**Alternatives Considered**:
- **httpx**: Rejected - async not needed for our use case
- **urllib3**: Rejected - lower-level, more complex
- **aiohttp**: Rejected - async overhead not worth it

---

## File I/O

**Choice**: Built-in Python file operations

**Rationale**:
- **Built-in**: No external dependency
- **Simple**: open(), read(), exists() sufficient
- **Cross-Platform**: Works on all OS
- **Fast**: Direct OS calls

**Implementation**:
```python
import os
from pathlib import Path

# Check file exists
if Path(skill_path).exists():
    # Read file
    with open(skill_path, "r", encoding="utf-8") as f:
        content = f.read()
```

**Alternatives Considered**:
- **pathlib.Path.read_text()**: Considered - will use for cleaner code
- **watchdog**: For file watching (v1.0 feature for hot reload)

---

## Testing Framework

**Choice**: `pytest`

**Rationale**:
- **Standard**: Industry standard for Python testing
- **Powerful**: Fixtures, parametrize, plugins
- **Clear**: Simple assert syntax
- **Ecosystem**: Huge plugin ecosystem (coverage, mocking, etc.)

**Plugins Used**:
- **pytest-cov**: Code coverage reporting
- **pytest-mock**: Mocking support
- **pytest-asyncio**: Async test support (if needed)

**Test Structure**:
```
tests/
├── unit/
│   ├── test_config.py
│   ├── test_discovery.py
│   ├── test_registry.py
│   └── test_oauth.py
├── integration/
│   ├── test_startup.py
│   ├── test_skill_invocation.py
│   └── test_oauth_flow.py
└── conftest.py (shared fixtures)
```

**Alternatives Considered**:
- **unittest**: Rejected - more verbose, less features
- **nose2**: Rejected - less active than pytest

---

## Code Quality Tools

### Formatter: Black

**Choice**: `black`

**Rationale**:
- **Opinionated**: No configuration debates
- **Consistent**: Same output every time
- **Fast**: Quick formatting
- **Standard**: Widely adopted in Python community

**Configuration**: Minimal (pyproject.toml)
```toml
[tool.black]
line-length = 100
target-version = ['py38', 'py39', 'py310', 'py311', 'py312']
```

### Linter: Ruff

**Choice**: `ruff`

**Rationale**:
- **Fast**: 10-100x faster than flake8/pylint
- **Comprehensive**: Replaces flake8, isort, pyupgrade, and more
- **Consistent**: Works well with Black
- **Modern**: Built in Rust, actively developed

**Rules Enabled**:
- Pyflakes (F) - detect errors
- pycodestyle (E, W) - PEP 8 style
- isort (I) - import sorting
- pyupgrade (UP) - upgrade syntax
- flake8-bugbear (B) - find bugs

### Type Checker: Mypy

**Choice**: `mypy`

**Rationale**:
- **Standard**: De facto standard for Python type checking
- **Strict Mode**: Can enforce strict type checking
- **Gradual Typing**: Can add types incrementally
- **IDE Support**: Excellent VSCode/PyCharm integration

**Configuration** (pyproject.toml):
```toml
[tool.mypy]
python_version = "3.8"
strict = true
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
```

---

## Package Management

**Choice**: `uv` (preferred) or `pip`

**Rationale for uv**:
- **Fast**: 10-100x faster than pip
- **Modern**: Built in Rust, like Cargo for Python
- **Reliable**: Deterministic dependency resolution
- **Drop-in Replacement**: Works with existing requirements.txt

**Installation**:
```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv pip install -r requirements.txt

# Install in development mode
uv pip install -e ".[dev]"
```

**Fallback to pip**: If uv not available, pip works fine (just slower)

**Alternatives Considered**:
- **Poetry**: Rejected - too opinionated, complex lock file
- **Pipenv**: Rejected - slower, less active development
- **pip-tools**: Considered - good for requirements compilation

---

## Deployment & Distribution

**Choice**: Python package (installable via pip/uv)

**Distribution Format**:
- **Source Distribution**: sdist (.tar.gz)
- **Wheel**: bdist_wheel (.whl)

**Installation**:
```bash
# From PyPI (when published)
uv pip install mcp-skills-server

# From source (development)
uv pip install -e .
```

**Package Structure** (pyproject.toml):
```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "mcp-skills-server"
version = "0.1.0"
description = "MCP Skills Server for AI agent skill execution"
authors = [{name = "Your Name", email = "you@example.com"}]
license = {text = "MIT"}
requires-python = ">=3.8"
dependencies = [
    "mcp",
    "pyyaml>=6.0",
    "requests>=2.31.0",
    "python-dotenv>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-cov>=4.1.0",
    "pytest-mock>=3.11.1",
    "black>=23.7.0",
    "ruff>=0.0.286",
    "mypy>=1.5.0",
]

[project.scripts]
mcp-skills-server = "mcp_skills_server.cli:main"
```

---

## No Database Needed

**Decision**: File-based storage only (no database)

**Rationale**:
- **Simple**: No database setup, migration, or management
- **Fast**: Filesystem reads are fast (<30ms for typical SKILL.md)
- **Git-Friendly**: Skills versioned with git
- **Stateless**: No data persistence needed
- **Sufficient**: Registry is in-memory hash map (O(1) lookup)

**What Would Require a Database**:
- Skill usage analytics (deferred to v1.0+)
- User session storage (not needed, OAuth tokens validated each request)
- Caching (in-memory sufficient for MVP, can add Redis in v1.0)

---

## External Services

### OAuth Provider

**Supported Providers**:
- Google OAuth 2.0
- GitHub OAuth
- Azure AD OAuth
- Any OAuth 2.1 compliant provider

**Why External Provider**:
- **Enterprise Integration**: Companies already use these providers
- **No Token Management**: We validate, not issue tokens
- **Security**: Leverage provider's security infrastructure
- **SSO**: Single Sign-On with existing identity providers

**API Used**:
- OpenID Connect Discovery (.well-known/openid-configuration)
- Token Introspection Endpoint (validate tokens)

---

## Optional Services (P1/P2)

### Error Tracking (P1)

**Choice**: Sentry (optional, configurable)

**Rationale**:
- **Free Tier**: Sufficient for most use cases
- **Python SDK**: Easy integration
- **Features**: Error grouping, stack traces, context
- **Optional**: Can be disabled via environment variable

### Monitoring (P2)

**Choice**: Prometheus + Grafana (for cloud deployment)

**Rationale**:
- **Standard**: Industry standard for metrics
- **Open Source**: Free, self-hostable
- **Ecosystem**: Large plugin ecosystem

**Not Needed for MVP**: Local subprocess doesn't need monitoring

---

## Technology Stack Summary

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| **Language** | Python | 3.8+ | MCP standard, great ecosystem |
| **MCP SDK** | Official MCP Python SDK | Latest | Standard compliance |
| **YAML Parser** | PyYAML | 6.0+ | Safe, fast, standard |
| **HTTP Client** | requests | 2.31.0+ | Simple, reliable |
| **CLI Framework** | argparse | Built-in | No dependency, sufficient |
| **Logging** | logging | Built-in | Standard Python logging |
| **Testing** | pytest | 7.4.0+ | Industry standard |
| **Formatter** | black | 23.7.0+ | Opinionated, consistent |
| **Linter** | ruff | 0.0.286+ | Fast, comprehensive |
| **Type Checker** | mypy | 1.5.0+ | Standard type checking |
| **Package Manager** | uv (or pip) | Latest | Fast, modern |

**Total Production Dependencies**: 4-5 libraries
**Total Development Dependencies**: 6-7 libraries

**Dependency Philosophy**: Minimize dependencies, prefer built-in modules, choose battle-tested libraries.

---

Last updated: 2025-12-26
